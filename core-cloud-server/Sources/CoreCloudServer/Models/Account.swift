//
//  Account.swift
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
import Vapor

final class Account: Model, @unchecked Sendable {
  @ID(custom: FieldKeys.id, generatedBy: .database)
  var id: Int64?

  @Field(key: FieldKeys.title)
  var title: String

  @Field(key: FieldKeys.subtitle)
  var subtitle: String

  @Field(key: FieldKeys.number)
  var number: String

  @Field(key: FieldKeys.type)
  var type: Int64

  @Field(key: FieldKeys.balance)
  var balance: Int64

  @Field(key: FieldKeys.actualBalance)
  var actualBalance: Int64

  @Field(key: FieldKeys.logoURLs)
  var logoURLs: String

  @Parent(key: FieldKeys.currencyID)
  var currency: Currency

  @Parent(key: FieldKeys.userID)
  var user: User

  @Timestamp(key: FieldKeys.createdAt, on: .create)
  var createdAt: Date?

  @Timestamp(key: FieldKeys.updatedAt, on: .update)
  var updatedAt: Date?

  init() { }

  init(
    id: Int64? = nil,
    title: String,
    subtitle: String,
    number: String,
    type: Int64,
    balance: Int64,
    actualBalance: Int64,
    logoURLs: String,
    currencyID: Currency.IDValue,
    userID: User.IDValue,
    createdAt: Date? = nil,
    updateAt: Date? = nil
  ) {
    self.id = id
    self.title = title
    self.subtitle = subtitle
    self.number = number
    self.type = type
    self.balance = balance
    self.actualBalance = actualBalance
    self.logoURLs = logoURLs
    self.$currency.id = currencyID
    self.$user.id = userID
    self.createdAt = createdAt
    self.updatedAt = updateAt
  }
}

extension Account {
  static let schema = "Accounts"

  enum FieldKeys {
    static let id: FieldKey = "id"
    static let title: FieldKey = "title"
    static let subtitle: FieldKey = "subtitle"
    static let number: FieldKey = "number"
    static let type: FieldKey = "type"
    static let balance: FieldKey = "balance"
    static let actualBalance: FieldKey = "actual_balance"
    static let logoURLs: FieldKey = "logo_urls"
    static let currencyID: FieldKey = "currency_id"
    static let userID: FieldKey = "user_id"
    static let createdAt: FieldKey = "created_at"
    static let updatedAt: FieldKey = "updated_at"
  }
}

extension Account {
  enum `Type`: Int64 {
    case asset = 0
    case liability = 1
  }
}

extension Account {
  enum Error: Swift.Error {
    case databaseError
    case noSuchAccount
  }
}

extension Account {
  enum Singular { }
  enum Plural { }
}

extension Account.Singular {
  enum Input { }
  enum Output { }
}

extension Account.Plural {
  enum Input { }
  enum Output { }
}

extension Account.Singular.Input {
  struct Insertion: Codable {
    var title: String
    var subtitle: String
    var number: String
    var type: Int64
    var balance: String
    var actualBalance: String
    var logoURLs: String
    var currencyID: Int64
  }

  struct Modification: Codable {
    var id: Int64
    var actualBalance: String?
  }
}

extension Account.Singular.Output {
  struct Insertion: Codable {
    var id: Int64
  }
}

extension Account.Plural.Input {
  struct Retrieval: Codable {
    var fields: String
  }
}

extension Account.Plural.Output {
  struct Retrieval: Codable {
    var id: Int64
    var title: String?
    var subtitle: String?
    var number: String?
    var type: Int64?
    var balance: String?
    var actualBalance: String?
    var currencySymbol: String?
    var currencySymbolPosition: Int64?
  }
}
