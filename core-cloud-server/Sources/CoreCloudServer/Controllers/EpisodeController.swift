//
//  EpisodeController.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/10/26.
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

struct EpisodeController: RouteCollection {
  let episodeService = EpisodeService()
  let fileService = FileService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("episode")
      .grouped(AuthenticatorMiddleware())
      .post(use: insertEpisodeHandler)

    routes
      .grouped("api")
      .grouped("episodes")
      .grouped(AuthenticatorMiddleware())
      .get(use: fetchEpisodesHandler)
  }

  /**
   * - URL: POST /api/episode
   *
   * - Response Codes:
   *   - 201 Created: The request has been fulfilled, resulting in the creation
   *                  of a new episode.
   *   - 400 Bad Request: The server cannot or will not process the request due
   *                      to an apparent client error.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func insertEpisodeHandler(request: Request) async -> HTTPStatus {
    guard let userID = request.userID else {
      return .unauthorized
    }

    guard
      let input = try? request.content.decode(
        Episode.Singular.Input.Insertion.self
      ),
      let (fileKind, fileApplication) = try? await fileService.getFile(
        by: input.fileID,
        for: userID,
        on: request.db
      ),
      fileApplication == "TV",
      fileKind == "MPEG-4 Movie"
    else {
      return .badRequest
    }

    do {
      try await episodeService.addEpisode(
        title: input.title,
        artworkURLs: input.artworkURLs,
        description: input.description,
        date: Date(timeIntervalSince1970: Double(input.date) / 1000),
        episodeNumber: input.episodeNumber,
        seasonNumber: input.seasonNumber,
        duration: input.duration,
        width: input.width,
        height: input.height,
        isHDR: input.isHDR,
        videoCodec: input.videoCodec,
        audioCodec: input.audioCodec,
        fileID: input.fileID,
        tvShowID: input.tvShowID,
        for: userID,
        on: request.db
      )

      return .created
    } catch Episode.Error.databaseError {
      return .serviceUnavailable
    } catch {
      return .internalServerError
    }
  }

  /**
   * - URL: GET /api/episodes
   *
   * - Response Codes:
   *   - 200 OK: The episodes are returned.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func fetchEpisodesHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return Response(status: .unauthorized)
    }

    guard let input = try? request.query.decode(
      Episode.Plural.Input.Retrieval.self
    ) else {
      return Response(status: .badRequest)
    }

    do {
      let episodes = try await episodeService.getEpisodes(
        for: userID,
        fields: input.fields.components(separatedBy: ","),
        filters: input.filters.components(separatedBy: ","),
        on: request.db
      )

      return try Response(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            episodes.map { episode in
              Episode.Plural.Output.Retrieval(
                id: episode.id,
                title: episode.title,
                artworkURLs: episode.artworkURLs,
                description: episode.description,
                date: (
                  episode.date == nil
                    ? nil
                  : Int64(episode.date!.timeIntervalSince1970 * 1000)
                ),
                episodeNumber: episode.episodeNumber,
                seasonNumber: episode.seasonNumber,
                duration: episode.duration,
                width: episode.width,
                height: episode.height,
                isHDR: episode.isHDR,
                fileID: episode.fileID
              )
            }
          )
        )
      )
    } catch Episode.Error.databaseError {
      return Response(status: .serviceUnavailable)
    } catch {
      return Response(status: .internalServerError)
    }
  }
}
