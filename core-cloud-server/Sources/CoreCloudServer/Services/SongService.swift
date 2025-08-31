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
   *   - genre: The genre of the song.
   *   - year: The release year of the song.
   *   - trackNumber: The track number in the album.
   *   - discNumber: The disc number for multi-disc albums.
   *   - playCount: A number indicating how many times the song has been played.
   *   - sampleSize: The size of the audio sample.
   *   - sampleRate: The audio sample rate.
   *   - fileID: An identifier for the audio file.
   *   - userID: An identifier for the user adding the song.
   *   - database: The database instance where the song will be added.
   *
   * - Throws:
   *   - ``SongError/databaseError``: if there is an issue accessing the
   *                                  database.
   */
  func addSong(
    title: String,
    artist: String,
    genre: String,
    year: Int64,
    trackNumber: Int64,
    discNumber: Int64,
    playCount: Int64,
    sampleSize: Int64,
    sampleRate: Int64,
    with fileID: File.IDValue,
    for userID: User.IDValue,
    on database: Database
  ) async throws {
    let song = Song(
      title: title,
      artist: artist,
      genre: genre,
      year: year,
      trackNumber: trackNumber,
      discNumber: discNumber,
      playCount: playCount,
      sampleSize: sampleSize,
      sampleRate: sampleRate,
      fileID: fileID,
      userID: userID
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
   *   - `title`: The title of the song.
   *   - `artist`: The artist of the song.
   *   - `genre`: The genre of the song.
   *   - `year`: The release year of the song.
   *   - `trackNumber`: The track number in the album.
   *   - `discNumber`: The disc number for multi-disc albums.
   *   - `playCount`: The number of times the song has been played.
   *   - `sampleSize`: The size of the audio sample.
   *   - `sampleRate`: The audio sample rate.
   *   - `fileID`: The identifier for the audio file.
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
    genre: String,
    year: Int64,
    trackNumber: Int64,
    discNumber: Int64,
    playCount: Int64,
    sampleSize: Int64,
    sampleRate: Int64,
    fileID: Int64
  )] {
    do {
      let songs = try await Song.query(on: database)
        .filter(\.$user.$id == userID)
        .all()

      return try songs.map { song in
        (
          id: try song.requireID(),
          title: song.title,
          artist: song.artist,
          genre: song.genre,
          year: song.year,
          trackNumber: song.trackNumber,
          discNumber: song.discNumber,
          playCount: song.playCount,
          sampleSize: song.sampleSize,
          sampleRate: song.sampleRate,
          fileID: song.$file.id
        )
      }
    } catch {
      throw SongError.databaseError
    }
  }
}
