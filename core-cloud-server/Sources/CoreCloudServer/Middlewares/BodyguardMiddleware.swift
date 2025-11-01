//
//  BodyguardMiddleware.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/3.
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

struct BodyguardMiddleware: AsyncMiddleware {
  func respond(
    to request: Request,
    chainingTo next: any AsyncResponder
  ) async throws -> Response {
    let token = request.cookies.all[CoreCloudServer.cookieName]?.string

    do {
      try await request.jwt.verify(token ?? "", as: UserToken.self)

      /* If logged in and want to see the authenticator */
      if request.url.path.starts(with: "/authenticator") {
        return request.redirect(to: "/home")
      }
    } catch {
      request.logger.notice("Invalid token: \(error)")
      /* If not logged in and want to see the protected page */
      if (
        request.url.path.starts(with: "/home") ||
        request.url.path.starts(with: "/drive") ||
        request.url.path.starts(with: "/music") ||
        request.url.path.starts(with: "/tv")
      ) {
        return request.redirect(to: "/authenticator/#\(request.url.path)")
      }
    }

    return try await next.respond(to: request)
  }
}
