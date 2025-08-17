//
//  LocationMigrationV1.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/17.
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

struct LocationMigrationV1: AsyncMigration {
  var name = "LocationMigrationV1"

  func prepare(on database: any FluentKit.Database) async throws {
    try await database.schema(Location.schema)
      .field(Location.FieldKeys.id, .int64, .identifier(auto: true))
      .field(Location.FieldKeys.name, .string, .required)
      .field(Location.FieldKeys.path, .string, .required)
      .field(
        Location.FieldKeys.userID,
        .int64,
        .required,
        .references(User.schema, User.FieldKeys.id)
      )
      .field(Location.FieldKeys.createdAt, .datetime)
      .field(Location.FieldKeys.updatedAt, .datetime)
      .unique(on: Location.FieldKeys.userID, Location.FieldKeys.path)
      .create()
  }

  func revert(on database: any FluentKit.Database) async throws {
    try await database.schema(Location.schema)
      .delete()
  }
}
