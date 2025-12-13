//
//  FileMigrationV3.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/12/13.
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

import Crypto
import Fluent
import NIOFileSystem

struct FileMigrationV3: AsyncMigration {
  var name = "FileMigrationV3"

  func prepare(on database: any Database) async throws {
    let files = try await File.query(on: database)
      .with(\.$location)
      .all()

    for file in files {
      let fileID = try file.requireID()

      database.logger.notice("Consolidating file (id = \(fileID))")

      let consolidatedFilePath = try FilePath(
        "\(file.location.path)/" +
        "\(file.location.requireID())/" +
        "\(file.$user.id)/" +
        "\(file.application)/" +
        "\(fileID).sealedbox"
      )

      var sha512 = SHA512()
      var originalChecksum: SHA512.Digest? = nil
      var originalSize = 0
      var offset = Int64(0)

      try await FileSystem.shared.withFileHandle(
        forWritingAt: consolidatedFilePath,
        options: .modifyFile(createIfNecessary: true)
      ) { fileHandle in
        let maxIndex = (
          (file.size / CoreCloudServer.chunkSize) +
          (file.size % CoreCloudServer.chunkSize == 0 ? 0 : 1)
        )

        for index in 0 ..< maxIndex {
          let chunkFilePath = try FilePath(
            "\(file.location.path)/" +
            "\(file.location.requireID())/" +
            "\(file.$user.id)/" +
            "\(file.application)/" +
            "\(fileID)/" +
            "\(fileID)-\(index).sealedbox"
          )

          try await FileSystem.shared.withFileHandle(
            forReadingAt: chunkFilePath
          ) { readFileHandle in
            var buffer = try await readFileHandle.readToEnd(
              maximumSizeAllowed: ByteCount.bytes(
                CoreCloudServer.chunkSize + 28
              )
            )
            guard let sealedBoxData = buffer.readData(
              length: buffer.readableBytes
            ) else {
              database.logger.error("Failed to read chunk: \(chunkFilePath)")
              throw Error.fatalError
            }
            sha512.update(data: sealedBoxData)
            originalSize += sealedBoxData.count

            try await fileHandle.write(
              contentsOf: sealedBoxData,
              toAbsoluteOffset: offset
            )
            offset += Int64(sealedBoxData.count)
          }
        }

        originalChecksum = sha512.finalize()
      }

      database.logger.notice("Verifying file (id = \(fileID))")
      sha512 = .init()
      var newChecksum: SHA512.Digest? = nil
      var newSize = 0

      try await FileSystem.shared.withFileHandle(
        forReadingAt: consolidatedFilePath
      ) { fileHandle in

        for try await var buffer in fileHandle.readChunks() {
          guard let data = buffer.readData(length: buffer.readableBytes) else {
            database.logger.error("Error in reading: \(consolidatedFilePath)")
            throw Error.fatalError
          }
          sha512.update(data: data)
          newSize += data.count
        }

        newChecksum = sha512.finalize()
      }

      if newSize != originalSize {
        database.logger.error("File (id = \(fileID)) size not matched")
        throw Error.fatalError
      }

      if newChecksum != originalChecksum {
        database.logger.error("File (id = \(fileID)) checksum not matched")
        throw Error.fatalError
      }

      let chunksFilePath = try FilePath(
        "\(file.location.path)/" +
        "\(file.location.requireID())/" +
        "\(file.$user.id)/" +
        "\(file.application)/" +
        "\(fileID)"
      )
      database.logger.notice(
        "Migrating file (id = \(fileID)) successful, removing \(chunksFilePath)"
      )
      try await FileSystem.shared.removeItem(at: chunksFilePath)
    }
  }
  
  func revert(on database: any Database) async throws { }
}

extension FileMigrationV3 {
  enum Error: Swift.Error {
    case fatalError
  }
}
