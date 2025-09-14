//
//  SongMigrationV6.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/9/14.
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

struct SongMigrationV6: AsyncMigration {
  var name = "SongMigrationV6"

  func prepare(on database: any Database) async throws {
    try await database.schema(Song.schema)
      .field(Song.FieldKeys.duration, .int64, .required, .sql(.default(0)))
      .update()
  }

  func revert(on database: any Database) async throws {
    try await database.schema(Song.schema)
      .deleteField(Song.FieldKeys.duration)
      .update()
  }
}
