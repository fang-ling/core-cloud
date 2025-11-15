//
//  SettingMigrationV1.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/10.
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

struct SettingMigrationV1: AsyncMigration {
  var name = "SettingMigrationV1"

  func prepare(on database: any Database) async throws {
    try await database.schema(Setting.schema)
      .field(Setting.FieldKeys.id, .int64, .identifier(auto: false))
      .field(
        Setting.FieldKeys.userID,
        .int64,
        .required,
        .references(User.schema, User.FieldKeys.id)
      )
      .field(Setting.FieldKeys.homeBackgroundColor, .int64, .required)
      .field(Setting.FieldKeys.createdAt, .datetime)
      .field(Setting.FieldKeys.updatedAt, .datetime)
      .unique(on: Setting.FieldKeys.userID)
      .create()

    /* Seed background color for existed user. */
    let users = try await User.query(on: database).all()
    for user in users {
      let setting = Setting()
      setting.$user.id = try user.requireID()
      setting.homeBackgroundColor = 0
      try await setting.save(on: database)
    }
  }
  
  func revert(on database: any Database) async throws {
    try await database.schema(Setting.schema)
      .delete()
  }
}
