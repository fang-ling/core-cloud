//
//  User.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/7/28.
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

final class User: Model, @unchecked Sendable {
  @ID(custom: FieldKeys.id, generatedBy: .database)
  var id: Int64?

  @Field(key: FieldKeys.firstName)
  var firstName: String

  @Field(key: FieldKeys.lastName)
  var lastName: String

  @Field(key: FieldKeys.username)
  var username: String

  @Field(key: FieldKeys.key)
  var key: Data

  @Field(key: FieldKeys.salt)
  var salt: Data

  @Field(key: FieldKeys.masterKeySealedBox)
  var masterKeySealedBox: Data

  @Field(key: FieldKeys.masterKeySealedBoxSalt)
  var masterKeySealedBoxSalt: Data

  /* This should be comma separated url string. */
  @Field(key: FieldKeys.avatarURLs)
  var avatarURLs: String

  @Timestamp(key: FieldKeys.createdAt, on: .create)
  var createdAt: Date?

  @Timestamp(key: FieldKeys.updatedAt, on: .update)
  var updatedAt: Date?

  init() { }

  init(
    id: Int64? = nil,
    firstName: String,
    lastName: String,
    username: String,
    key: Data,
    salt: Data,
    masterKeySealedBox: Data,
    masterKeySealedBoxSalt: Data,
    avatarURLs: String,
    createdAt: Date? = nil,
    updatedAt: Date? = nil
  ) {
    self.id = id
    self.firstName = firstName
    self.lastName = lastName
    self.username = username
    self.key = key
    self.salt = salt
    self.masterKeySealedBox = masterKeySealedBox
    self.masterKeySealedBoxSalt = masterKeySealedBoxSalt
    self.avatarURLs = avatarURLs
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

extension User {
  static let schema = "Users"

  enum FieldKeys {
    static let id: FieldKey = "id"
    static let firstName: FieldKey = "first_name"
    static let lastName: FieldKey = "last_name"
    static let username: FieldKey = "username"
    static let key: FieldKey = "key"
    static let salt: FieldKey = "salt"
    static let masterKeySealedBox: FieldKey = "master_key_sealed_box"
    static let masterKeySealedBoxSalt: FieldKey = "master_key_sealed_box_salt"
    static let avatarURLs: FieldKey = "avatar_urls"
    static let createdAt: FieldKey = "created_at"
    static let updatedAt: FieldKey = "updated_at"
  }
}

extension User {
  enum Singular { }
}

extension User.Singular {
  enum Input { }
  enum Output { }
}

extension User.Singular.Input {
  struct Insertion: Codable {
    var firstName: String
    var lastName: String
    var username: String
    var password: String
    var masterPassword: String
  }

  struct Peek: Codable {
    var username: String?
  }
}

extension User.Singular.Output {
  struct Retrieval: Codable {
    var username: String
    var firstName: String
    var lastName: String
    var avatarURLs: [String]
  }
}
