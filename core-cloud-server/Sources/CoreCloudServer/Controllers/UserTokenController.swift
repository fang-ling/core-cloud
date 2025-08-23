//
//  UserTokenController.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/2.
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

struct UserTokenController: RouteCollection {
  var userTokenService = UserTokenService()

  func boot(routes: RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("v1")
      .grouped("user-token")
      .post(use: insertUserTokenHandler)
  }

  /**
   * - URL: POST /api/v1/user-token
   *
   * - Response Codes:
   *   - 201 Created: The request has been fulfilled, resulting in the creation
   *                  of a new user token.
   *   - 400 Bad Request: The server cannot or will not process the request due
   *                      to an apparent client error.
   *   - 401 Unauthorized: A response indicating an incorrect Authorization
   *                       header.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func insertUserTokenHandler(request: Request) async -> Response {
    guard let insertRequest = try? request.content.decode(
        UserToken.Singular.Input.Insertion.self
    ) else {
      return Response(status: .badRequest)
    }

    guard let username = request.headers.basicAuthorization?.username,
          let password = request.headers.basicAuthorization?.password else {
      return Response(status: .unauthorized)
    }
    
    do {
      let token = try await userTokenService.signUserToken(
        username: username,
        password: password,
        on: request.db
      ) { token in
        try await request.jwt.sign(token)
      }

      return Response(
        status: .created,
        headers: .init([(
          "Set-Cookie",
          "\(CoreCloudServer.COOKIE_NAME)=\(token); " +
          "Path=/; " +
          "HttpOnly; " + (
            insertRequest.rememberMe
              ? "Max-Age=\(CoreCloudServer.COOKIE_MAX_AGE); "
              : ""
          ) + (
            request.application.environment == .production
              ? "SameSite=Lax; Secure; "
              : ""
          )
        )])
      )
    } catch UserError.noSuchUser {
      return Response(status: .unauthorized)
    } catch UserError.invalidCredentials {
      return Response(status: .unauthorized)
    } catch UserTokenError.databaseError {
      return Response(status: .serviceUnavailable)
    } catch UserTokenError.jwtError {
      return Response(status: .serviceUnavailable)
    } catch {
      return Response(status: .internalServerError)
    }
  }
}
