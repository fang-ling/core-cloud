//
//  AuthenticatorMiddleware.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/10/31.
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

struct AuthenticatorMiddleware: AsyncMiddleware {
  let userTokenService = UserTokenService()

  func respond(
    to request: Vapor.Request,
    chainingTo next: any Vapor.AsyncResponder
  ) async throws -> Vapor.Response {
    do {
      let jwt = request.cookies.all[CoreCloudServer.cookieName]?.string
      let id = try await userTokenService.verifyUserToken(
        from: jwt ?? ""
      ) { token in
        try await request.jwt.verify(token)
      }
      request.userID = id
    } catch {
      return Response(status: .unauthorized)
    }

    return try await next.respond(to: request)
  }
}

private struct UserIDStorageKey: StorageKey {
  typealias Value = User.IDValue
}

/* Convenience accessors for user's id. */
extension Request {
  var userID: User.IDValue? {
    get {
      storage[UserIDStorageKey.self]
    }
    set {
      storage[UserIDStorageKey.self] = newValue
    }
  }
}
