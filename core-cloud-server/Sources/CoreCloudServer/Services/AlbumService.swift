//
//  AlbumService.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/9/10.
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

struct AlbumService {
  /**
   * Adds a new album to the database with sepcified details.
   * 
   * - Parameters:
   *   - name: The name of the album.
   *   - artist: The artist of the album.
   *   - genre: The genre of the album.
   *   - year: The release year of the album.
   *   - artworkURLs: A string containing URLs for the album artwork.
   *   - userID: The unique identifier for the user who is adding the album.
   *   - database: The database instance where the album will be stored.
   *
   * - Throws:
   *   - ``AlbumError/databaseError``: if there is an issue accessing the
   *                                   database.
   */
  func addAlbum(
    name: String,
    artist: String,
    genre: String,
    year: Int64,
    artworkURLs: String,
    for userID: User.IDValue,
    on database: Database
  ) async throws {
    let album = Album(
      name: name,
      artist: artist,
      genre: genre,
      year: year,
      artworkURLs: artworkURLs,
      userID: userID
    )

    do {
      try await album.save(on: database)
    } catch {
      throw AlbumError.databaseError
    }
  }

  /**
   * Returns a list of albums for a specified user.
   *
   * - Parameters:
   *   - userID: An identifier for the user whose albums are being retrieved.
   *   - database: The database instance from which the albums will be fetched.
   *
   * - Returns: An array of tuples, each containing the album details:
   *   - id: The identifier of the album.
   *   - name: The name of the album.
   *   - artist: The artist of the album.
   *   - artworkURLs: The artwork urls of the album.
   *
   * - Throws:
   *   - ``AlbumError/databaseError``: if there is an issue accessing the
   *                                   database.
   */
  func getAlbums(
    for userID: User.IDValue,
    on database: Database
  ) async throws -> [(
    id: Int64,
    name: String,
    artist: String,
    artworkURLs: String
  )] {
    do {
      return try await Album.query(on: database)
        .filter(\.$user.$id == userID)
        .all()
        .map { album in (
          id: try album.requireID(),
          name: album.name,
          artist: album.artist,
          artworkURLs: album.artworkURLs
        )}
    } catch {
      throw AlbumError.databaseError
    }
  }

  /**
   * Retrieves album details based on the specified album ID and user ID.
   *
   * - Parameters:
   *   - id: The unique identifier for the album to retrieve.
   *   - userID: The unique identifier for the user requesting the album.
   *   - database: The database instance used to perform the query.
   *
   * - Returns: A tuple containing the genre and year of the album, or `nil`
   *            if the album is not found.
   *
   * - Throws:
   *   - ``AlbumError/databaseError``: if there is an issue accessing the
   *                                   database.
   *   - ``AlbumError/noSuchAlbum``: if the album is not found.
   */
  func getAlbum(
    with id: Album.IDValue,
    for userID: User.IDValue,
    on database: Database
  ) async throws -> (
    genre: String,
    year: Int64
  ) {
    do {
      guard let album = try await Album.query(on: database)
        .filter(\.$user.$id == userID)
        .filter(\.$id == id)
        .first()
      else {
        throw AlbumError.noSuchAlbum
      }

      return (
        genre: album.genre,
        year: album.year
      )
    } catch AlbumError.noSuchAlbum {
      throw AlbumError.noSuchAlbum
    } catch {
      throw AlbumError.databaseError
    }
  }

  /**
   * Returns a Boolean value indicating whether the database contains the given
   * album.
   *
   * - Parameters:
   *   - id: The unique identifier for the album to retrieve.
   *   - userID: The unique identifier for the user requesting the album.
   *   - database: The database instance used to perform the query.
   *
   * - Throws:
   *   - ``AlbumError/databaseError``: if there is an issue accessing the
   *                                   database.
   */
  func containsAlbum(
    with id: Album.IDValue,
    for userID: User.IDValue,
    on database: Database
  ) async throws -> Bool {
    do {
      let count = try await Album.query(on: database)
        .filter(\.$user.$id == userID)
        .filter(\.$id == id)
        .count()

      return count > 0
    } catch {
      throw AlbumError.databaseError
    }
  }
}
