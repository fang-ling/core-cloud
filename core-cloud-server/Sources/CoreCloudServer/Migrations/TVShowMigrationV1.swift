//
//  TVShowMigrationV1.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/10/19.
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

struct TVShowMigrationV1: AsyncMigration {
  var name = "TVShowMigrationV1"

  func prepare(on database: any Database) async throws {
    try await database.schema(TVShow.schema)
      .field(TVShow.FieldKeys.id, .int64, .identifier(auto: true))
      .field(TVShow.FieldKeys.title, .string, .required)
      .field(TVShow.FieldKeys.starring, .string, .required)
      .field(TVShow.FieldKeys.genre, .string, .required)
      .field(TVShow.FieldKeys.startYear, .int64, .required)
      .field(TVShow.FieldKeys.endYear, .int64, .required)
      .field(TVShow.FieldKeys.region, .string, .required)
      .field(TVShow.FieldKeys.description, .string, .required)
      .field(TVShow.FieldKeys.posterURLs, .string, .required)
      .field(TVShow.FieldKeys.artworkURLs, .string, .required)
      .field(TVShow.FieldKeys.titleLogoURLs, .string)
      .field(TVShow.FieldKeys.studio, .string, .required)
      .field(
        TVShow.FieldKeys.userID,
        .int64,
        .required,
        .references(User.schema, User.FieldKeys.id)
      )
      .field(TVShow.FieldKeys.createdAt, .datetime)
      .field(TVShow.FieldKeys.updatedAt, .datetime)
      .unique(
        on: TVShow.FieldKeys.title,
        TVShow.FieldKeys.startYear,
        TVShow.FieldKeys.endYear,
        TVShow.FieldKeys.userID
      )
      .create()
  }

  func revert(on database: any Database) async throws {
    try await database.schema(TVShow.schema).delete()
  }
}
