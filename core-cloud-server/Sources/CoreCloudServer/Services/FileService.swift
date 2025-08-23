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

  func kindToContentType(kind: String) -> String {
    if (kind == "Apple MPEG-4 Audio") {
      return "audio/mp4"
    }
    return ""
  }
}
