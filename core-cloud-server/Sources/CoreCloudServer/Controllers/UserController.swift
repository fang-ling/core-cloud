//
//  UserController.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/7/29.
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

struct UserController: RouteCollection {
  var userService = UserService()
  var settingService = SettingService()

  func boot(routes: RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("user")
      .on(.HEAD, use: peekUserHandler)

    routes
      .grouped("api")
      .grouped("user")
      .post(use: insertUserHandler)

    routes
      .grouped("api")
      .grouped("user")
      .get(use: fetchUserHandler)
  }

  /**
   * - URL: HEAD /api/v1/user?username={username}
   *
   * - Query Parameters:
   *   - username [String] (required): The username for the user.
   *
   * - Response Codes:
   *   - 200 OK: The user exists.
   *   - 204 No Content: The user does not exist.
   *   - 400 Bad Request: The server cannot or will not process the request due
   *                      to an apparent client error.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func peekUserHandler(request: Request) async -> HTTPStatus {
    var peekRequest: User.Singular.Input.Peek
    do {
      peekRequest = try request.query.decode(User.Singular.Input.Peek.self)
    } catch {
      return .badRequest
    }
    guard let username = peekRequest.username else {
      return .badRequest
    }

    do {
      let isExist = try await userService.peekUser(
        by: username,
        on: request.db
      )

      return isExist ? .ok : .noContent
    } catch UserError.databaseError {
      return .serviceUnavailable
    } catch {
      return .internalServerError
    }
  }

  /**
   * - URL: POST /api/v1/user
   *
   * - Response Codes:
   *   - 201 Created: The request has been fulfilled, resulting in the creation
   *                  of a new user.
   *   - 400 Bad Request: The server cannot or will not process the request due
   *                      to an apparent client error.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func insertUserHandler(request: Request) async -> HTTPStatus {
    guard let insertRequest = try? request.content.decode(
      User.Singular.Input.Insertion.self
    ) else {
      return .badRequest
    }

    do {
      let user = try await userService.insertUser(
        firstName: insertRequest.firstName,
        lastName: insertRequest.lastName,
        username: insertRequest.username,
        password: insertRequest.password,
        masterPassword: insertRequest.masterPassword,
        on: request.db
      )

      /* Also create the setting for newly created user. */
      try await settingService.insertSetting(
        homeBackgroundColor: 0,
        for: user.requireID(),
        on: request.db
      )

      return .created
    } catch UserError.cryptoError {
      return .serviceUnavailable
    } catch UserError.databaseError {
      return .serviceUnavailable
    } catch {
      return .internalServerError
    }
  }

  /**
   * - URL: GET /api/v1/user
   *
   * - Response Codes:
   *   - 200 OK: The user detail is returned.
   *   - 204 No Content: The user does not exist.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func fetchUserHandler(request: Request) async -> Response {
    let id: User.IDValue
    do {
      let jwt = request.headers.cookie?.all[CoreCloudServer.COOKIE_NAME]?.string
      let userToken = try await request.jwt.verify(
        jwt ?? "",
        as: UserToken.self
      )
      id = Int64(userToken.subject.value) ?? -1
    } catch {
      return Response(status: .unauthorized)
    }

    do {
      let detail = try await userService.getUser(with: id, on: request.db)

      return try Response(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            User.Singular.Output.Retrieval(
              username: detail.username,
              firstName: detail.firstName,
              lastName: detail.lastName,
              avatarURLs: detail.avatarURLs
            )
          )
        )
      )
    } catch UserError.noSuchUser {
      return Response(status: .noContent)
    } catch UserError.databaseError {
      return Response(status: .serviceUnavailable)
    } catch {
      return Response(status: .internalServerError)
    }
  }
}
