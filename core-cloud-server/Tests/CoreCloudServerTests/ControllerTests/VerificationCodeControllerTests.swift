//
//  VerificationCodeControllerTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/15.
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

extension VerificationCode.Singular.Input.Insertion: Content { }

extension ControllerTests {
  @Test("VerificationCodeControllerTests")
  func testVerificationCodeController() async throws {
    try await withApp(configure: CoreCloudServer.configure) { app in
      try await app.testing().test(
        .POST,
        "api/verification-code",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .GET,
        "api/verification-code",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .POST,
        "api/user",
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
        "api/user-token",
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
            .all[CoreCloudServer.Cookie.Keys.jwt]
          #expect(cookie?.string != nil)
          #expect(cookie?.path == "/")
          #expect(cookie?.maxAge == nil)
          #expect(cookie?.isHTTPOnly == true)
        }
      )

      try await app.testing().test(
        .POST,
        "api/verification-code",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .GET,
        "api/verification-code",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      var token: HTTPCookies.Value?
      try await app.testing().test(
        .POST,
        "api/application-token",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          try request.content.encode(
            ApplicationToken.Singular.Input.Insertion(
              masterPassword: "Top--1-Secret"
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)

          token = response
            .headers
            .setCookie?
            .all[CoreCloudServer.Cookie.Keys.applicationToken]
          #expect(cookie?.string != nil)
          #expect(cookie?.path == "/")
          #expect(cookie?.maxAge == nil)
          #expect(cookie?.isHTTPOnly == true)
        }
      )

      try await app.testing().test(
        .POST,
        "api/verification-code",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            ), (
              CoreCloudServer.Cookie.Keys.applicationToken,
              token!
            )
          )
          try request.content.encode(
            VerificationCode.Singular.Input.Insertion(
              base32EncodedSecret: "JBSWY3DPEHPK3PXP",
              digest: "sha1",
              digits: 10,
              interval: 28,
              passwordID: 1
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .POST,
        "api/verification-code",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            ), (
              CoreCloudServer.Cookie.Keys.applicationToken,
              token!
            )
          )
          try request.content.encode(
            VerificationCode.Singular.Input.Insertion(
              base32EncodedSecret: "JBSWY3DPEHPK3PXP",
              digest: "sha1",
              digits: 6,
              interval: 28,
              passwordID: 1
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .POST,
        "api/verification-code",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            ), (
              CoreCloudServer.Cookie.Keys.applicationToken,
              token!
            )
          )
          try request.content.encode(
            VerificationCode.Singular.Input.Insertion(
              base32EncodedSecret: "JBSWY3DPEHPK3PXP",
              digest: "sha1",
              digits: 6,
              interval: 30,
              passwordID: 1
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .serviceUnavailable)
        }
      )

      try await app.testing().test(
        .POST,
        "api/password",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            ), (
              CoreCloudServer.Cookie.Keys.applicationToken,
              token!
            )
          )
          try request.content.encode(
            Password.Singular.Input.Insertion(
              label: "example.com",
              username: "Alice",
              key: "1234567890",
              notes: "Test"
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .POST,
        "api/verification-code",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            ), (
              CoreCloudServer.Cookie.Keys.applicationToken,
              token!
            )
          )
          try request.content.encode(
            VerificationCode.Singular.Input.Insertion(
              base32EncodedSecret: "JBSWY3DPEHPK3PXP",
              digest: "sha1",
              digits: 6,
              interval: 30,
              passwordID: 1
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .POST,
        "api/verification-code",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            ), (
              CoreCloudServer.Cookie.Keys.applicationToken,
              token!
            )
          )
          try request.content.encode(
            VerificationCode.Singular.Input.Insertion(
              base32EncodedSecret: "JBSWY3DPEHPK3PXP",
              digest: "sha1",
              digits: 6,
              interval: 30,
              passwordID: 1
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .serviceUnavailable)
        }
      )

      try await app.testing().test(
        .GET,
        "api/verification-code?id=2",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            ), (
              CoreCloudServer.Cookie.Keys.applicationToken,
              token!
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .notFound)
        }
      )

      try await app.testing().test(
        .GET,
        "api/verification-code?id=1",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            ), (
              CoreCloudServer.Cookie.Keys.applicationToken,
              token!
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .ok)

          let verificationCode = try response.content.decode(
            VerificationCode.Singular.Output.Retrieval.self
          )
          #expect(verificationCode.verificationCode.count == 6)
        }
      )
    }
  }
}
