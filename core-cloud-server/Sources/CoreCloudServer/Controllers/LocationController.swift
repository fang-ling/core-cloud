//
//  LocationController.swift
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

import Vapor

struct LocationController: RouteCollection {
  let locationService = LocationService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("location")
      .post(use: insertLocationHandler)

    routes
      .grouped("api")
      .grouped("locations")
      .get(use: fetchLocationsHandler)
  }

  /**
   * - URL: POST /api/v1/location
   *
   * - Response Codes:
   *   - 201 Created: The request has been fulfilled, resulting in the creation
   *                  of a new location.
   *   - 400 Bad Request: The server cannot or will not process the request due
   *                      to an apparent client error.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func insertLocationHandler(request: Request) async -> HTTPStatus {
    let userID: User.IDValue
    do {
      let jwt = request.headers.cookie?.all[CoreCloudServer.COOKIE_NAME]?.string
      let userToken = try await request.jwt.verify(
        jwt ?? "",
        as: UserToken.self
      )
      guard let id = User.IDValue(userToken.subject.value) else {
        return .unauthorized
      }
      userID = id
    } catch {
      return .unauthorized
    }

    let insertRequest: Location.Singular.Input.Insertion
    do {
      insertRequest = try request.content.decode(
        Location.Singular.Input.Insertion.self
      )
    } catch {
      return .badRequest
    }

    do {
      try await locationService.insertLocation(
        name: insertRequest.name,
        path: insertRequest.path,
        for: userID,
        on: request.db
      )

      return .created
    } catch LocationError.databaseError {
      return .serviceUnavailable
    } catch {
      return .internalServerError
    }
  }

  /**
   * - URL: GET /api/v1/locations
   *
   * - Response Codes:
   *   - 200 OK: The locations is returned.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func fetchLocationsHandler(request: Request) async -> Response {
    let userID: User.IDValue
    do {
      let jwt = request.headers.cookie?.all[CoreCloudServer.COOKIE_NAME]?.string
      let userToken = try await request.jwt.verify(
        jwt ?? "",
        as: UserToken.self
      )
      guard let id = User.IDValue(userToken.subject.value) else {
        return Response(status: .unauthorized)
      }
      userID = id
    } catch {
      return Response(status: .unauthorized)
    }

    do {
      let locations = try await locationService.getLocations(
        for: userID,
        on: request.db
      )

      return try Response(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            locations.map {
              Location.Plural.Output.Retrieval(
                id: $0.id,
                name: $0.name
              )
            }
          )
        )
      )
    } catch LocationError.databaseError {
      return Response(status: .serviceUnavailable)
    } catch {
      return Response(status: .internalServerError)
    }
  }
}
