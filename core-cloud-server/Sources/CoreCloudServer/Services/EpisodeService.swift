//
//  EpisodeService.swift
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

struct EpisodeService {
  /**
   * Adds a new episode to the database with sepcified details.
   *
   * - Parameters:
   *   - title: The name of the episode.
   *   - artworkURLs: A string containing URLs for the episode artwork.
   *   - description: The description of the episode.
   *   - date: The release date of the episode.
   *   - episodeNumber: The episode number of the episode.
   *   - seasonNumber: The season number of the episode.
   *   - duration: The duration of the episode.
   *   - width: The width of the episode.
   *   - height: The height of the episode.
   *   - isHDR: Whether the episode is HDR.
   *   - videoCodec: The video codec of the episode.
   *   - audioCodec: The audio codec of the episode.
   *   - fileID: An identifier for the episode file.
   *   - tvShowID: An identifier for the tv show of the episode.
   *   - userID: The unique identifier for the user who is adding the episode.
   *   - database: The database instance where the episode will be stored.
   *
   * - Throws:
   *   - ``Episode.Error/databaseError``: if there is an issue accessing the
   *                                      database.
   */
  func addEpisode(
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
    tvShowID: TVShow.IDValue,
    for userID: User.IDValue,
    on database: Database
  ) async throws {
    let episode = Episode(
      title: title,
      artworkURLs: artworkURLs,
      description: description,
      date: date,
      episodeNumber: episodeNumber,
      seasonNumber: seasonNumber,
      duration: duration,
      width: width,
      height: height,
      isHDR: isHDR,
      videoCodec: videoCodec,
      audioCodec: audioCodec,
      fileID: fileID,
      userID: userID,
      tvShowID: tvShowID
    )

    do {
      try await episode.save(on: database)
    } catch {
      throw Episode.Error.databaseError
    }
  }

  /**
   * Returns a list of episodes for a specified user.
   *
   * - Parameters:
   *   - userID: An identifier for the user whose episodes are being retrieved.
   *   - fields: The fields of the episode to retrieve.
   *   - filters: The filter rules to apply during the retrieval query.
   *   - database: The database instance from which the episodes will be
   *               fetched.
   *
   * - Returns: An array of tuples, each containing the episode details.
   *
   * - Throws:
   *   - ``Episode.Error/databaseError``: if there is an issue accessing the
   *                                      database.
   */
  func getEpisodes(
    for userID: User.IDValue,
    fields: [String],
    filters: [String],
    on database: Database
  ) async throws -> [(
    id: Int64,
    title: String?,
    artworkURLs: String?,
    description: String?,
    date: Date?,
    episodeNumber: Int64?,
    seasonNumber: Int64?,
    duration: Int64?,
    width: Int64?,
    height: Int64?,
    isHDR: Bool?,
    fileID: File.IDValue?
  )] {
    do {
      var query = Episode.query(on: database).filter(\.$user.$id == userID)

      for filter in filters {
        if filter.contains("_EQUALS_") {
          let entry = filter.components(separatedBy: "_EQUALS_")
          if entry.count < 2 {
            continue
          }

          if entry[0] == "episodeID", let tvShowID = Int64(entry[1]) {
            query = query.filter(\.$tvShow.$id == tvShowID)
          }
        }
      }

      return try await query
        .all()
        .map { episode in (
          id: try episode.requireID(),
          title: fields.contains("title") ? episode.title : nil,
          artworkURLs: (
            fields.contains("artworkURLs") ? episode.artworkURLs : nil
          ),
          description: (
            fields.contains("description") ? episode.description : nil
          ),
          date: fields.contains("date") ? episode.date : nil,
          episodeNumber: (
            fields.contains("episodeNumber") ? episode.episodeNumber : nil
          ),
          seasonNumber: (
            fields.contains("seasonNumber") ? episode.seasonNumber : nil
          ),
          duration: fields.contains("duration") ? episode.duration : nil,
          width: fields.contains("width") ? episode.width : nil,
          height: fields.contains("height") ? episode.height : nil,
          isHDR: fields.contains("isHDR") ? episode.isHDR : nil,
          fileID: fields.contains("fileID") ? episode.$file.id : nil,
        )}
    } catch {
      throw Episode.Error.databaseError
    }
  }
}

