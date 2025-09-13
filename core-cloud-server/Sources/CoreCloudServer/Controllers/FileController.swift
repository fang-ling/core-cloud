//
//  FileController.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/17.
//

import Fluent
import NIOFileSystem
import Vapor

struct FileController: RouteCollection {
  let fileService = FileService()
  let userTokenService = UserTokenService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("file")
      .on(.POST, body: .stream, use: insertFileHandler)

    routes
      .grouped("api")
      .grouped("file")
      .get(use: fetchFileHandler)

    routes
      .grouped("api")
      .grouped("files")
      .get(use: fetchFilesHandler)
  }

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

    let userID: User.IDValue
    do {
      let jwt = request.headers.cookie?.all[CoreCloudServer.COOKIE_NAME]?.string
      let id = try await userTokenService.verifyUserToken(
        from: jwt ?? ""
      ) { token in
        try await request.jwt.verify(token)
      }
      userID = id
    } catch {
      return .unauthorized
    }

    guard let token = request
      .headers
      .cookie?
      .all[CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME]?
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

      if (try await FileSystem.shared.info(forFileAt: FilePath(path))) == nil {
        try await FileSystem.shared.createDirectory(
          at: FilePath(path),
          withIntermediateDirectories: true
        )
      }
    } catch {
      request.logger.warning("\(error)")
      return .badRequest
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
    let userID: User.IDValue
    do {
      let jwt = request.headers.cookie?.all[CoreCloudServer.COOKIE_NAME]?.string
      let id = try await userTokenService.verifyUserToken(
        from: jwt ?? ""
      ) { token in
        try await request.jwt.verify(token)
      }
      userID = id
    } catch {
      return Response(status: .unauthorized)
    }

    guard let token = request
      .headers
      .cookie?
      .all[CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME]?
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

  func fetchFilesHandler(request: Request) async -> Response {
    let userID: User.IDValue
    do {
      let jwt = request.headers.cookie?.all[CoreCloudServer.COOKIE_NAME]?.string
      let id = try await userTokenService.verifyUserToken(
        from: jwt ?? ""
      ) { token in
        try await request.jwt.verify(token)
      }
      userID = id
    } catch {
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
        application: fetchRequest.application,
        locationID: fetchRequest.locationID,
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
                date: Int64((file.date.timeIntervalSince1970 * 1000).rounded())
              )
            }
          )
        )
      )
    } catch {
      return Response(status: .serviceUnavailable)
    }
  }
}
