//
//  AlbumMigrationV1.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/9/9.
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

struct AlbumMigrationV1: AsyncMigration {
  var name = "AlbumMigrationV1"

  func prepare(on database: any Database) async throws {
    try await database.schema(Album.schema)
      .field(Album.FieldKeys.id, .int64, .identifier(auto: true))
      .field(Album.FieldKeys.name, .string, .required)
      .field(Album.FieldKeys.artist, .string, .required)
      .field(Album.FieldKeys.genre, .string, .required)
      .field(Album.FieldKeys.year, .int64, .required)
      .field(Album.FieldKeys.artworkURLs, .string, .required)
      .field(
        Album.FieldKeys.userID,
        .int64,
        .required,
        .references(User.schema, User.FieldKeys.id)
      )
      .field(Album.FieldKeys.createdAt, .datetime)
      .field(Album.FieldKeys.updatedAt, .datetime)
      .unique(
        on: Album.FieldKeys.name,
        Album.FieldKeys.artist,
        Album.FieldKeys.year,
        Album.FieldKeys.userID
      )
      .create()
  }

  func revert(on database: any Database) async throws {
    try await database.schema(Album.schema)
      .delete()
  }
}
