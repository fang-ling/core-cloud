//
//  File.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/17.
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

final class File: Model, @unchecked Sendable {
  @ID(custom: FieldKeys.id, generatedBy: .database)
  var id: Int64?

  @Field(key: FieldKeys.name)
  var name: String

  @Field(key: FieldKeys.kind)
  var kind: String

  @Field(key: FieldKeys.size)
  var size: Int64

  @Field(key: FieldKeys.checksum)
  var checksum: Data

  @Field(key: FieldKeys.application)
  var application: String

  @Field(key: FieldKeys.decryptionKeySealedBox)
  var decryptionKeySealedBox: Data

  @Parent(key: FieldKeys.locationID)
  var location: Location

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
    kind: String,
    size: Int64,
    checksum: Data,
    application: String,
    decryptionKeySealedBox: Data,
    locationID: Location.IDValue,
    userID: User.IDValue,
    createdAt: Date? = nil,
    updatedAt: Date? = nil
  ) {
    self.id = id
    self.name = name
    self.kind = kind
    self.size = size
    self.checksum = checksum
    self.application = application
    self.decryptionKeySealedBox = decryptionKeySealedBox
    self.$location.id = locationID
    self.$user.id = userID
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

extension File {
  static let schema = "Files"

  enum FieldKeys {
    static let id: FieldKey = "id"
    static let name: FieldKey = "name"
    static let kind: FieldKey = "kind"
    static let size: FieldKey = "size"
    static let checksum: FieldKey = "checksum"
    static let application: FieldKey = "application"
    static let decryptionKeySealedBox: FieldKey = "decryption_key_sealed_box"
    static let locationID: FieldKey = "location_id"
    static let userID: FieldKey = "user_id"
    static let createdAt: FieldKey = "created_at"
    static let updatedAt: FieldKey = "updated_at"
  }
}

extension File {
  enum Singular { }
  enum Plural { }
}

extension File.Singular {
  enum Input { }
}

extension File.Plural {
  enum Input { }
  enum Output { }
}

extension File.Singular.Input {
  struct Insertion: Codable {
    var name: String
    var kind: String
    var size: Int64
    var checksum: String
    var application: String
    var locationID: Int64
  }

  struct Retrieval: Codable {
    var id: Int64
    var application: String
  }
}

extension File.Plural.Input {
  struct Retrieval: Codable {
    var fields: String
    var filters: String
  }
}

extension File.Plural.Output {
  struct Retrieval: Codable {
    var id: Int64
    var name: String?
    var kind: String?
    var size: Int64?
    var date: Int64?
  }
}
