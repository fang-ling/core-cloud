//
//  Password.swift
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
import Vapor

final class Password: Model, @unchecked Sendable {
  @ID(custom: FieldKeys.id, generatedBy: .database)
  var id: Int64?

  @Field(key: FieldKeys.label)
  var label: String

  @OptionalField(key: FieldKeys.username)
  var username: String?

  @Field(key: FieldKeys.keySealedBox)
  var keySealedBox: Data

  @Field(key: FieldKeys.keySealedBoxKeySealedBox)
  var keySealedBoxKeySealedBox: Data

  @OptionalField(key: FieldKeys.notes)
  var notes: String?

  @OptionalChild(for: \.$password)
  var verificationCode: VerificationCode?

  @Parent(key: FieldKeys.userID)
  var user: User

  @Timestamp(key: FieldKeys.createdAt, on: .create)
  var createdAt: Date?

  @Timestamp(key: FieldKeys.updatedAt, on: .update)
  var updatedAt: Date?

  init() { }

  init(
    id: Int64? = nil,
    label: String,
    username: String? = nil,
    keySealedBox: Data,
    keySealedBoxKeySealedBox: Data,
    notes: String? = nil,
    userID: User.IDValue,
    createdAt: Date? = nil,
    updatedAt: Date? = nil
  ) {
    self.id = id
    self.label = label
    self.username = username
    self.keySealedBox = keySealedBox
    self.keySealedBoxKeySealedBox = keySealedBoxKeySealedBox
    self.notes = notes
    self.$user.id = userID
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

extension Password {
  static let schema = "Passwords"

  enum FieldKeys {
    static let id: FieldKey = "id"
    static let label: FieldKey = "label"
    static let username: FieldKey = "username"
    static let keySealedBox: FieldKey = "key_sealed_box"
    static let keySealedBoxKeySealedBox: FieldKey = (
      "key_sealed_box_key_sealed_box"
    )
    static let notes: FieldKey = "notes"
    static let userID: FieldKey = "user_id"
    static let createdAt: FieldKey = "created_at"
    static let updatedAt: FieldKey = "updated_at"
  }
}

extension Password {
  enum Error: Swift.Error {
    case cryptoError
    case databaseError
    case noSuchPassword
  }
}

extension Password {
  enum Singular { }
  enum Plural { }
}

extension Password.Singular {
  enum Input { }
  enum Output { }
}

extension Password.Plural {
  enum Input { }
  enum Output { }
}

extension Password.Singular.Input {
  struct Insertion: Codable {
    var label: String
    var username: String?
    var key: String
    var notes: String?
  }

  struct Retrieval: Codable {
    var id: Int64
  }
}

extension Password.Singular.Output {
  struct Insertion: Codable {
    var id: Int64
  }

  struct Retrieval: Codable {
    var key: String
  }
}

extension Password.Plural.Input {
  struct Retrieval: Codable {
    var fields: String
  }
}

extension Password.Plural.Output {
  struct Retrieval: Codable {
    var id: Int64
    var label: String?
    var username: String?
    var verificationCodeID: Int64?
  }
}
