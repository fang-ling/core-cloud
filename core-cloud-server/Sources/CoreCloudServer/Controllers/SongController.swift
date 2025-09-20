//
//  SongController.swift
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

import Vapor

struct SongController: RouteCollection {
  let albumService = AlbumService()
  let fileService = FileService()
  let songService = SongService()
  let userTokenService = UserTokenService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("song")
      .post(use: insertSongHandler)

    routes
      .grouped("api")
      .grouped("songs")
      .get(use: fetchSongsHandler)

    routes
      .grouped("api")
      .grouped("song")
      .get(use: fetchSongHandler)

    routes
      .grouped("api")
      .grouped("song")
      .patch(use: modifySongHandler)
  }

  /**
   * - URL: POST /api/song
   *
   * - Response Codes:
   *   - 201 Created: The request has been fulfilled, resulting in the creation
   *                  of a new song.
   *   - 400 Bad Request: The server cannot or will not process the request due
   *                      to an apparent client error.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func insertSongHandler(request: Request) async -> HTTPStatus {
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

    let insertRequest: Song.Singular.Input.Insertion
    do {
      insertRequest = try request.content.decode(
        Song.Singular.Input.Insertion.self
      )
    } catch {
      return .badRequest
    }

    let (fileKind, fileApplication): (String, String)
    do {
      (fileKind, fileApplication) = try await fileService.getFile(
        by: insertRequest.fileID,
        for: userID,
        on: request.db
      )
    } catch {
      return .badRequest
    }
    if fileApplication != "Music" {
      return .badRequest
    }
    if fileKind != "Apple MPEG-4 Audio" {
      return .badRequest
    }

    do {
      let isExist = try await albumService.containsAlbum(
        with: insertRequest.albumID,
        for: userID,
        on: request.db
      )

      guard isExist else {
        return .badRequest
      }
    } catch {
      return .internalServerError
    }

    do {
      try await songService.addSong(
        title: insertRequest.title,
        artist: insertRequest.artist,
        trackNumber: insertRequest.trackNumber,
        discNumber: insertRequest.discNumber,
        playCount: insertRequest.playCount,
        sampleSize: insertRequest.sampleSize,
        sampleRate: insertRequest.sampleRate,
        isPopular: insertRequest.isPopular,
        duration: insertRequest.duration,
        with: insertRequest.fileID,
        for: userID,
        at: insertRequest.albumID,
        on: request.db
      )

      return .created
    } catch SongError.databaseError {
      return .serviceUnavailable
    } catch {
      return .internalServerError
    }
  }

  /**
   * - URL: GET /api/songs
   *
   * - Response Codes:
   *   - 200 OK: The songs are returned.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func fetchSongsHandler(request: Request) async -> Response {
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
      /* TODO: Add query parameter. */
      let songs = try await songService.getSongs(
        options: [.withAlbumName, .withArtworkURLs],
        for: userID,
        on: request.db
      )

      return try Response(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            songs.map { song in
              Song.Plural.Output.Retrieval(
                id: song.id,
                title: song.title,
                artist: song.artist,
                albumName: song.albumName,
                artworkURLs: song.artworkURLs,
                duration: song.duration,
                fileID: song.fileID
              )
            }
          )
        )
      )
    } catch SongError.databaseError {
      return Response(status: .serviceUnavailable)
    } catch {
      return Response(status: .internalServerError)
    }
  }

  /**
   * - URL: GET /api/song
   *
   * - Response Codes:
   *   - 200 OK: The song is returned.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 404 Not Found: The song is not found.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func fetchSongHandler(request: Request) async -> Response {
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

    let fetchRequest: Song.Singular.Input.Retrieval
    do {
      fetchRequest = try request.query.decode(
        Song.Singular.Input.Retrieval.self
      )
    } catch {
      return Response(status: .badRequest)
    }

    do {
      let song = try await songService.getSong(
        with: fetchRequest.id,
        fields: fetchRequest.fields.components(separatedBy: ","),
        for: userID,
        on: request.db
      )

      return try Response(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            Song.Singular.Output.Retrieval(
              playCount: song.playCount,
              trackNumber: song.trackNumber,
              discNumber: song.discNumber,
              sampleSize: song.sampleSize,
              sampleRate: song.sampleRate,
              isPopular: song.isPopular,
              albumID: song.albumID
            )
          )
        )
      )
    } catch SongError.noSuchSong {
      return Response(status: .notFound)
    } catch SongError.databaseError {
      return Response(status: .serviceUnavailable)
    } catch {
      return Response(status: .internalServerError)
    }
  }

  /**
   * - URL: PATCH /api/song
   *
   * - Query Parameters:
   *   - id [Int64] (required): The id of the song.
   *   - playCount [Int64] (optional): The new play count of the song.
   *
   * - Response Codes:
   *   - 200 OK: The request was successful.
   *   - 400 Bad Request: The server cannot or will not process the request due
   *                      to an apparent client error.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func modifySongHandler(request: Request) async -> HTTPStatus {
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

    var modifyRequest: Song.Singular.Input.Modification
    do {
      modifyRequest = try request.query.decode(
        Song.Singular.Input.Modification.self
      )
    } catch {
      return .badRequest
    }

    do {
      try await songService.updateSong(
        with: modifyRequest.id,
        playCount: modifyRequest.playCount,
        for: userID,
        on: request.db
      )

      return .ok
    } catch SongError.databaseError {
      return .serviceUnavailable
    } catch {
      return .internalServerError
    }
  }
}
