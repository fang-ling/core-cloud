//
//  Key.swift
//  core-cloud-enigma
//
//  Created by Fang Ling on 2025/11/2.
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

final class Key: Model, @unchecked Sendable {
  @ID(custom: FieldKeys.id, generatedBy: .database)
  var id: Int64?

  @Field(key: FieldKeys.name)
  var name: String

  @Field(key: FieldKeys.data)
  var data: Data

  @Timestamp(key: FieldKeys.createdAt, on: .create)
  var createdAt: Date?

  @Timestamp(key: FieldKeys.updatedAt, on: .update)
  var updatedAt: Date?

  init() { }

  init(
    id: Int64? = nil,
    name: String,
    data: Data,
    createdAt: Date? = nil,
    updatedAt: Date? = nil
  ) {
    self.id = id
    self.name = name
    self.data = data
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

extension Key {
  static let schema = "Keys"

  enum FieldKeys {
    static let id: FieldKey = "id"
    static let name: FieldKey = "name"
    static let data: FieldKey = "data"
    static let createdAt: FieldKey = "created_at"
    static let updatedAt: FieldKey = "updated_at"
  }
}

extension Key {
  enum Singular { }
}

extension Key.Singular {
  enum Input { }
}

extension Key.Singular.Input {
  struct Insertion: Codable {
    var name: String
    var base64EncodedData: String
  }
}
