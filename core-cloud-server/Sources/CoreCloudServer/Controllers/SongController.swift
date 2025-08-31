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
  let fileService = FileService()
  let songService = SongService()
  let userTokenService = UserTokenService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("v1")
      .grouped("song")
      .post(use: insertSongHandler)
  }

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
      try await songService.addSong(
        title: insertRequest.title,
        artist: insertRequest.artist,
        genre: insertRequest.genre,
        year: insertRequest.year,
        trackNumber: insertRequest.trackNumber,
        discNumber: insertRequest.discNumber,
        playCount: insertRequest.playCount,
        sampleSize: insertRequest.sampleSize,
        sampleRate: insertRequest.sampleRate,
        with: insertRequest.fileID,
        for: userID,
        on: request.db
      )

      return .created
    } catch SongError.databaseError {
      return .serviceUnavailable
    } catch {
      return .internalServerError
    }
  }
}
