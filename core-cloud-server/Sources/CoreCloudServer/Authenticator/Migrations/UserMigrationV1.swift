//
//  UserMigrationV1.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/7/28.
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

struct UserMigrationV1: AsyncMigration {
  var name = "UserMigrationV1"

  func prepare(on database: any Database) async throws {
    try await database.schema(User.schema)
      .field(User.FieldKeys.id, .int64, .identifier(auto: true))
      .field(User.FieldKeys.firstName, .string, .required)
      .field(User.FieldKeys.lastName, .string, .required)
      .field(User.FieldKeys.username, .string, .required)
      .field(User.FieldKeys.key, .data, .required)
      .field(User.FieldKeys.salt, .data, .required)
      .field(User.FieldKeys.masterKeySealedBox, .data, .required)
      .field(User.FieldKeys.masterKeySealedBoxSalt, .data, .required)
      .field(User.FieldKeys.avatarURLs, .string, .required)
      .field(User.FieldKeys.createdAt, .datetime)
      .field(User.FieldKeys.updatedAt, .datetime)
      .unique(on: User.FieldKeys.username)
      .create()
  }

  func revert(on database: any Database) async throws {
    try await database.schema(User.schema)
      .delete()
  }
}
