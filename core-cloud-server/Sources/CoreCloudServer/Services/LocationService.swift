//
//  LocationService.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/17.
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

struct LocationService {
  /**
   * Adds a new location for the user.
   *
   * - Parameters:
   *   - name: The name of the location.
   *   - path: The path of the location.
   *   - userID: The id of the user.
   *   - database: The database to insert for the location.
   *
   * - Throws:
   *   - ``LocationError/databaseError``: if there is an issue accessing the
   *                                      database.
   */
  func insertLocation(
    name: String,
    path: String,
    for userID: User.IDValue,
    on database: Database
  ) async throws {
    let location = Location(
      name: name,
      path: path,
      userID: userID
    )

    do {
      try await location.save(on: database)
    } catch {
      throw LocationError.databaseError
    }
  }

  /**
   * Returns locations of the user.
   *
   * - Parameters:
   *   - userID: The id of the user.
   *   - database: The database to query for the locations.
   *
   * - Throws:
   *   - ``LocationError/databaseError``: if there is an issue accessing the
   *                                      database.
   */
  func getLocations(
    for userID: User.IDValue,
    on database: Database
  ) async throws -> [(
    id: Int64,
    name: String
  )] {
    do {
      let locations = try await Location.query(on: database)
        .filter(\.$user.$id == userID)
        .all()

      return try locations.map({(
        id: try $0.requireID(),
        name: $0.name
      )})
    } catch {
      throw LocationError.databaseError
    }
  }
}
