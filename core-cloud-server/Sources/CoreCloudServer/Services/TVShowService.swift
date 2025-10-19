//
//  TVShowService.swift
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

struct TVShowService {
  /**
   * Adds a new tv show to the database with sepcified details.
   *
   * - Parameters:
   *   - name: The title of the tv show.
   *   - starring: The starring of the tv show.
   *   - genre: The genre of the tv show.
   *   - startYear: The start year of the tv show.
   *   - endYear: The end year of the tv show.
   *   - region: The region of the tv show.
   *   - description: The description of the tv show.
   *   - posterURLs: A string containing URLs for the tv show poster.
   *   - artworkURLs: A string containing URLs for the tv show artwork.
   *   - titleLogoURLs: A string containing URLs for the tv show title logo.
   *   - studio: The studio of the tv show.
   *   - userID: The unique identifier for the user who is adding the tv show.
   *   - database: The database instance where the tv show will be stored.
   *
   * - Throws:
   *   - ``TVShow.Error/databaseError``: if there is an issue accessing the
   *                                     database.
   */
  func addTVShow(
    title: String,
    starring: String,
    genre: String,
    startYear: Int64,
    endYear: Int64,
    region: String,
    description: String,
    posterURLs: String,
    artworkURLs: String,
    titleLogoURLs: String?,
    studio: String,
    for userID: User.IDValue,
    on database: Database
  ) async throws {
    let tvShow = TVShow(
      title: title,
      starring: starring,
      genre: genre,
      startYear: startYear,
      endYear: endYear,
      region: region,
      description: description,
      posterURLs: posterURLs,
      artworkURLs: artworkURLs,
      titleLogoURLs: titleLogoURLs,
      studio: studio,
      userID: userID
    )

    do {
      try await tvShow.save(on: database)
    } catch {
      throw TVShow.Error.databaseError
    }
  }

  /**
   * Returns a list of tv shows for a specified user.
   *
   * - Parameters:
   *   - userID: An identifier for the user whose tv shows are being retrieved.
   *   - fields: The fields of the tv show to retrieve.
   *   - database: The database instance from which the tv shows will be
   *               fetched.
   *
   * - Returns: An array of tuples, each containing the tv show details.
   *
   * - Throws:
   *   - ``TVShow.Error/databaseError``: if there is an issue accessing the
   *                                     database.
   */
  func getTVShows(
    for userID: User.IDValue,
    fields: [String],
    on database: Database
  ) async throws -> [(
    id: Int64,
    posterURLs: String?
  )] {
    do {
      return try await TVShow.query(on: database)
        .filter(\.$user.$id == userID)
        .all()
        .map { tvShow in (
          id: try tvShow.requireID(),
          posterURLs: fields.contains("posterURLs") ? tvShow.posterURLs : nil
        )}
    } catch {
      throw TVShow.Error.databaseError
    }
  }
}
