//
//  HomeVideoMigrationV1.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/10/5.
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

struct HomeVideoMigrationV1: AsyncMigration {
  var name = "HomeVideoMigrationV1"

  func prepare(on database: any Database) async throws {
    try await database.schema(HomeVideo.schema)
      .field(HomeVideo.FieldKeys.id, .int64, .identifier(auto: true))
      .field(HomeVideo.FieldKeys.title, .string, .required)
      .field(HomeVideo.FieldKeys.cast, .string, .required)
      .field(HomeVideo.FieldKeys.director, .string, .required)
      .field(HomeVideo.FieldKeys.genre, .string, .required)
      .field(HomeVideo.FieldKeys.tags, .string, .required)
      .field(HomeVideo.FieldKeys.date, .datetime, .required)
      .field(HomeVideo.FieldKeys.duration, .int64, .required)
      .field(HomeVideo.FieldKeys.artworkURLs, .string, .required)
      .field(HomeVideo.FieldKeys.width, .int64, .required)
      .field(HomeVideo.FieldKeys.height, .int64, .required)
      .field(HomeVideo.FieldKeys.isHDR, .bool, .required)
      .field(HomeVideo.FieldKeys.videoCodec, .string, .required)
      .field(HomeVideo.FieldKeys.audioCodec, .string, .required)
      .field(
        HomeVideo.FieldKeys.fileID,
        .int64,
        .required,
        .references(File.schema, File.FieldKeys.id)
      )
      .field(
        HomeVideo.FieldKeys.userID,
        .int64,
        .required,
        .references(User.schema, User.FieldKeys.id)
      )
      .field(HomeVideo.FieldKeys.createdAt, .datetime)
      .field(HomeVideo.FieldKeys.updatedAt, .datetime)
      .unique(on: HomeVideo.FieldKeys.fileID, HomeVideo.FieldKeys.userID)
      .create()
  }

  func revert(on database: any Database) async throws {
    try await database.schema(HomeVideo.schema)
      .delete()
  }
}
