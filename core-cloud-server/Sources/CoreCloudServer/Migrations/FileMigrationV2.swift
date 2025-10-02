//
//  FileMigrationV2.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/10/2.
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

struct FileMigrationV2: AsyncMigration {
  var name = "FileMigrationV2"

  func prepare(on database: any Database) async throws {
    /**
     * Move "{locationPath}/{locationID}/{userID}/{app}/{fileID}-{N}.sealedbox"
     * To "{locationPath}/{locationID}/{userID}/{app}/{fileID}/"
     */
    let locations = try await Location.query(on: database).all()
    for location in locations {
      try await FileSystem.shared.withDirectoryHandle(
        atPath: FilePath(location.path)
      ) { directory in
        for try await entries in directory.listContents(recursive: true) {
          if entries.name.extension == "sealedbox" {
            /* entries.name.stem: {fileID}-{N} */
            let fileID = Int64(
              entries.name.stem.components(separatedBy: "-").first!
            )!
            let index = Int64(
              entries.name.stem.components(separatedBy: "-").last!
            )!

            let file = try await File.query(on: database)
              .filter(\.$id == fileID)
              .first()!

            /* Create the new directory if necessary. */
            let filePath = try FilePath(
              "\(location.path)/" +
              "\(location.requireID())/" +
              "\(file.$user.id)/" +
              "\(file.application)/" +
              "\(fileID)"
            )
            if (try await FileSystem.shared.info(forFileAt: filePath)) == nil {
              print("Create \(filePath)")
              try await FileSystem.shared.createDirectory(
                at: filePath,
                withIntermediateDirectories: true
              )
            }

            /* Move file. */
            let sourceFilePath = try FilePath(
              "\(location.path)/" +
              "\(location.requireID())/" +
              "\(file.$user.id)/" +
              "\(file.application)/" +
              "\(fileID)-\(index).sealedbox"
            )
            let destinationFilePath = try FilePath(
              "\(location.path)/" +
              "\(location.requireID())/" +
              "\(file.$user.id)/" +
              "\(file.application)/" +
              "\(fileID)/" +
              "\(fileID)-\(index).sealedbox"
            )
            print("Move \(sourceFilePath) to \(destinationFilePath)")
            try await FileSystem.shared.moveItem(
              at: sourceFilePath,
              to: destinationFilePath
            )
          }
        }
      }
    }
  }

  func revert(on database: any Database) async throws { }
}
