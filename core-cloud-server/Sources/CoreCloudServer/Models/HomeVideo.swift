//
//  HomeVideo.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/10/5.
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

final class HomeVideo: Model, @unchecked Sendable {
  @ID(custom: FieldKeys.id, generatedBy: .database)
  var id: Int64?

  @Field(key: FieldKeys.title)
  var title: String

  @Field(key: FieldKeys.cast)
  var cast: String

  @Field(key: FieldKeys.director)
  var director: String

  @Field(key: FieldKeys.genre)
  var genre: String

  @Field(key: FieldKeys.tags)
  var tags: String

  @Field(key: FieldKeys.date)
  var date: Date

  @Field(key: FieldKeys.duration)
  var duration: Int64

  @Field(key: FieldKeys.artworkURLs)
  var artworkURLs: String

  @Field(key: FieldKeys.width)
  var width: Int64

  @Field(key: FieldKeys.height)
  var height: Int64

  @Field(key: FieldKeys.isHDR)
  var isHDR: Bool

  @Field(key: FieldKeys.videoCodec)
  var videoCodec: String

  @Field(key: FieldKeys.audioCodec)
  var audioCodec: String

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
    cast: String,
    director: String,
    genre: String,
    tags: String,
    date: Date,
    duration: Int64,
    artworkURLs: String,
    width: Int64,
    height: Int64,
    isHDR: Bool,
    videoCodec: String,
    audioCodec: String,
    fileID: File.IDValue,
    userID: User.IDValue,
    createdAt: Date? = nil,
    updatedAt: Date? = nil
  ) {
    self.id = id
    self.title = title
    self.cast = cast
    self.director = director
    self.genre = genre
    self.tags = tags
    self.date = date
    self.duration = duration
    self.artworkURLs = artworkURLs
    self.width = width
    self.height = height
    self.isHDR = isHDR
    self.videoCodec = videoCodec
    self.audioCodec = audioCodec
    self.$file.id = fileID
    self.$user.id = userID
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

extension HomeVideo {
  static let schema = "HomeVideos"

  enum FieldKeys {
    static let id: FieldKey = "id"
    static let title: FieldKey = "title"
    static let cast: FieldKey = "cast"
    static let director: FieldKey = "director"
    static let genre: FieldKey = "genre"
    static let tags: FieldKey = "tags"
    static let date: FieldKey = "date"
    static let duration: FieldKey = "duration"
    static let artworkURLs: FieldKey = "artwork_urls"
    static let width: FieldKey = "width"
    static let height: FieldKey = "height"
    static let isHDR: FieldKey = "is_hdr"
    static let videoCodec: FieldKey = "video_codec"
    static let audioCodec: FieldKey = "audio_codec"
    static let fileID: FieldKey = "file_id"
    static let userID: FieldKey = "user_id"
    static let createdAt: FieldKey = "created_at"
    static let updatedAt: FieldKey = "updated_at"
  }
}

extension HomeVideo {
  enum Singular { }
  enum Plural { }
}

extension HomeVideo.Singular {
  enum Input { }
}

extension HomeVideo.Plural {
  enum Input { }
  enum Output { }
}

extension HomeVideo.Singular.Input {
  struct Insertion: Codable {
    var title: String
    var cast: String
    var director: String
    var genre: String
    var tags: String
    var date: Int64
    var duration: Int64
    var artworkURLs: String
    var width: Int64
    var height: Int64
    var isHDR: Bool
    var videoCodec: String
    var audioCodec: String
    var fileID: Int64
  }
}

extension HomeVideo.Plural.Input {
  struct Retrieval: Codable {
    var fields: String
    var filters: String?
  }
}

extension HomeVideo.Plural.Output {
  struct Retrieval: Codable {
    var id: Int64
    var title: String?
    var artworkURLs: String?
    var fileID: Int64?
  }
}
