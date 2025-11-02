//
//  KeyMigrationV1.swift
//  core-cloud-enigma
//
//  Created by Fang Ling on 2025/11/2.
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

struct KeyMigrationV1: AsyncMigration {
  var name = "KeyMigrationV1"

  func prepare(on database: any FluentKit.Database) async throws {
    try await database.schema(Key.schema)
      .field(Key.FieldKeys.id, .int64, .identifier(auto: true))
      .field(Key.FieldKeys.name, .string, .required)
      .field(Key.FieldKeys.data, .data, .required)
      .field(Key.FieldKeys.createdAt, .datetime)
      .field(Key.FieldKeys.updatedAt, .datetime)
      .unique(on: Key.FieldKeys.name)
      .create()
  }

  func revert(on database: any FluentKit.Database) async throws {
    try await database.schema(Key.schema)
      .delete()
  }
}
