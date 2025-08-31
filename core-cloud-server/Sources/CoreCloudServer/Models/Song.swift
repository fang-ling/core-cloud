//
//  Song.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/31.
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

final class Song: Model, @unchecked Sendable {
  @ID(custom: FieldKeys.id, generatedBy: .database)
  var id: Int64?

  @Field(key: FieldKeys.title)
  var title: String

  @Field(key: FieldKeys.artist)
  var artist: String

  @Field(key: FieldKeys.genre)
  var genre: String

  @Field(key: FieldKeys.year)
  var year: Int64

  @Field(key: FieldKeys.trackNumber)
  var trackNumber: Int64

  @Field(key: FieldKeys.discNumber)
  var discNumber: Int64

  @Field(key: FieldKeys.playCount)
  var playCount: Int64

  @Field(key: FieldKeys.sampleSize)
  var sampleSize: Int64

  @Field(key: FieldKeys.sampleRate)
  var sampleRate: Int64

  @Parent(key: FieldKeys.fileID)
  var file: File

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
    artist: String,
    genre: String,
    year: Int64,
    trackNumber: Int64,
    discNumber: Int64,
    playCount: Int64,
    sampleSize: Int64,
    sampleRate: Int64,
    fileID: File.IDValue,
    userID: User.IDValue,
    createdAt: Date? = nil,
    updatedAt: Date? = nil
  ) {
    self.id = id
    self.title = title
    self.artist = artist
    self.genre = genre
    self.year = year
    self.trackNumber = trackNumber
    self.discNumber = discNumber
    self.playCount = playCount
    self.sampleSize = sampleSize
    self.sampleRate = sampleRate
    self.$file.id = fileID
    self.$user.id = userID
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

extension Song {
  static let schema = "Songs"

  enum FieldKeys {
    static let id: FieldKey = "id"
    static let title: FieldKey = "title"
    static let artist: FieldKey = "artist"
    static let genre: FieldKey = "genre"
    static let year: FieldKey = "year"
    static let trackNumber: FieldKey = "track_number"
    static let discNumber: FieldKey = "dics_number"
    static let playCount: FieldKey = "play_count"
    static let sampleSize: FieldKey = "sampleSize"
    static let sampleRate: FieldKey = "sampleRate"
    static let fileID: FieldKey = "file_id"
    static let userID: FieldKey = "user_id"
    static let createdAt: FieldKey = "created_at"
    static let updatedAt: FieldKey = "updated_at"
  }
}

extension Song {
  enum Singular { }
  enum Plural { }
}

extension Song.Singular {
  enum Input { }
}

extension Song.Plural {
  enum Output { }
}

extension Song.Singular.Input {
  struct Insertion: Codable {
    var title: String
    var artist: String
    var genre: String
    var year: Int64
    var trackNumber: Int64
    var discNumber: Int64
    var playCount: Int64
    var sampleSize: Int64
    var sampleRate: Int64
    var fileID: Int64
  }

  struct Modification: Codable {
    var id: Int64
    var playCount: Int64?
  }
}

extension Song.Plural.Output {
  struct Retrieval: Codable {
    var id: Int64
    var title: String
    var artist: String
    var genre: String
    var year: Int64
    var trackNumber: Int64
    var discNumber: Int64
    var playCount: Int64
    var sampleSize: Int64
    var sampleRate: Int64
    var fileID: Int64
  }
}
