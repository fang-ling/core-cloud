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
  /**
   * Returns a list of files for a specified user.
   *
   * - Parameters:
   *   - userID: An identifier for the user whose files are being retrieved.
   *   - fields: The fields of the file to retrieve.
   *   - filters: The filter rules to apply during the retrieval query.
   *   - database: The database instance from which the files will be fetched.
   *
   * - Returns: An array of tuples, each containing the file details.
   *
   * - Throws:
   *   - ``FileError/databaseError``: if there is an issue accessing the
   *                                  database.
   */
  func getFiles(
    for userID: User.IDValue,
    fields: [String],
    filters: [String],
    on database: Database
  ) async throws -> [(
    id: Int64,
    name: String?,
    kind: String?,
    size: Int64?,
    date: Date?
  )] {
    do {
      var query = File.query(on: database).filter(\.$user.$id == userID)

      for filter in filters {
        if filter.contains("_EQUALS_") {
          let entry = filter.components(separatedBy: "_EQUALS_")
          if entry.count < 2 {
            continue
          }

          if entry[0] == "locationID", let id = Int64(entry[1]) {
            query = query.filter(\.$location.$id == id)
          } else if entry[0] == "application" {
            query = query.filter(\.$application == entry[1])
          } else if entry[0] == "kind" {
            query = query.filter(\.$kind == entry[1])
          }
        }
      }

      return try await query
        .all()
        .map { file in
          (
            id: try file.requireID(),
            name: fields.contains("name") ? file.name : nil,
            kind: fields.contains("kind") ? file.kind : nil,
            size: fields.contains("size") ? file.size : nil,
            date: fields.contains("date") ? file.createdAt : nil
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
