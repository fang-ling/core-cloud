//
//  TransactionMigrationV1.swift
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

struct TransactionMigrationV1: AsyncMigration {
  var name = "TransactionMigrationV1"

  func prepare(on database: any Database) async throws {
    try await database.schema(Transaction.schema)
      .field(Transaction.FieldKeys.id, .int64, .identifier(auto: false))
      .field(Transaction.FieldKeys.description, .string, .required)
      .field(Transaction.FieldKeys.date, .datetime, .required)
      .field(Transaction.FieldKeys.notes, .string)
      .field(Transaction.FieldKeys.type, .int64, .required)
      .field(Transaction.FieldKeys.outAmount, .int64)
      .field(Transaction.FieldKeys.outRefund, .int64)
      .field(Transaction.FieldKeys.outFee, .int64)
      .field(
        Transaction.FieldKeys.outAccountID,
        .int64,
        .references(Account.schema, Account.FieldKeys.id)
      )
      .field(Transaction.FieldKeys.inAmount, .int64)
      .field(
        Transaction.FieldKeys.inAccountID,
        .int64,
        .references(Account.schema, Account.FieldKeys.id)
      )
      .field(
        Transaction.FieldKeys.transactionCategoryID,
        .int64,
        .references(
          TransactionCategory.schema,
          TransactionCategory.FieldKeys.id
        )
      )
      .field(
        Transaction.FieldKeys.userID,
        .int64,
        .required,
        .references(User.schema, User.FieldKeys.id)
      )
      .field(Transaction.FieldKeys.createdAt, .datetime)
      .field(Transaction.FieldKeys.updatedAt, .datetime)
      .create()
  }

  func revert(on database: any Database) async throws {
    try await database.schema(Transaction.schema)
      .delete()
  }
}
