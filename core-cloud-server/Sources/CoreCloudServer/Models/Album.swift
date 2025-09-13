//
//  Album.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/9/8.
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

final class Album: Model, @unchecked Sendable {
  @ID(custom: FieldKeys.id, generatedBy: .database)
  var id: Int64?

  @Field(key: FieldKeys.name)
  var name: String

  @Field(key: FieldKeys.artist)
  var artist: String

  @Field(key: FieldKeys.genre)
  var genre: String

  @Field(key: FieldKeys.year)
  var year: Int64

  @Field(key: FieldKeys.artworkURLs)
  var artworkURLs: String

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
    artist: String,
    genre: String,
    year: Int64,
    artworkURLs: String,
    userID: User.IDValue,
    createdAt: Date? = nil,
    updatedAt: Date? = nil
  ) {
    self.id = id
    self.name = name
    self.artist = artist
    self.genre = genre
    self.year = year
    self.artworkURLs = artworkURLs
    self.$user.id = userID
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

extension Album {
  static let schema = "Albums"

  enum FieldKeys {
    static let id: FieldKey = "id"
    static let name: FieldKey = "name"
    static let artist: FieldKey = "artist"
    static let genre: FieldKey = "genre"
    static let year: FieldKey = "year"
    static let artworkURLs: FieldKey = "artwork_urls"
    static let userID: FieldKey = "user_id"
    static let createdAt: FieldKey = "created_at"
    static let updatedAt: FieldKey = "updated_at"
  }
}

extension Album {
  enum Singular { }
  enum Plural { }
}

extension Album.Singular {
  enum Input { }
  enum Output { }
}

extension Album.Plural {
  enum Output { }
}

extension Album.Singular.Input {
  struct Insertion: Codable {
    var name: String
    var artist: String
    var genre: String
    var year: Int64
    var artworkURLs: String
  }

  struct Retrieval: Codable {
    var id: Int64
  }
}

extension Album.Singular.Output {
  struct Retrieval: Codable {
    var genre: String
    var year: Int64
  }
}

extension Album.Plural.Output {
  struct Retrieval: Codable {
    var id: Int64
    var name: String
    var artist: String
    var artworkURLs: String
  }
}
