//
//  DiskControllerTests.swift
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

@testable import CoreCloudServer
import Testing
import VaporTesting

@Test("DiskControllerTests")
func testDiskController() async throws {
  try await withApp(configure: CoreCloudServer.configure) { app in
    try await app.testing().test(
      .GET,
      "api/v1/disks",
      afterResponse: { response async throws in
        #expect(response.status == .unauthorized)
      }
    )

    try await app.testing().test(
      .POST,
      "api/v1/user",
      beforeRequest: { request async throws in
        try request.content.encode(
          User.Singular.Input.Insertion(
            firstName: "Tracy",
            lastName: "Tang",
            username: "tracy@example.com",
            password: "19342Top-Secret",
            masterPassword: "Top--1-Secret"
          )
        )
      },
      afterResponse: { response async throws in
        #expect(response.status == .created)
      }
    )

    var cookie: HTTPCookies.Value?
    try await app.testing().test(
      .POST,
      "api/v1/user-token",
      beforeRequest: { request async throws in
        request.headers.basicAuthorization = .init(
          username: "tracy@example.com",
          password: "19342Top-Secret"
        )
        try request.content.encode(
          UserToken.Singular.Input.Insertion(rememberMe: false)
        )
      },
      afterResponse: { response async throws in
        #expect(response.status == .created)

        cookie = response
          .headers
          .setCookie?
          .all[CoreCloudServer.COOKIE_NAME]
        #expect(cookie?.string != nil)
        #expect(cookie?.path == "/")
        #expect(cookie?.maxAge == nil)
        #expect(cookie?.isHTTPOnly == true)
      }
    )

    try await app.testing().test(
      .GET,
      "api/v1/disks",
      beforeRequest: { request async throws in
        request.headers.cookie = .init(
          dictionaryLiteral: (
            CoreCloudServer.COOKIE_NAME,
            cookie!
          )
        )
      },
      afterResponse: { response async throws in
        #expect(response.status == .ok)
        let disks = try response.content.decode(
          [Disk.Plural.Output.Retrieval].self
        )
        #expect(disks.count == 2)
      }
    )
  }
}
