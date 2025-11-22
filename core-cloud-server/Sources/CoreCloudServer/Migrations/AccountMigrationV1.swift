//
//  AccountMigrationV1.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/22.
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

struct AccountMigrationV1: AsyncMigration {
  var name = "AccountMigrationV1"

  func prepare(on database: any Database) async throws {
    try await database.schema(Account.schema)
      .field(Account.FieldKeys.id, .int64, .identifier(auto: false))
      .field(Account.FieldKeys.title, .string, .required)
      .field(Account.FieldKeys.subtitle, .string, .required)
      .field(Account.FieldKeys.number, .string, .required)
      .field(Account.FieldKeys.type, .int64, .required)
      .field(Account.FieldKeys.balance, .int64, .required)
      .field(Account.FieldKeys.actualBalance, .int64, .required)
      .field(Account.FieldKeys.logoURLs, .string, .required)
      .field(
        Account.FieldKeys.currencyID,
        .int64,
        .required,
        .references(Currency.schema, Currency.FieldKeys.id)
      )
      .field(
        Account.FieldKeys.userID,
        .int64,
        .required,
        .references(User.schema, User.FieldKeys.id)
      )
      .field(Account.FieldKeys.createdAt, .datetime)
      .field(Account.FieldKeys.updatedAt, .datetime)
      .create()
  }

  func revert(on database: any Database) async throws {
    try await database.schema(Account.schema)
      .delete()
  }
}
