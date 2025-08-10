//
//  Setting.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/10.
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

final class Setting: Model, @unchecked Sendable {
  @ID(custom: FieldKeys.id, generatedBy: .database)
  var id: Int64?

  @Parent(key: FieldKeys.userID)
  var user: User

  @Field(key: FieldKeys.homeBackgroundColor)
  var homeBackgroundColor: Int64

  @Timestamp(key: FieldKeys.createdAt, on: .create)
  var createdAt: Date?

  @Timestamp(key: FieldKeys.updatedAt, on: .update)
  var updatedAt: Date?

  init() { }

  init(
    id: Int64? = nil,
    userID: User.IDValue,
    homeBackgroundColor: Int64,
    createdAt: Date? = nil,
    updatedAt: Date? = nil
  ) {
    self.id = id
    self.$user.id = userID
    self.homeBackgroundColor = homeBackgroundColor
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

extension Setting {
  static let schema = "Settings"

  enum FieldKeys {
    static let id: FieldKey = "id"
    static let userID: FieldKey = "user_id"
    static let homeBackgroundColor: FieldKey = "home_background_color"
    static let createdAt: FieldKey = "created_at"
    static let updatedAt: FieldKey = "updated_at"
  }

  enum Key {
    static let homeBackgroundColor = "homeBackgroundColor"
  }
  static let Keys = [Key.homeBackgroundColor]
}

extension Setting {
  enum Singular { }
}

extension Setting.Singular {
  enum Input { }
  enum Output { }
}

extension Setting.Singular.Input {
  struct Retrieval: Codable {
    var key: String
  }

  struct Modification: Codable {
    var key: String
    var value: String
  }
}

extension Setting.Singular.Output {
  struct Retrieval: Codable {
    var homeBackgroundColor: Int64?
  }
}
