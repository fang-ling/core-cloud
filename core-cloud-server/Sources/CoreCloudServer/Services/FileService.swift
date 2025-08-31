//
//  FileService.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/23.
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
import Vapor

struct FileService {
  func getFiles(
    for userID: User.IDValue,
    application: String,
    locationID: Int64,
    on database: Database
  ) async throws -> [(
    id: Int64,
    name: String,
    kind: String,
    size: Int64,
    date: Date
  )] {
    do {
      let files = try await File.query(on: database)
        .filter(\.$user.$id == userID)
        .filter(\.$location.$id == locationID)
        .filter(\.$application == application)
        .all()

      return try files.map { file in
        (
          id: try file.requireID(),
          name: file.name,
          kind: file.kind,
          size: file.size,
          date: file.createdAt ?? Date(timeIntervalSince1970: 0)
        )
      }
    } catch {
      throw FileError.databaseError
    }
  }

  /**
   * Returns a file by its identifier for a specified user.
   *
   * - Parameters:
   *   - id: An identifier for the file.
   *   - userID: An identifier for the user requesting the file.
   *   - database: The database instance from which the file will be retrieved.
   *
   * - Returns:
   *   - kind: The kind of the file.
   *   - application: The application of the file.
   *
   * - Throws:
   *   - ``FileError/noSuchFile``: if the file is not found.
   *   - ``FileError/databaseError``: if there is an issue accessing the
   *                                  database.
   */
  func getFile(
    by id: File.IDValue,
    for userID: User.IDValue,
    on database: Database
  ) async throws -> (
    kind: String,
    application: String
  ) {
    do {
      guard let file = try await File.query(on: database)
        .filter(\.$id == id)
        .filter(\.$user.$id == userID)
        .first()
      else {
        throw FileError.noSuchFile
      }

      return (
        kind: file.kind,
        application: file.application
      )
    } catch FileError.noSuchFile {
      throw FileError.noSuchFile
    } catch {
      throw FileError.databaseError
    }
  }

  func kindToContentType(kind: String) -> String {
    if (kind == "Apple MPEG-4 Audio") {
      return "audio/mp4"
    }
    return ""
  }
}
