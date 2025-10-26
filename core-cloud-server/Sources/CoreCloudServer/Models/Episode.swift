//
//  Episode.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/10/26.
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

final class Episode: Model, @unchecked Sendable {
  @ID(custom: FieldKeys.id, generatedBy: .database)
  var id: Int64?

  @Field(key: FieldKeys.title)
  var title: String

  @Field(key: FieldKeys.artworkURLs)
  var artworkURLs: String

  @Field(key: FieldKeys.description)
  var description: String

  @Field(key: FieldKeys.date)
  var date: Date

  @Field(key: FieldKeys.episodeNumber)
  var episodeNumber: Int64

  @Field(key: FieldKeys.seasonNumber)
  var seasonNumber: Int64

  @Field(key: FieldKeys.duration)
  var duration: Int64

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

  @Parent(key: FieldKeys.tvShowID)
  var tvShow: TVShow

  @Timestamp(key: FieldKeys.createdAt, on: .create)
  var createdAt: Date?

  @Timestamp(key: FieldKeys.updatedAt, on: .update)
  var updatedAt: Date?

  init() { }

  init(
    id: Int64? = nil,
    title: String,
    artworkURLs: String,
    description: String,
    date: Date,
    episodeNumber: Int64,
    seasonNumber: Int64,
    duration: Int64,
    width: Int64,
    height: Int64,
    isHDR: Bool,
    videoCodec: String,
    audioCodec: String,
    fileID: File.IDValue,
    userID: User.IDValue,
    tvShowID: TVShow.IDValue,
    createdAt: Date? = nil,
    updatedAt: Date? = nil
  ) {
    self.id = id
    self.title = title
    self.artworkURLs = artworkURLs
    self.description = description
    self.date = date
    self.episodeNumber = episodeNumber
    self.seasonNumber = seasonNumber
    self.duration = duration
    self.width = width
    self.height = height
    self.isHDR = isHDR
    self.videoCodec = videoCodec
    self.audioCodec = audioCodec
    self.$file.id = fileID
    self.$user.id = userID
    self.$tvShow.id = tvShowID
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

extension Episode {
  static let schema = "Episodes"

  enum FieldKeys {
    static let id: FieldKey = "id"
    static let title: FieldKey = "title"
    static let artworkURLs: FieldKey = "artwork_urls"
    static let description: FieldKey = "description"
    static let date: FieldKey = "date"
    static let episodeNumber: FieldKey = "episode_number"
    static let seasonNumber: FieldKey = "season_number"
    static let duration: FieldKey = "duration"
    static let width: FieldKey = "width"
    static let height: FieldKey = "height"
    static let isHDR: FieldKey = "is_hdr"
    static let videoCodec: FieldKey = "video_codec"
    static let audioCodec: FieldKey = "audio_codec"
    static let fileID: FieldKey = "file_id"
    static let userID: FieldKey = "user_id"
    static let tvShowID: FieldKey = "tv_show_id"
    static let createdAt: FieldKey = "created_at"
    static let updatedAt: FieldKey = "updated_at"
  }
}

extension Episode {
  enum Error: Swift.Error {
    case databaseError
  }
}
