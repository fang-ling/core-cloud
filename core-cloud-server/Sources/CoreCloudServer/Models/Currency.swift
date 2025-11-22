//
//  Currency.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/17.
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

final class Currency: Model, @unchecked Sendable {
  @ID(custom: FieldKeys.id, generatedBy: .database)
  var id: Int64?

  @Field(key: FieldKeys.code)
  var code: String

  @Field(key: FieldKeys.minorUnit)
  var minorUnit: Int64

  @Field(key: FieldKeys.symbol)
  var symbol: String

  @Field(key: FieldKeys.symbolPosition)
  var symbolPosition: Int64

  @Parent(key: FieldKeys.userID)
  var user: User

  @Timestamp(key: FieldKeys.createdAt, on: .create)
  var createdAt: Date?

  @Timestamp(key: FieldKeys.updatedAt, on: .update)
  var updatedAt: Date?

  init() { }

  init(
    id: Int64? = nil,
    code: String,
    minorUnit: Int64,
    symbol: String,
    symbolPosition: Int64,
    userID: User.IDValue,
    createdAt: Date? = nil,
    updatedAt: Date? = nil
  ) {
    self.id = id
    self.code = code
    self.minorUnit = minorUnit
    self.symbol = symbol
    self.symbolPosition = symbolPosition
    self.$user.id = userID
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

extension Currency {
  static let schema = "Currencies"

  enum FieldKeys {
    static let id: FieldKey = "id"
    static let code: FieldKey = "code"
    static let minorUnit: FieldKey = "minor_unit"
    static let symbol: FieldKey = "symbol"
    static let symbolPosition: FieldKey = "symbol_position"
    static let userID: FieldKey = "user_id"
    static let createdAt: FieldKey = "created_at"
    static let updatedAt: FieldKey = "updated_at"
  }
}

extension Currency {
  enum SymbolPosition: Int64 {
    case leading = 0
    case trailing = 1
  }
}

extension Currency {
  enum Error: Swift.Error {
    case databaseError
    case noSuchCurrency
  }
}

extension Currency {
  enum Singular { }
  enum Plural { }
}

extension Currency.Singular {
  enum Input { }
  enum Output { }
}

extension Currency.Plural {
  enum Input { }
  enum Output { }
}

extension Currency.Singular.Input {
  struct Insertion: Codable {
    var code: String
    var minorUnit: Int64
    var symbol: String
    var symbolPosition: Int64
  }
}

extension Currency.Singular.Output {
  struct Insertion: Codable {
    var id: Int64
  }
}

extension Currency.Plural.Input {
  struct Retrieval: Codable {
    var fields: String
  }
}

extension Currency.Plural.Output {
  struct Retrieval: Codable {
    var id: Int64
    var code: String?
  }
}
