//
//  DiskController.swift
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

struct DiskController: RouteCollection {
  let diskService = DiskService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("v1")
      .grouped("disks")
      .get(use: fetchDisksHandler)
  }

  /**
   * - URL: GET /api/v1/disks
   *
   * - Response Codes:
   *   - 200 OK: The disks is returned.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   */
  func fetchDisksHandler(request: Request) async -> Response {
    do {
      let jwt = request.headers.cookie?.all[CoreCloudServer.COOKIE_NAME]?.string
      try await request.jwt.verify(jwt ?? "", as: UserToken.self)
    } catch {
      return Response(status: .unauthorized)
    }

    let disks = diskService.getDisks()
    do {
      return try Response(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            disks.map {
              Disk.Plural.Output.Retrieval(path: $0)
            }
          )
        )
      )
    } catch {
      return Response(status: .internalServerError)
    }
  }
}
