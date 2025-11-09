//
//  VerificationCodeMigrationV1.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/7.
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

struct VerificationCodeMigrationV1: AsyncMigration {
  var name = "VerificationCodeMigrationV1"

  func prepare(on database: any FluentKit.Database) async throws {
    try await database.schema(VerificationCode.schema)
      .field(VerificationCode.FieldKeys.id, .int64, .identifier(auto: true))
      .field(VerificationCode.FieldKeys.secretSealedBox, .data, .required)
      .field(VerificationCode.FieldKeys.digest, .int64, .required)
      .field(VerificationCode.FieldKeys.digits, .int64, .required)
      .field(VerificationCode.FieldKeys.interval, .int64, .required)
      .field(
        VerificationCode.FieldKeys.userID,
        .int64,
        .required,
        .references(User.schema, User.FieldKeys.id)
      )
      .field(VerificationCode.FieldKeys.createdAt, .datetime)
      .field(VerificationCode.FieldKeys.updatedAt, .datetime)
      .create()
  }

  func revert(on database: any FluentKit.Database) async throws {
    try await database.schema(VerificationCode.schema)
      .delete()
  }
}
