//
//  HomeVideoController.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/10/5.
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

struct HomeVideoController: RouteCollection {
  let fileService = FileService()
  let homeVideoService = HomeVideoService()
  let userTokenService = UserTokenService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("home-video")
      .post(use: insertHomeVideoHandler)

    routes
      .grouped("api")
      .grouped("home-videos")
      .get(use: fetchHomeVideosHandler)
  }

  /**
   * - URL: POST /api/home-video
   *
   * - Response Codes:
   *   - 201 Created: The request has been fulfilled, resulting in the creation
   *                  of a new home video.
   *   - 400 Bad Request: The server cannot or will not process the request due
   *                      to an apparent client error.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func insertHomeVideoHandler(request: Request) async -> HTTPStatus {
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

    let insertRequest: HomeVideo.Singular.Input.Insertion
    do {
      insertRequest = try request.content.decode(
        HomeVideo.Singular.Input.Insertion.self
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
    if fileApplication != "TV" {
      return .badRequest
    }
    if fileKind != "MPEG-4 Movie" {
      return .badRequest
    }

    do {
      try await homeVideoService.addHomeVideo(
        title: insertRequest.title,
        cast: insertRequest.cast,
        director: insertRequest.director,
        genre: insertRequest.genre,
        tags: insertRequest.tags,
        date: insertRequest.date,
        duration: insertRequest.duration,
        artworkURLs: insertRequest.artworkURLs,
        width: insertRequest.width,
        height: insertRequest.height,
        isHDR: insertRequest.isHDR,
        videoCodec: insertRequest.videoCodec,
        audioCodec: insertRequest.audioCodec,
        with: insertRequest.fileID,
        for: userID,
        on: request.db
      )

      return .created
    } catch HomeVideoError.databaseError {
      return .serviceUnavailable
    } catch {
      return .internalServerError
    }
  }

  /**
   * - URL: GET /api/home-videos
   *
   * - Response Codes:
   *   - 200 OK: The home videos are returned.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func fetchHomeVideosHandler(request: Request) async -> Response {
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

    let fetchRequest: HomeVideo.Plural.Input.Retrieval
    do {
      fetchRequest = try request.query.decode(
        HomeVideo.Plural.Input.Retrieval.self
      )
    } catch {
      return Response(status: .badRequest)
    }

    do {
      let homeVideos = try await homeVideoService.getHomeVideos(
        fields: fetchRequest.fields.components(separatedBy: ","),
        filters: fetchRequest.filters?.components(separatedBy: ",") ?? [],
        for: userID,
        on: request.db
      )

      return try Response(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            homeVideos.map { homeVideo in
              HomeVideo.Plural.Output.Retrieval(
                id: homeVideo.id,
                title: homeVideo.title,
                artworkURLs: homeVideo.artworkURLs,
                fileID: homeVideo.fileID
              )
            }
          )
        )
      )
    } catch HomeVideoError.databaseError {
      return Response(status: .serviceUnavailable)
    } catch {
      return Response(status: .internalServerError)
    }
  }
}
