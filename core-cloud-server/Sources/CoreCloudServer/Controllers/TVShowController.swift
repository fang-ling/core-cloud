//
//  TVShowController.swift
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

import Vapor

struct TVShowController: RouteCollection {
  let tvShowService = TVShowService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("tv-show")
      .grouped(AuthenticatorMiddleware())
      .post(use: insertTVShowHandler)

    routes
      .grouped("api")
      .grouped("tv-shows")
      .grouped(AuthenticatorMiddleware())
      .get(use: fetchTVShowsHandler)

    routes
      .grouped("api")
      .grouped("tv-show")
      .grouped(AuthenticatorMiddleware())
      .get(use: fetchTVShowHandler)
  }

  /**
   * - URL: POST /api/tv-show
   *
   * - Response Codes:
   *   - 201 Created: The request has been fulfilled, resulting in the creation
   *                  of a new tv show.
   *   - 400 Bad Request: The server cannot or will not process the request due
   *                      to an apparent client error.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func insertTVShowHandler(request: Request) async -> HTTPStatus {
    guard let userID = request.userID else {
      return .unauthorized
    }

    let insertRequest: TVShow.Singular.Input.Insertion
    do {
      insertRequest = try request.content.decode(
        TVShow.Singular.Input.Insertion.self
      )
    } catch {
      return .badRequest
    }

    do {
      try await tvShowService.addTVShow(
        title: insertRequest.title,
        starring: insertRequest.starring,
        genre: insertRequest.genre,
        startYear: insertRequest.startYear,
        endYear: insertRequest.endYear,
        region: insertRequest.region,
        description: insertRequest.description,
        posterURLs: insertRequest.posterURLs,
        artworkURLs: insertRequest.artworkURLs,
        titleLogoURLs: insertRequest.titleLogoURLs,
        studio: insertRequest.studio,
        for: userID,
        on: request.db
      )

      return .created
    } catch TVShow.Error.databaseError {
      return .serviceUnavailable
    } catch {
      return .internalServerError
    }
  }

  /**
   * - URL: GET /api/tv-shows
   *
   * - Response Codes:
   *   - 200 OK: The tv shows are returned.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func fetchTVShowsHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return Response(status: .unauthorized)
    }

    let fetchRequest: TVShow.Plural.Input.Retrieval
    do {
      fetchRequest = try request.query.decode(
        TVShow.Plural.Input.Retrieval.self
      )
    } catch {
      return Response(status: .badRequest)
    }

    do {
      let tvShows = try await tvShowService.getTVShows(
        for: userID,
        fields: fetchRequest.fields.components(separatedBy: ","),
        on: request.db
      )

      return try Response(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            tvShows.map { tvShow in
              TVShow.Plural.Output.Retrieval(
                id: tvShow.id,
                posterURLs: tvShow.posterURLs,
                title: tvShow.title,
                startYear: tvShow.startYear,
                endYear: tvShow.endYear
              )
            }
          )
        )
      )
    } catch TVShow.Error.databaseError {
      return Response(status: .serviceUnavailable)
    } catch {
      return Response(status: .internalServerError)
    }
  }

  /**
   * - URL: GET /api/tv-show
   *
   * - Response Codes:
   *   - 200 OK: The tv show is returned.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 404 Not Found: The tv show is not found.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func fetchTVShowHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return Response(status: .unauthorized)
    }

    let fetchRequest: TVShow.Singular.Input.Retrieval
    do {
      fetchRequest = try request.query.decode(
        TVShow.Singular.Input.Retrieval.self
      )
    } catch {
      return Response(status: .badRequest)
    }

    do {
      let tvShow = try await tvShowService.getTVShow(
        with: fetchRequest.id,
        for: userID,
        on: request.db
      )

      return try Response(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            TVShow.Singular.Output.Retrieval(
              artworkURLs: tvShow.artworkURLs,
              titleLogoURLs: tvShow.titleLogoURLs,
              title: tvShow.title,
              starring: tvShow.starring,
              startYear: tvShow.startYear,
              endYear: tvShow.endYear,
              region: tvShow.region,
              description: tvShow.description,
              studio: tvShow.studio,
              genre: tvShow.genre
            )
          )
        )
      )
    } catch TVShow.Error.noSuchTVShow {
      return Response(status: .notFound)
    } catch TVShow.Error.databaseError {
      return Response(status: .serviceUnavailable)
    } catch {
      return Response(status: .internalServerError)
    }
  }
}
