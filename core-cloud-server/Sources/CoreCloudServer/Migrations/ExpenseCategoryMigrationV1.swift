//
//  ExpenseCategoryMigrationV1.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/23.
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

struct ExpenseCategoryMigrationV1: AsyncMigration {
  var name = "ExpenseCategoryMigrationV1"

  func prepare(on database: any Database) async throws {
    try await database.schema(ExpenseCategory.schema)
      .field(ExpenseCategory.FieldKeys.id, .int64, .identifier(auto: false))
      .field(ExpenseCategory.FieldKeys.name, .string, .required)
      .field(
        ExpenseCategory.FieldKeys.userID,
        .int64,
        .required,
        .references(User.schema, User.FieldKeys.id)
      )
      .field(ExpenseCategory.FieldKeys.createdAt, .datetime)
      .field(ExpenseCategory.FieldKeys.updatedAt, .datetime)
      .unique(
        on: ExpenseCategory.FieldKeys.name,
        ExpenseCategory.FieldKeys.userID
      )
      .create()
  }

  func revert(on database: any Database) async throws {
    try await database.schema(ExpenseCategory.schema)
      .delete()
  }
}
