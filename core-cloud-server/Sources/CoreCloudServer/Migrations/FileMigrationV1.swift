//
//  FileMigrationV1.swift
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

struct FileMigrationV1: AsyncMigration {
  var name = "FileMigrationV1"

  func prepare(on database: any Database) async throws {
    try await database.schema(File.schema)
      .field(File.FieldKeys.id, .int64, .identifier(auto: false))
      .field(File.FieldKeys.name, .string, .required)
      .field(File.FieldKeys.kind, .string, .required)
      .field(File.FieldKeys.size, .int64, .required)
      .field(File.FieldKeys.checksum, .data, .required)
      .field(File.FieldKeys.application, .string, .required)
      .field(File.FieldKeys.decryptionKeySealedBox, .data, .required)
      .field(
        File.FieldKeys.locationID,
        .int64,
        .required,
        .references(Location.schema, Location.FieldKeys.id)
      )
      .field(
        File.FieldKeys.userID,
        .int64,
        .required,
        .references(User.schema, User.FieldKeys.id)
      )
      .field(File.FieldKeys.createdAt, .datetime)
      .field(File.FieldKeys.updatedAt, .datetime)
    /* FIXME: Add UserID */
      .unique(on: File.FieldKeys.checksum)
      .create()
  }

  func revert(on database: any Database) async throws {
    try await database.schema(File.schema)
      .delete()
  }
}
