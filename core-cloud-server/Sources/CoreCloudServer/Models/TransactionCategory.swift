//
//  TransactionCategory.swift
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
import Vapor

final class TransactionCategory: Model, @unchecked Sendable {
  @ID(custom: FieldKeys.id, generatedBy: .database)
  var id: Int64?

  @Field(key: FieldKeys.name)
  var name: String

  @Field(key: FieldKeys.type)
  var type: Int64

  @Parent(key: FieldKeys.userID)
  var user: User

  @Timestamp(key: FieldKeys.createdAt, on: .create)
  var createdAt: Date?

  @Timestamp(key: FieldKeys.updatedAt, on: .update)
  var updatedAt: Date?

  init() { }

  init(
    id: Int64? = nil,
    name: String,
    type: Int64,
    userID: User.IDValue,
    createdAt: Date? = nil,
    updatedAt: Date? = nil
  ) {
    self.id = id
    self.name = name
    self.type = type
    self.$user.id = userID
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

extension TransactionCategory {
  static let schema = "TransactionCategories"

  enum FieldKeys {
    static let id: FieldKey = "id"
    static let name: FieldKey = "name"
    static let type: FieldKey = "type"
    static let userID: FieldKey = "user_id"
    static let createdAt: FieldKey = "created_at"
    static let updatedAt: FieldKey = "updated_at"
  }
}

extension TransactionCategory {
  enum `Type`: Int64 {
    case expense = 0
    case income = 1
  }
}

extension TransactionCategory {
  enum Error: Swift.Error {
    case databaseError
    case noSuchTransactionCategory
  }
}

extension TransactionCategory {
  enum Singular { }
  enum Plural { }
}

extension TransactionCategory.Singular {
  enum Input { }
  enum Output { }
}

extension TransactionCategory.Plural {
  enum Input { }
  enum Output { }
}

extension TransactionCategory.Singular.Input {
  struct Insertion: Codable {
    var name: String
    var type: Int64
  }
}

extension TransactionCategory.Singular.Output {
  struct Insertion: Codable {
    var id: Int64
  }
}

extension TransactionCategory.Plural.Input {
  struct Retrieval: Codable {
    var filters: String
    var fields: String
  }
}

extension TransactionCategory.Plural.Output {
  struct Retrieval: Codable {
    var id: Int64
    var name: String?
  }
}
