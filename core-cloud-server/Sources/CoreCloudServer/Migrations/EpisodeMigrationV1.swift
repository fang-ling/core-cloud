//
//  EpisodeMigrationV1.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/10/26.
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

struct EpisodeMigrationV1: AsyncMigration {
  var name = "EpisodeMigrationV1"

  func prepare(on database: any Database) async throws {
    try await database.schema(Episode.schema)
      .field(Episode.FieldKeys.id, .int64, .identifier(auto: true))
      .field(Episode.FieldKeys.title, .string, .required)
      .field(Episode.FieldKeys.artworkURLs, .string, .required)
      .field(Episode.FieldKeys.description, .string, .required)
      .field(Episode.FieldKeys.date, .datetime, .required)
      .field(Episode.FieldKeys.episodeNumber, .int64, .required)
      .field(Episode.FieldKeys.seasonNumber, .int64, .required)
      .field(Episode.FieldKeys.duration, .int64, .required)
      .field(Episode.FieldKeys.width, .int64, .required)
      .field(Episode.FieldKeys.height, .int64, .required)
      .field(Episode.FieldKeys.isHDR, .bool, .required)
      .field(Episode.FieldKeys.videoCodec, .string, .required)
      .field(Episode.FieldKeys.audioCodec, .string, .required)
      .field(
        Episode.FieldKeys.fileID,
        .int64,
        .required,
        .references(File.schema, File.FieldKeys.id)
      )
      .field(
        Episode.FieldKeys.userID,
        .int64,
        .required,
        .references(User.schema, User.FieldKeys.id)
      )
      .field(
        Episode.FieldKeys.tvShowID,
        .int64,
        .required,
        .references(TVShow.schema, TVShow.FieldKeys.id)
      )
      .field(Episode.FieldKeys.createdAt, .datetime)
      .field(Episode.FieldKeys.updatedAt, .datetime)
      .unique(on: Episode.FieldKeys.fileID, Episode.FieldKeys.userID)
      .create()
  }

  func revert(on database: any Database) async throws {
    try await database.schema(Episode.schema).delete()
  }
}
