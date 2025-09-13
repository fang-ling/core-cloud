//
//  AlbumController.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/9/13.
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

struct AlbumController: RouteCollection {
  let albumService = AlbumService()
  let userTokenService = UserTokenService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("album")
      .post(use: insertAlbumHandler)

    routes
      .grouped("api")
      .grouped("albums")
      .get(use: fetchAlbumsHandler)

    routes
      .grouped("api")
      .grouped("album")
      .get(use: fetchAlbumHandler)
  }

  /**
   * - URL: POST /api/album
   *
   * - Response Codes:
   *   - 201 Created: The request has been fulfilled, resulting in the creation
   *                  of a new album.
   *   - 400 Bad Request: The server cannot or will not process the request due
   *                      to an apparent client error.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func insertAlbumHandler(request: Request) async -> HTTPStatus {
    let userID: User.IDValue
    do {
      let jwt = request.headers.cookie?.all[CoreCloudServer.COOKIE_NAME]?.string
      let id = try await userTokenService.verifyUserToken(
        from: jwt ?? ""
      ) { token in
        try await request.jwt.verify(token)
      }
      userID = id
    } catch {
      return .unauthorized
    }

    let insertRequest: Album.Singular.Input.Insertion
    do {
      insertRequest = try request.content.decode(
        Album.Singular.Input.Insertion.self
      )
    } catch {
      return .badRequest
    }

    do {
      try await albumService.addAlbum(
        name: insertRequest.name,
        artist: insertRequest.artist,
        genre: insertRequest.genre,
        year: insertRequest.year,
        artworkURLs: insertRequest.artworkURLs,
        for: userID,
        on: request.db
      )

      return .created
    } catch AlbumError.databaseError {
      return .serviceUnavailable
    } catch {
      return .internalServerError
    }
  }

  /**
   * - URL: GET /api/albums
   *
   * - Response Codes:
   *   - 200 OK: The albums are returned.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func fetchAlbumsHandler(request: Request) async -> Response {
    let userID: User.IDValue
    do {
      let jwt = request.headers.cookie?.all[CoreCloudServer.COOKIE_NAME]?.string
      let id = try await userTokenService.verifyUserToken(
        from: jwt ?? ""
      ) { token in
        try await request.jwt.verify(token)
      }
      userID = id
    } catch {
      return Response(status: .unauthorized)
    }

    do {
      let albums = try await albumService.getAlbums(for: userID, on: request.db)

      return try Response(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            albums.map { album in
              Album.Plural.Output.Retrieval(
                id: album.id,
                name: album.name,
                artist: album.artist,
                artworkURLs: album.artworkURLs
              )
            }
          )
        )
      )
    } catch AlbumError.databaseError {
      return Response(status: .serviceUnavailable)
    } catch {
      return Response(status: .internalServerError)
    }
  }

  /**
   * - URL: GET /api/album
   *
   * - Response Codes:
   *   - 200 OK: The album is returned.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 404 Not Found: The album is not found.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func fetchAlbumHandler(request: Request) async -> Response {
    let userID: User.IDValue
    do {
      let jwt = request.headers.cookie?.all[CoreCloudServer.COOKIE_NAME]?.string
      let id = try await userTokenService.verifyUserToken(
        from: jwt ?? ""
      ) { token in
        try await request.jwt.verify(token)
      }
      userID = id
    } catch {
      return Response(status: .unauthorized)
    }

    let fetchRequest: Album.Singular.Input.Retrieval
    do {
      fetchRequest = try request.query.decode(
        Album.Singular.Input.Retrieval.self
      )
    } catch {
      return Response(status: .badRequest)
    }

    do {
      guard let album = try await albumService.getAlbum(
        with: fetchRequest.id,
        for: userID,
        on: request.db
      ) else {
        return Response(status: .notFound)
      }

      return try Response(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            Album.Singular.Output.Retrieval(
              genre: album.genre,
              year: album.year
            )
          )
        )
      )
    } catch AlbumError.databaseError {
      return Response(status: .serviceUnavailable)
    } catch {
      return Response(status: .internalServerError)
    }
  }
}
