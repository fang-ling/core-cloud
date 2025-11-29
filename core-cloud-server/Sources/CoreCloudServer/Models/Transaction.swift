//
//  Transaction.swift
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

final class Transaction: Model, @unchecked Sendable {
  @ID(custom: FieldKeys.id, generatedBy: .database)
  var id: Int64?

  @Field(key: FieldKeys.description)
  var description: String

  @Field(key: FieldKeys.date)
  var date: Date

  @Field(key: FieldKeys.notes)
  var notes: String?

  @Field(key: FieldKeys.type)
  var type: Int64

  @Field(key: FieldKeys.outAmount)
  var outAmount: Int64?

  @Field(key: FieldKeys.outRefund)
  var outRefund: Int64?

  @Field(key: FieldKeys.outFee)
  var outFee: Int64?

  @OptionalParent(key: FieldKeys.outAccountID)
  var outAccount: Account?

  @Field(key: FieldKeys.inAmount)
  var inAmount: Int64?

  @OptionalParent(key: FieldKeys.inAccountID)
  var inAccount: Account?

  @OptionalParent(key: FieldKeys.transactionCategoryID)
  var transactionCategory: TransactionCategory?

  @Parent(key: FieldKeys.userID)
  var user: User

  @Timestamp(key: FieldKeys.createdAt, on: .create)
  var createdAt: Date?

  @Timestamp(key: FieldKeys.updatedAt, on: .update)
  var updatedAt: Date?

  init() { }

  init(
    id: Int64? = nil,
    description: String,
    date: Date,
    notes: String? = nil,
    type: Int64,
    outAmount: Int64? = nil,
    outRefund: Int64? = nil,
    outFee: Int64? = nil,
    outAccountID: Account.IDValue? = nil,
    inAmount: Int64?,
    inAccountID: Account.IDValue? = nil,
    transactionCategoryID: TransactionCategory.IDValue? = nil,
    userID: User.IDValue,
    createdAt: Date? = nil,
    updatedAt: Date? = nil
  ) {
    self.id = id
    self.description = description
    self.date = date
    self.notes = notes
    self.type = type
    self.outAmount = outAmount
    self.outRefund = outRefund
    self.outFee = outFee
    self.$outAccount.id = outAccountID
    self.inAmount = inAmount
    self.$inAccount.id = inAccountID
    self.$transactionCategory.id = transactionCategoryID
    self.$user.id = userID
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

extension Transaction {
  static let schema = "Transactions"

  enum FieldKeys {
    static let id: FieldKey = "id"
    static let description: FieldKey = "description"
    static let date: FieldKey = "date"
    static let notes: FieldKey = "notes"
    static let type: FieldKey = "type"
    static let outAmount: FieldKey = "out_amount"
    static let outRefund: FieldKey = "out_refund"
    static let outFee: FieldKey = "out_fee"
    static let outAccountID: FieldKey = "out_account_id"
    static let inAmount: FieldKey = "in_amount"
    static let inAccountID: FieldKey = "in_account_id"
    static let transactionCategoryID: FieldKey = "transaction_category_id"
    static let userID: FieldKey = "user_id"
    static let createdAt: FieldKey = "created_at"
    static let updatedAt: FieldKey = "updated_at"
  }
}

extension Transaction {
  enum `Type`: Int64 {
    case expense = 0
    case income = 1
    case transfer = 2
  }
}

extension Transaction {
  enum Error: Swift.Error {
    case databaseError
  }
}

extension Transaction {
  enum Plural { }
}

extension Transaction.Plural {
  enum Input { }
  enum Output { }
}

extension Transaction.Plural.Input {
  struct Insertion: Codable {
    var description: String
    var date: Int64
    var notes: String?
    var type: Int64
    var outAmount: String?
    var outRefund: String?
    var outFee: String?
    var outAccountID: Int64?
    var inAmount: String?
    var inAccountID: Int64?
    var transactionCategoryID: Int64?
  }

  struct Retrieval: Codable {
    var fields: String?
    var filters: String?
  }
}

extension Transaction.Plural.Output {
  struct Retrieval: Codable {
    var id: Int64
    var description: String?
    var date: Int64?
    var type: Int64?
    var outAmount: String?
    var outCurrencySymbol: String?
    var outCurrencySymbolPosition: Int64?
    var inAmount: String?
    var inCurrencySymbol: String?
    var inCurrencySymbolPosition: Int64?
    var transactionCategoryName: String?
  }
}
