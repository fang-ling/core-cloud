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
   *   - userID: An identifier for the user whose songs are being retrieved.
   *   - database: The database instance from which the songs will be fetched.
   *
   * - Returns: An array of tuples, each containing the song details:
   *   - id: The identifier of the song.
   *   - title: The title of the song.
   *   - artist: The artist of the song.
   *   - trackNumber: The track number in the album.
   *   - discNumber: The disc number for multi-disc albums.
   *   - playCount: The number of times the song has been played.
   *   - sampleSize: The size of the audio sample.
   *   - sampleRate: The audio sample rate.
   *   - fileID: The identifier for the audio file.
   *
   * - Throws:
   *   - ``SongError/databaseError``: if there is an issue accessing the
   *                                  database.
   */
  func getSongs(
    for userID: User.IDValue,
    on database: Database
  ) async throws -> [(
    id: Int64,
    title: String,
    artist: String,
    trackNumber: Int64,
    discNumber: Int64,
    playCount: Int64,
    sampleSize: Int64,
    sampleRate: Int64,
    fileID: Int64
  )] {
    do {
      return try await Song.query(on: database)
        .filter(\.$user.$id == userID)
        .all()
        .map { song in (
          id: try song.requireID(),
          title: song.title,
          artist: song.artist,
          trackNumber: song.trackNumber,
          discNumber: song.discNumber,
          playCount: song.playCount,
          sampleSize: song.sampleSize,
          sampleRate: song.sampleRate,
          fileID: song.$file.id
        )}
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
