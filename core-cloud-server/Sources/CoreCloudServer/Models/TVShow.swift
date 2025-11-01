//
//  TVShow.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/10/19.
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

final class TVShow: Model, @unchecked Sendable {
  @ID(custom: FieldKeys.id, generatedBy: .database)
  var id: Int64?

  @Field(key: FieldKeys.title)
  var title: String

  @Field(key: FieldKeys.starring)
  var starring: String

  @Field(key: FieldKeys.genre)
  var genre: String

  @Field(key: FieldKeys.startYear)
  var startYear: Int64

  @Field(key: FieldKeys.endYear)
  var endYear: Int64

  @Field(key: FieldKeys.region)
  var region: String

  @Field(key: FieldKeys.description)
  var description: String

  @Field(key: FieldKeys.posterURLs)
  var posterURLs: String

  @Field(key: FieldKeys.artworkURLs)
  var artworkURLs: String

  @Field(key: FieldKeys.titleLogoURLs)
  var titleLogoURLs: String?

  @Field(key: FieldKeys.studio)
  var studio: String

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
    starring: String,
    genre: String,
    startYear: Int64,
    endYear: Int64,
    region: String,
    description: String,
    posterURLs: String,
    artworkURLs: String,
    titleLogoURLs: String? = nil,
    studio: String,
    userID: User.IDValue,
    createdAt: Date? = nil,
    updatedAt: Date? = nil
  ) {
    self.id = id
    self.title = title
    self.starring = starring
    self.genre = genre
    self.startYear = startYear
    self.endYear = endYear
    self.region = region
    self.description = description
    self.posterURLs = posterURLs
    self.artworkURLs = artworkURLs
    self.titleLogoURLs = titleLogoURLs
    self.studio = studio
    self.$user.id = userID
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

extension TVShow {
  static let schema = "TVShows"

  enum FieldKeys {
    static let id: FieldKey = "id"
    static let title: FieldKey = "title"
    static let starring: FieldKey = "starring"
    static let genre: FieldKey = "genre"
    static let startYear: FieldKey = "start_year"
    static let endYear: FieldKey = "end_year"
    static let region: FieldKey = "region"
    static let description: FieldKey = "description"
    static let posterURLs: FieldKey = "poster_urls"
    static let artworkURLs: FieldKey = "artwork_urls"
    static let titleLogoURLs: FieldKey = "title_logo_urls"
    static let studio: FieldKey = "studio"
    static let userID: FieldKey = "user_id"
    static let createdAt: FieldKey = "created_at"
    static let updatedAt: FieldKey = "updated_at"
  }
}

extension TVShow {
  enum Error: Swift.Error {
    case databaseError
    case noSuchTVShow
  }
}

extension TVShow {
  enum Singular { }
  enum Plural { }
}

extension TVShow.Singular {
  enum Input { }
  enum Output { }
}

extension TVShow.Plural {
  enum Input { }
  enum Output { }
}

extension TVShow.Singular.Input {
  struct Insertion: Codable {
    var title: String
    var starring: String
    var genre: String
    var startYear: Int64
    var endYear: Int64
    var region: String
    var description: String
    var posterURLs: String
    var artworkURLs: String
    var titleLogoURLs: String?
    var studio: String
  }

  struct Retrieval: Codable {
    var id: Int64
  }
}

extension TVShow.Singular.Output {
  struct Retrieval: Codable {
    var artworkURLs: String
    var titleLogoURLs: String?
    var title: String
    var starring: String
    var startYear: Int64
    var endYear: Int64
    var region: String
    var description: String
    var studio: String
    var genre: String
  }
}

extension TVShow.Plural.Input {
  struct Retrieval: Codable {
    var fields: String
  }
}

extension TVShow.Plural.Output {
  struct Retrieval: Codable {
    var id: Int64
    var posterURLs: String?
  }
}
