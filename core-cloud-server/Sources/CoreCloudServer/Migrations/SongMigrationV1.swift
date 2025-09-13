//
//  SongMigrationV1.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/31.
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

struct SongMigrationV1: AsyncMigration {
  var name = "SongMigrationV1"

  func prepare(on database: any Database) async throws {
    try await database.schema(Song.schema)
      .field(Song.FieldKeys.id, .int64, .identifier(auto: true))
      .field(Song.FieldKeys.title, .string, .required)
      .field(Song.FieldKeys.artist, .string, .required)
      .field(Song.FieldKeys.Removed.genre, .string, .required)
      .field(Song.FieldKeys.Removed.year, .int64, .required)
      .field(Song.FieldKeys.trackNumber, .int64, .required)
      .field(Song.FieldKeys.discNumber, .int64, .required)
      .field(Song.FieldKeys.playCount, .int64, .required)
      .field(Song.FieldKeys.sampleSize, .int64, .required)
      .field(Song.FieldKeys.sampleRate, .int64, .required)
      .field(
        Song.FieldKeys.fileID,
        .int64,
        .required,
        .references(File.schema, File.FieldKeys.id)
      )
      .field(
        Song.FieldKeys.userID,
        .int64,
        .required,
        .references(User.schema, User.FieldKeys.id)
      )
      .field(Song.FieldKeys.createdAt, .datetime)
      .field(Song.FieldKeys.updatedAt, .datetime)
      .unique(on: Song.FieldKeys.fileID, Song.FieldKeys.userID)
      .create()
  }

  func revert(on database: any Database) async throws {
    try await database.schema(Song.schema)
      .delete()
  }
}
