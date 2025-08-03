//
//  UserControllerTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/7/30.
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

extension User.Singular.Input.Insertion: Content { }

@Test("UserControllerTests")
func testUserController() async throws {
  try await withApp(configure: CoreCloudServer.configure) { app in
    try await app.testing().test(
      .HEAD,
      "api/v1/user",
      afterResponse: { response async throws in
        #expect(response.status == .badRequest)
      }
    )

    try await app.testing().test(
      .HEAD,
      "api/v1/user?username=tracy%40example.com",
      afterResponse: { response async throws in
        #expect(response.status == .noContent)
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

    try await app.testing().test(
      .HEAD,
      "api/v1/user?username=tracy%40example.com",
      afterResponse: { response async throws in
        #expect(response.status == .ok)
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
        #expect(response.status == .serviceUnavailable)
      }
    )
  }
}
