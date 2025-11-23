//
//  HomeVideoService.swift
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

struct HomeVideoService {
  /**
   * Adds a new home video to the database with specified details.
   *
   * - Parameters:
   *   - title: The title of the home video.
   *   - artist: The cast of the home video.
   *   - director: The director of the home video.
   *   - genre: The genre of the home video.
   *   - tags: The tags of the home video.
   *   - date: The release date of the home video.
   *   - duration: The duration of the home video.
   *   - artworkURLs: A string containing URLs for the home video artwork.
   *   - width: The width of the home video.
   *   - height The height of the home video.
   *   - isHDR: Whether the home video is HDR.
   *   - videoCodec: The video codec of the home video.
   *   - audioCodec: The audio codec of the home video.
   *   - fileID: An identifier for the home video file.
   *   - userID: An identifier for the user adding the home video.
   *   - database: The database instance where the home video will be added.
   *
   * - Throws:
   *   - ``HomeVideoError/databaseError``: if there is an issue accessing the
   *                                       database.
   */
  func addHomeVideo(
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
    with fileID: File.IDValue,
    for userID: User.IDValue,
    on database: Database
  ) async throws {
    let homeVideo = HomeVideo(
      title: title,
      cast: cast,
      director: director,
      genre: genre,
      tags: tags,
      date: date,
      duration: duration,
      artworkURLs: artworkURLs,
      width: width,
      height: height,
      isHDR: isHDR,
      videoCodec: videoCodec,
      audioCodec: audioCodec,
      fileID: fileID,
      userID: userID
    )

    do {
      try await homeVideo.save(on: database)
    } catch {
      throw HomeVideoError.databaseError
    }
  }

  /**
   * Returns a list of home videos for a specified user.
   *
   * - Parameters:
   *   - fields: The fields of each home video to retrieve.
   *   - filters: The filter rules to apply during the retrieval query.
   *   - userID: An identifier for the user whose home videos are being
   *             retrieved.
   *   - database: The database instance from which the home videos will be
   *               fetched.
   *
   * - Returns: An array of tuples, each containing the home video details.
   *
   * - Throws:
   *   - ``HomeVideoError/databaseError``: if there is an issue accessing the
   *                                       database.
   */
  func getHomeVideos(
    fields: [String],
    filters: [String],
    for userID: User.IDValue,
    on database: Database
  ) async throws -> [(
    id: Int64,
    title: String?,
    artworkURLs: String?,
    fileID: Int64?
  )] {
    do {
      let query = HomeVideo.query(on: database).filter(\.$user.$id == userID)

      return try await query
        .all()
        .map { homeVideo in (
          id: try homeVideo.requireID(),
          title: fields.contains("title") ? homeVideo.title : nil,
          artworkURLs: (
            fields.contains("artworkURLs") ? homeVideo.artworkURLs : nil
          ),
          fileID: fields.contains("fileID") ? homeVideo.$file.id : nil
        )}
    } catch {
      throw HomeVideoError.databaseError
    }
  }

  /**
   * Returns the detail of the given home video.
   *
   * - Parameters:
   *   - id: The unique identifier for the home video to retrieve.
   *   - fields: The fields of the home video to retrieve.
   *   - userID: An identifier for the user whose home video is being retrieved.
   *   - database: The database instance from which the home video will be
   *               fetched.
   *
   * - Returns: A tuple containing the detail of the home video.
   *
   * - Throws:
   *   - ``HomeVideoError/databaseError``: if there is an issue accessing the
   *                                       database.
   *   - ``HomeVideoError/noSuchHomeVideo``: if the home video is not found.
   */
  func getHomeVideo(
    with id: HomeVideo.IDValue,
    fields: [String],
    for userID: User.IDValue,
    on database: Database
  ) async throws -> (
    cast: String?,
    director: String?,
    genre: String?,
    tags: String?,
    date: Date?,
    duration: Int64?,
    width: Int64?,
    height: Int64?,
    isHDR: Bool?,
    videoCodec: String?,
    audioCodec: String?
  ) {
    do {
      guard let homeVideo = try await HomeVideo.query(on: database)
        .filter(\.$user.$id == userID)
        .filter(\.$id == id)
        .first()
      else {
        throw HomeVideoError.noSuchHomeVideo
      }

      return (
        cast: fields.contains("cast") ? homeVideo.cast : nil,
        director: fields.contains("director") ? homeVideo.director : nil,
        genre: fields.contains("genre") ? homeVideo.genre : nil,
        tags: fields.contains("tags") ? homeVideo.tags : nil,
        date: fields.contains("date") ? homeVideo.date : nil,
        duration: fields.contains("duration") ? homeVideo.duration : nil,
        width: fields.contains("width") ? homeVideo.width : nil,
        height: fields.contains("height") ? homeVideo.height : nil,
        isHDR: fields.contains("isHDR") ? homeVideo.isHDR : nil,
        videoCodec: fields.contains("videoCodec") ? homeVideo.videoCodec : nil,
        audioCodec: fields.contains("audioCodec") ? homeVideo.audioCodec : nil
      )
    }
  }
}
