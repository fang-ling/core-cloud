//
//  FileController.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/17.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//

import Fluent
import NIOFileSystem
import Vapor

struct FileController: RouteCollection {
  let fileService = FileService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("ws")
      .grouped("file")
      .grouped(AuthenticatorMiddleware())
      .webSocket(
        maxFrameSize: WebSocketMaxFrameSize(integerLiteral: 4 * 1024 * 1024),
        onUpgrade: insertFileHandler
      )

    routes
      .grouped("api")
      .grouped("file")
      .grouped(AuthenticatorMiddleware())
      .on(.POST, body: .stream, use: insertFileHandler)

    routes
      .grouped("api")
      .grouped("file")
      .grouped(AuthenticatorMiddleware())
      .get(use: fetchFileHandler)

    routes
      .grouped("api")
      .grouped("files")
      .grouped(AuthenticatorMiddleware())
      .get(use: fetchFilesHandler)
  }

  /**
   * The WebSocket-based uploader exists only as a stopgap for large file
   * uploads.
   * WebKit currently lacks support for ReadableStream in fetch request bodies,
   * which prevents efficient streaming over plain HTTP. This implementation
   * works around that limitation but is significantly slower and less optimal.
   * Once WebKit adds ReadableStream support (or our clients can polyfill it),
   * plan to retire this WebSocket path in favor of a proper streaming HTTP
   * upload.
   */
  func insertFileHandler(request: Request, webSocket: WebSocket) async {
    @Sendable
    func removeFiles(at path: FilePath, fileID: Int64) async throws {
      _ = try await FileSystem.shared.withDirectoryHandle(
        atPath: path
      ) { directory in
        for try await entry in directory.listContents() {
          if (
            entry.name.stem.starts(with: "\(fileID)-") &&
            entry.name.extension == "sealedbox"
          ) {
            request.logger.notice("\(entry.path) is deleted.")
            try await FileSystem.shared.removeItem(at: entry.path)
          }
        }
      }
    }

    actor FilePathStore {
      var path = FilePath()

      func update(_ path: FilePath) {
        self.path = path
      }

      func get() -> FilePath {
        return path
      }
    }

    actor IndexStore {
      var index: Int64 = 0

      func update(_ index: Int64) {
        self.index = index
      }

      func get() -> Int64 {
        return index
      }
    }

    actor SizeStore {
      var size: Int64 = 0

      func update(_ size: Int64) {
        self.size = size
      }

      func get() -> Int64 {
        return size
      }
    }

    actor HasherStore {
      var hasher = SHA512()

      func update(_ hasher: SHA512) {
        self.hasher = hasher
      }

      func get() -> SHA512 {
        return hasher
      }
    }

    guard let userID = request.userID else {
      request.logger.notice("JWT verify failed: \(request.cookies)")
      try? await webSocket.close()
      return
    }

    guard let token = request
      .cookies
      .all[CoreCloudServer.Cookie.Keys.applicationToken]?
      .string,
          let decryptionKeySealedBoxKeyData = Data(base64Encoded: token)
    else {
      request.logger.notice("Unauthorized: \(request.cookies)")
      try? await webSocket.close()
      return
    }

    let key = SymmetricKey(size: .bits256)
    let decryptionKeySealedBoxKey = SymmetricKey(
      data: decryptionKeySealedBoxKeyData
    )
    let decryptionKeySealedBox: AES.GCM.SealedBox
    do {
      decryptionKeySealedBox = try AES.GCM.seal(
        key.withUnsafeBytes({ Data($0) }),
        using: decryptionKeySealedBoxKey
      )
    } catch {
      request.logger.notice("Unauthorized: \(request.cookies)")
      try? await webSocket.close()
      return
    }

    let file = File(
      name: "",
      kind: "",
      size: 0,
      checksum: Data(),
      application: "",
      decryptionKeySealedBox: decryptionKeySealedBox.combined ?? Data(),
      locationID: 0,
      userID: userID
    )

    let pathStore = FilePathStore()
    let indexStore = IndexStore()
    let sizeStore = SizeStore()
    let hasherStore = HasherStore()

    webSocket.onText { webSocket, message in
      guard let data = message.data(using: .utf8),
            let json = try? JSONSerialization.jsonObject(
              with: data
            ) as? [String: Any],
            let type = json["type"] as? String else {
        return
      }

      switch type {
      case "metadata":
        guard let name = json["name"] as? String,
              let kind = json["kind"] as? String,
              let size = json["size"] as? Int64,
              let checksum = json["checksum"] as? String,
              let application = json["application"] as? String,
              let locationID = json["locationID"] as? Int64
        else {
          request.logger.notice("Bad Request in metadata WebSocket")
          try? await webSocket.close()
          return
        }

        file.name = name
        file.kind = kind
        file.size = size
        file.checksum = Data(base64Encoded: checksum) ?? Data()
        file.application = application
        file.$location.id = locationID

        do {
          try await file.save(on: request.db)
        } catch {
          request.logger.notice("Bad Request: \(file)")
          try? await webSocket.close()
        }

        do {
          let location = try await Location.query(on: request.db)
            .filter(\.$id == file.$location.id)
            .filter(\.$user.$id == userID)
            .first()

          let path = try await pathStore
            .get()
            .appending(location?.path ?? "")
            .appending("\(location?.requireID() ?? 0)")
            .appending("\(userID)")
            .appending("\(file.application)")
            .appending("\(file.requireID())")
          await pathStore.update(path)

          let info = try await FileSystem.shared.info(forFileAt: path)
          if info == nil {
            request.logger.notice("Creating: \(path)")
            try await FileSystem.shared.createDirectory(
              at: path,
              withIntermediateDirectories: true
            )
          }
        } catch {
          request.logger.notice("Bad Request: \(file)")
          try? await file.delete(on: request.db)
          try? await webSocket.close()
        }

        try? await webSocket.send(#"{"status":"metadata"}"#)

      case "complete":
        let hasher = await hasherStore.get()
        let serverChecksum = hasher.finalize()
        let actualSize = await sizeStore.get()
        let path = await pathStore.get()

        if Data(serverChecksum) != file.checksum || actualSize != file.size {
          request.logger.notice(
            "\((try? file.requireID()) ?? -1) checksum or size not matched"
          )
          try? await removeFiles(at: path, fileID: file.requireID())
          try? await file.delete(on: request.db)
          try? await webSocket.close()
        }
        try? await webSocket.send(#"{"status":"ok"}"#)
        try? await webSocket.close()

      default: break
      }
    }

    webSocket.onBinary { webSocket, byteBuffer in
      var byteBuffer = byteBuffer

      var hasher = await hasherStore.get()
      let path = await pathStore.get()
      let index = await indexStore.get()
      let size = await sizeStore.get()
      do {
        let count = Int64(byteBuffer.readableBytes)
        if let buffer = byteBuffer.readData(length: Int(count)) {
          /* Update digest */
          hasher.update(data: buffer)

          /* Encryption */
          let sealedBox = try AES.GCM.seal(buffer, using: key)

          /* Write the file */
          let filePath = try path.appending(
            "\(file.requireID())-\(index).sealedbox"
          )
          request.logger.notice("Writing file at: \(filePath)")
          _ = try await FileSystem.shared.withFileHandle(
            forWritingAt: filePath
          ) { file in
            try await file.write(
              contentsOf: sealedBox.combined!,
              toAbsoluteOffset: 0
            )
          }
        }

        await hasherStore.update(hasher)
        await indexStore.update(index + 1)
        await sizeStore.update(size + count)
      } catch {
        request.logger.error("\(error)")
        try? await removeFiles(at: path, fileID: file.requireID())
        try? await file.delete(on: request.db)
        try? await webSocket.close()
      }

      try? await webSocket.send(#"{"status":"chunk"}"#)
    }

    try? await webSocket.send(#"{"status":"ready"}"#)
  }

  /**
   * We are intentionally keeping the HTTP upload path enabled.
   * The current testing framework relies on HTTP-based uploads to validate
   * file handling behavior
   */
  func insertFileHandler(request: Request) async -> HTTPStatus {
    func saveFile(
      byteBuffer: inout ByteBuffer,
      hasher: inout SHA512,
      index: Int64
    ) async throws -> Int64 {
      let count = Int64(byteBuffer.readableBytes)

      if let buffer = byteBuffer.readData(length: Int(count)) {
        /* Update digest */
        hasher.update(data: buffer)
        /* Encryption */
        let sealedBox = try AES.GCM.seal(buffer, using: key)
        /* Save */
        _ = try await FileSystem.shared.withFileHandle(
          forWritingAt: FilePath(
            "\(path)/\(file.requireID())-\(index).sealedbox"
          )
        ) { file in
          try await file.write(
            contentsOf: sealedBox.combined!,
            toAbsoluteOffset: 0
          )
        }
      }

      return count
    }

    func deleteFiles(path: FilePath, fileID: Int64) async throws {
      _ = try await FileSystem.shared.withDirectoryHandle(
        atPath: path
      ) { directory in
        for try await entry in directory.listContents() {
          if (
            entry.name.stem.starts(with: "\(fileID)-") &&
            entry.name.extension == "sealedbox"
          ) {
            request.logger.notice("\(entry.path) is deleted.")
            try await FileSystem.shared.removeItem(at: entry.path)
          }
        }
      }
    }

    /* Using guard crashes the 6.2 compiler—only God knows why. */
    let userID = request.userID ?? -1
    if userID == -1 {
      return .unauthorized
    }

    guard let token = request
      .cookies
      .all[CoreCloudServer.Cookie.Keys.applicationToken]?
      .string,
          let decryptionKeySealedBoxKeyData = Data(base64Encoded: token)
    else {
      return .unauthorized
    }

    let insertRequest: File.Singular.Input.Insertion
    do {
      insertRequest = try request.query.decode(
        File.Singular.Input.Insertion.self
      )
    } catch {
      return .badRequest
    }

    let key = SymmetricKey(size: .bits256)
    let decryptionKeySealedBoxKey = SymmetricKey(
      data: decryptionKeySealedBoxKeyData
    )
    let decryptionKeySealedBox: AES.GCM.SealedBox
    do {
      decryptionKeySealedBox = try AES.GCM.seal(
        key.withUnsafeBytes({ Data($0) }),
        using: decryptionKeySealedBoxKey
      )
    } catch {
      return .unauthorized
    }

    let file = File(
      name: insertRequest.name,
      kind: insertRequest.kind,
      size: insertRequest.size,
      checksum: Data(base64Encoded: insertRequest.checksum) ?? Data(),
      application: insertRequest.application,
      decryptionKeySealedBox: decryptionKeySealedBox.combined ?? Data(),
      locationID: insertRequest.locationID,
      userID: userID
    )
    do {
      try await file.save(on: request.db)
    } catch {
      request.logger.warning("\(error)")
      return .serviceUnavailable
    }

    var path: String
    do {
      guard let location = try await Location.query(on: request.db)
        .filter(\.$id == insertRequest.locationID)
        .filter(\.$user.$id == userID)
        .first()
      else {
        return .badRequest
      }

      path = "\(location.path)/"
      path += "\(try location.requireID())/"
      path += "\(userID)/"
      path += "\(insertRequest.application)/"
      path += "\(try file.requireID())"

      if (try await FileSystem.shared.info(forFileAt: FilePath(path))) == nil {
        try await FileSystem.shared.createDirectory(
          at: FilePath(path),
          withIntermediateDirectories: true
        )
      }
    } catch {
      do {
        try await file.delete(on: request.db)
      } catch {
        request.logger.warning("\(error)")
        return .serviceUnavailable
      }

      request.logger.warning("\(error)")
      return .badRequest
    }

    do {
      var digest = SHA512()
      var index: Int64 = 0
      var accumulator = ByteBuffer()
      var actualSize: Int64 = 0

      for try await chunk in request.body {
        var chunk = chunk
        while chunk.readableBytes > 0 {
          let neededBytes = (
            Int(CoreCloudServer.CHUNK_SIZE) - accumulator.readableBytes
          )
          let bytesToRead = min(chunk.readableBytes, neededBytes)

          if var slice = chunk.readSlice(length: bytesToRead) {
            accumulator.writeBuffer(&slice)
          }

          if accumulator.readableBytes == CoreCloudServer.CHUNK_SIZE {
            actualSize += try await saveFile(
              byteBuffer: &accumulator,
              hasher: &digest,
              index: index
            )
            accumulator.clear()
            index += 1
          }
        }
      }
      /* Process the (possible) remaining data. */
      if accumulator.readableBytes > 0 {
        actualSize += try await saveFile(
          byteBuffer: &accumulator,
          hasher: &digest,
          index: index
        )
      }

      let serverChecksum = digest.finalize()
      if (
        Data(serverChecksum) != file.checksum ||
        actualSize != file.size
      ) {
        request.logger.notice(
          "\((try? file.requireID()) ?? -1) checksum or size not matched"
        )
        try await deleteFiles(path: FilePath(path), fileID: file.requireID())
        try await File.query(on: request.db)
          .filter(\.$id == file.requireID())
          .delete()
        return .badRequest
      }

      return .created
    } catch {
      request.logger.warning("\(error)")
      do {
        try await deleteFiles(path: FilePath(path), fileID: file.requireID())
        try await File.query(on: request.db)
          .filter(\.$id == file.requireID())
          .delete()
      } catch {
        request.logger.warning("\(error)")
      }
      return .internalServerError
    }
  }

  func fetchFileHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return Response(status: .unauthorized)
    }

    guard let token = request
      .cookies
      .all[CoreCloudServer.Cookie.Keys.applicationToken]?
      .string,
          let decryptionKeySealedBoxKeyData = Data(base64Encoded: token)
    else {
      return Response(status: .unauthorized)
    }
    let decryptionKeySealedBoxKey = SymmetricKey(
      data: decryptionKeySealedBoxKeyData
    )

    let fetchRequest: File.Singular.Input.Retrieval
    do {
      fetchRequest = try request.query.decode(
        File.Singular.Input.Retrieval.self
      )
    } catch {
      return Response(status: .badRequest)
    }

    let file: File
    do {
      guard let _file = try await File.query(on: request.db)
        .filter(\.$id == fetchRequest.id)
        .filter(\.$application == fetchRequest.application)
        .filter(\.$user.$id == userID)
        .first()
      else {
        return Response(status: .notFound)
      }
      file = _file
    } catch {
      return Response(status: .serviceUnavailable)
    }
    let decryptionKey: SymmetricKey
    do {
      let decryptionKeySealedBox = try AES.GCM.SealedBox(
        combined: file.decryptionKeySealedBox
      )
      let decryptionKeyData = try AES.GCM.open(
        decryptionKeySealedBox,
        using: decryptionKeySealedBoxKey
      )
      decryptionKey = SymmetricKey(data: decryptionKeyData)
    } catch {
      return Response(status: .unauthorized)
    }

    let path: String
    do {
      guard let location = try await Location.query(on: request.db)
        .filter(\.$id == file.$location.id)
        .filter(\.$user.$id == userID)
        .first()
      else {
        return Response(status: .badRequest)
      }

      var _path = "\(location.path)/"
      _path += "\(try location.requireID())/"
      _path += "\(userID)/"
      _path += "\(fetchRequest.application)/"
      _path += "\(try file.requireID())"

      path = _path
    } catch {
      return Response(status: .serviceUnavailable)
    }

    var _startByte: Int64 = 0
    var _endByte: Int64 = file.size - 1
    if let range = request.headers.range {
      if range.unit == .bytes && range.ranges.count == 1 {
        let rangeString = range.ranges[0].serialize()
        if rangeString.hasPrefix("-") {
          _endByte = Int64(rangeString.dropFirst()) ?? _endByte
        } else if rangeString.hasSuffix("-") {
          _startByte = Int64(rangeString.dropLast()) ?? 0
        } else {
          let components = rangeString.components(separatedBy: "-")
          _startByte = Int64(components[0]) ?? _startByte
          _endByte = Int64(components[1]) ?? _endByte
        }
      }
    }
    let startByte = _startByte
    let endByte = _endByte

    if startByte >= file.size || endByte >= file.size {
      return Response(status: .rangeNotSatisfiable)
    }

    let response = Response(
      status: .partialContent,
      headers: .init([
        (
          "Content-Type",
          fileService.kindToContentType(kind: file.kind)
        ),
        (
          "Content-Range",
          "bytes \(startByte)-\(endByte)/\(file.size)"
        )
      ]),
      body: .init(
        managedAsyncStream: { writer in
          let startIndex = startByte / CoreCloudServer.CHUNK_SIZE
          let endIndex = endByte / CoreCloudServer.CHUNK_SIZE

          let startOffset = startByte - startIndex * CoreCloudServer.CHUNK_SIZE
          let endOffset = endByte - endIndex * CoreCloudServer.CHUNK_SIZE

          do {
            for index in startIndex ... endIndex {
              let filePath = try FilePath(
                "\(path)/\(file.requireID())-\(index).sealedbox"
              )
              try await FileSystem.shared.withFileHandle(
                forReadingAt: filePath
              ) { file in
                var chunk = try await file.readToEnd(
                  maximumSizeAllowed: .bytes(
                    CoreCloudServer.CHUNK_SIZE + 16 + 12 /* tag + nonce */
                  )
                )

                guard let sealedBoxData = chunk.readData(
                  length: chunk.readableBytes
                ) else {
                  throw Abort(.internalServerError)
                }
                let sealedBox = try AES.GCM.SealedBox(combined: sealedBoxData)
                let plaintext = try AES.GCM.open(
                  sealedBox,
                  using: decryptionKey
                )

                if startIndex == endIndex {
                  try await writer.writeBuffer(
                    ByteBuffer(
                      data: plaintext[startOffset ... endOffset]
                    )
                  )
                } else if index == startIndex {
                  try await writer.writeBuffer(
                    ByteBuffer(
                      data: plaintext[Int(startOffset) ..< plaintext.count]
                    )
                  )
                } else if index == endIndex {
                  try await writer.writeBuffer(
                    ByteBuffer(
                      data: plaintext[0 ... endOffset]
                    )
                  )
                } else {
                  try await writer.writeBuffer(ByteBuffer(data: plaintext))
                }
              }
            }
          } catch {
            request.logger.warning("\(error)")
          }
        }
      )
    )
    response.headers.replaceOrAdd(
      name: "Content-Length",
      value: "\(endByte - startByte + 1)"
    )
    response.headers.remove(name: "Transfer-Encoding")
    return response
  }

  /**
   * - URL: GET /api/files
   *
   * - Response Codes:
   *   - 200 OK: The songs are returned.
   *   - 400 Bad Request: The server cannot or will not process the request due
   *                      to an apparent client error.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func fetchFilesHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return Response(status: .unauthorized)
    }

    let fetchRequest: File.Plural.Input.Retrieval
    do {
      fetchRequest = try request.query.decode(
        File.Plural.Input.Retrieval.self
      )
    } catch {
      return Response(status: .badRequest)
    }

    do {
      let files = try await fileService.getFiles(
        for: userID,
        fields: fetchRequest.fields.components(separatedBy: ","),
        filters: fetchRequest.filters.components(separatedBy: ","),
        on: request.db
      )

      return try Response(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            files.map { file in
              File.Plural.Output.Retrieval(
                id: file.id,
                name: file.name,
                kind: file.kind,
                size: file.size,
                date: file.date != nil
                  ? Int64((file.date!.timeIntervalSince1970 * 1000).rounded())
                  : nil
              )
            }
          )
        )
      )
    } catch FileError.databaseError {
      return Response(status: .serviceUnavailable)
    } catch {
      return Response(status: .internalServerError)
    }
  }
}
