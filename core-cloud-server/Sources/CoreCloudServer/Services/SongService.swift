//
//  SongService.swift
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

struct SongService {
  /**
   * Adds a new song to the database with specified details.
   *
   * - Parameters:
   *   - title: The title of the song.
   *   - artist: The name of the artist.
   *   - trackNumber: The track number in the album.
   *   - discNumber: The disc number for multi-disc albums.
   *   - playCount: A number indicating how many times the song has been played.
   *   - sampleSize: The size of the audio sample.
   *   - sampleRate: The audio sample rate.
   *   - isPopular: Whether the song is popular.
   *   - duration: The duration of the audio.
   *   - fileID: An identifier for the audio file.
   *   - userID: An identifier for the user adding the song.
   *   - albumID: An identifier for the album of the song.
   *   - database: The database instance where the song will be added.
   *
   * - Throws:
   *   - ``SongError/databaseError``: if there is an issue accessing the
   *                                  database.
   */
  func addSong(
    title: String,
    artist: String,
    trackNumber: Int64,
    discNumber: Int64,
    playCount: Int64,
    sampleSize: Int64,
    sampleRate: Int64,
    isPopular: Bool,
    duration: Int64,
    with fileID: File.IDValue,
    for userID: User.IDValue,
    at albumID: Album.IDValue,
    on database: Database
  ) async throws {
    let song = Song(
      title: title,
      artist: artist,
      trackNumber: trackNumber,
      discNumber: discNumber,
      playCount: playCount,
      sampleSize: sampleSize,
      sampleRate: sampleRate,
      isPopular: isPopular,
      duration: duration,
      fileID: fileID,
      userID: userID,
      albumID: albumID
    )

    do {
      try await song.save(on: database)
    } catch {
      throw SongError.databaseError
    }
  }

  /**
   * Returns a list of songs for a specified user.
   *
   * - Parameters:
   *   - fields: The fields of each song to retrieve.
   *   - filters: The filter rules to apply during the retrieval query.
   *   - userID: An identifier for the user whose songs are being retrieved.
   *   - database: The database instance from which the songs will be fetched.
   *
   * - Returns: An array of tuples, each containing the song details.
   *
   * - Throws:
   *   - ``SongError/databaseError``: if there is an issue accessing the
   *                                  database.
   */
  func getSongs(
    fields: [String],
    filters: [String],
    for userID: User.IDValue,
    on database: Database
  ) async throws -> [(
    id: Int64,
    title: String?,
    artist: String?,
    albumName: String?,
    artworkURLs: String?,
    duration: Int64?,
    fileID: Int64?,
    isPopular: Bool?
  )] {
    do {
      var query = Song.query(on: database).filter(\.$user.$id == userID)

      for filter in filters {
        if filter.contains("_EQUALS_") {
          let entry = filter.components(separatedBy: "_EQUALS_")
          if entry.count < 2 {
            continue
          }

          if entry[0] == "albumID" && Int64(entry[1]) != nil {
            query = query.filter(\.$album.$id == Int64(entry[1]))
          }
        }
      }

      return try await query
        .with(\.$album)
        .all()
        .map { song in (
          id: try song.requireID(),
          title: fields.contains("title") ? song.title : nil,
          artist: fields.contains("artist") ? song.artist : nil,
          albumName: fields.contains("albumName") ? song.album?.name : nil,
          artworkURLs: (
            fields.contains("artworkURLs") ? song.album?.artworkURLs : nil
          ),
          duration: fields.contains("duration") ? song.duration : nil,
          fileID: fields.contains("fileID") ? song.$file.id : nil,
          isPopular: fields.contains("isPopular") ? song.isPopular : nil
        )}
    } catch {
      throw SongError.databaseError
    }
  }

  /**
   * Returns the detail of the given song.
   *
   * - Parameters:
   *   - id: The unique identifier for the song to retrieve.
   *   - fields: The fields of the song to retrieve.
   *   - userID: An identifier for the user whose songs are being retrieved.
   *   - database: The database instance from which the songs will be fetched.
   *
   * - Returns: A tuple containing the detail of the song.
   *
   * - Throws:
   *   - ``SongError/databaseError``: if there is an issue accessing the
   *                                  database.
   *   - ``SongError/noSuchSong``: if the album is not found.
   */
  func getSong(
    with id: Song.IDValue,
    fields: [String],
    for userID: User.IDValue,
    on database: Database
  ) async throws -> (
    playCount: Int64?,
    trackNumber: Int64?,
    discNumber: Int64?,
    sampleSize: Int64?,
    sampleRate: Int64?,
    isPopular: Bool?,
    albumID: Int64?
  ) {
    do {
      guard let song = try await Song.query(on: database)
        .filter(\.$user.$id == userID)
        .filter(\.$id == id)
        .first()
      else {
        throw SongError.noSuchSong
      }

      return (
        playCount: fields.contains("playCount") ? song.playCount : nil,
        trackNumber: fields.contains("trackNumber") ? song.trackNumber : nil,
        discNumber: fields.contains("discNumber") ? song.discNumber : nil,
        sampleSize: fields.contains("sampleSize") ? song.sampleSize : nil,
        sampleRate: fields.contains("sampleRate") ? song.sampleRate : nil,
        isPopular: fields.contains("isPopular") ? song.isPopular : nil,
        albumID: fields.contains("albumID") ? song.$album.id : nil
      )
    } catch SongError.noSuchSong {
      throw SongError.noSuchSong
    } catch {
      throw SongError.databaseError
    }
  }

  /**
   * Updates the info of a song for a specified user.
   *
   * - Parameters:
   *   - id: An identifier for the song to be updated.
   *   - playCount: The new play count for the song. If `nil`, the play count
   *                will not be updated.
   *   - userID: An identifier for the user updating the song.
   *   - database: The database instance where the update will occur.
   *
   * - Throws:
   *   - ``SongError/databaseError``: if there is an issue accessing the
   *                                  database.
   */
  func updateSong(
    with id: Song.IDValue,
    playCount: Int64?,
    for userID: User.IDValue,
    on database: Database
  ) async throws {
    do {
      let query = Song.query(on: database)
        .filter(\.$id == id)
        .filter(\.$user.$id == userID)

      if let playCount {
        query.set(\.$playCount, to: playCount)
      }

      try await query.update()
    } catch {
      throw SongError.databaseError
    }
  }
}
