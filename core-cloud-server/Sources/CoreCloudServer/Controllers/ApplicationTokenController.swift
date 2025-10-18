//
//  ApplicationTokenController.swift
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

struct ApplicationTokenController: RouteCollection {
  let applicationTokenService = ApplicationTokenService()
  let userService = UserService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("application-token")
      .post(use: insertApplicationTokenHandler)

    routes
      .grouped("api")
      .grouped("application-token")
      .on(.HEAD, use: peekApplicationTokenHandler)
  }

  /**
   * - URL: POST /api/application-token
   *
   * - Response Codes:
   *   - 201 Created: The request has been fulfilled, resulting in the creation
   *                  of a new application-token.
   *   - 400 Bad Request: The server cannot or will not process the request due
   *                      to an apparent client error.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func insertApplicationTokenHandler(request: Request) async -> Response {
    let userID: User.IDValue
    do {
      let jwt = request.cookies.all[CoreCloudServer.COOKIE_NAME]?.string
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

    let insertRequest: ApplicationToken.Singular.Input.Insertion
    do {
      insertRequest = try request.content.decode(
        ApplicationToken.Singular.Input.Insertion.self
      )
    } catch {
      return Response(status: .badRequest)
    }

    do {
      let masterKey = try await userService.getUser(
        with: userID,
        masterPassword: insertRequest.masterPassword,
        on: request.db
      )
      let applicationToken = applicationTokenService.createApplicationToken(
        masterKey: masterKey
      )
      let tokenString = applicationToken.withUnsafeBytes {
        Data($0).base64EncodedString()
      }

      return Response(
        status: .created,
        headers: .init([(
          "Set-Cookie",
          "\(CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME)=\(tokenString); " +
          "Path=/; " +
          "HttpOnly; " + (
            request.application.environment == .production
              ? "SameSite=Lax; Secure; "
              : ""
          )
        )])
      )
    } catch UserError.cryptoError {
      return Response(status: .unauthorized)
    } catch UserError.databaseError {
      return Response(status: .serviceUnavailable)
    } catch {
      return Response(status: .internalServerError)
    }
  }

  /**
   * - URL: HEAD /api/application-token
   *
   * - Response Codes:
   *   - 200 OK: The application token exists.
   *   - 204 No Content: The application token does not exist.
   *   - 401 Unauthorized: The authentication is required and has failed.
   */
  func peekApplicationTokenHandler(request: Request) async -> HTTPStatus {
    do {
      let jwt = request.cookies.all[CoreCloudServer.COOKIE_NAME]?.string
      try await request.jwt.verify(jwt ?? "", as: UserToken.self)
    } catch {
      return .unauthorized
    }

    guard let _ = request
      .cookies
      .all[CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME]?
      .string
    else {
      return .noContent
    }

    return .ok
  }
}
