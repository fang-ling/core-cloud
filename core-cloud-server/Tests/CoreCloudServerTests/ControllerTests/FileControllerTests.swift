//
//  FileControllerTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/23.
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
import Crypto
import Testing
import VaporTesting

extension ControllerTests {
  @Test("FileControllerTests")
  func testFileController() async throws {
    try await withApp(configure: CoreCloudServer.configure) { app in
      try FileManager.default.removeItem(atPath: "/tmp/tank1")

      try await app.testing().test(
        .POST,
        "api/v1/file",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .GET,
        "api/v1/file",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .GET,
        "api/v1/files",
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
        .POST,
        "api/v1/file",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
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
        "api/v1/file",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
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
        "api/v1/application-token",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
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
            .all[CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME]
          #expect(cookie?.string != nil)
          #expect(cookie?.path == "/")
          #expect(cookie?.maxAge == nil)
          #expect(cookie?.isHTTPOnly == true)
        }
      )

      try await app.testing().test(
        .POST,
        "api/v1/location",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            )
          )
          try request.content.encode(
            Location.Singular.Input.Insertion(
              name: "Tank",
              path: "/tmp/tank1"
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      let byte = Data([UInt8].random(count: 1))
      let byteSHA512 = Data(SHA512.hash(data: byte))
        .base64EncodedString()
        .addingPercentEncoding(withAllowedCharacters: .alphanumerics)!

      let fourMiB = Data([UInt8].random(count: 4 * 1024 * 1024))
      let fourMiBSHA512 = Data(SHA512.hash(data: fourMiB))
        .base64EncodedString()
        .addingPercentEncoding(withAllowedCharacters: .alphanumerics)!

      let sixMiB = Data([UInt8].random(count: 6 * 1024 * 1024))
      let sixMiBSHA512 = Data(SHA512.hash(data: sixMiB))
        .base64EncodedString()
        .addingPercentEncoding(withAllowedCharacters: .alphanumerics)!

      let tenMiB = Data([UInt8].random(count: 10 * 1024 * 1024))
      let tenMiBSHA512 = Data(SHA512.hash(data: tenMiB))
        .base64EncodedString()
        .addingPercentEncoding(withAllowedCharacters: .alphanumerics)!

      try await app.testing().test(
        .POST,
        "api/v1/file" +
        "?name=byte" +
        "&kind=Apple%20MPEG-4%20Audio" +
        "&size=1" +
        "&checksum=\(byteSHA512)" +
        "&application=Music" +
        "&locationID=1",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            ), (
              CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME,
              token!
            )
          )
          request.body = .init(data: byte)
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .POST,
        "api/v1/file" +
        "?name=fourMiB" +
        "&kind=Apple%20MPEG-4%20Audio" +
        "&size=4194304" +
        "&checksum=\(fourMiBSHA512)" +
        "&application=Music" +
        "&locationID=1",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            ), (
              CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME,
              token!
            )
          )
          request.body = .init(data: fourMiB)
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .POST,
        "api/v1/file" +
        "?name=sixMiB" +
        "&kind=Apple%20MPEG-4%20Audio" +
        "&size=6291456" +
        "&checksum=\(sixMiBSHA512)" +
        "&application=Music" +
        "&locationID=1",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            ), (
              CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME,
              token!
            )
          )
          request.body = .init(data: sixMiB)
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .POST,
        "api/v1/file" +
        "?name=tenMiB" +
        "&kind=Apple%20MPEG-4%20Audio" +
        "&size=6291456" +
        "&checksum=\(tenMiBSHA512)" +
        "&application=Music" +
        "&locationID=1",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            ), (
              CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME,
              token!
            )
          )
          request.body = .init(data: tenMiB)
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .POST,
        "api/v1/file" +
        "?name=tenMiB" +
        "&kind=Apple%20MPEG-4%20Audio" +
        "&size=10485760" +
        "&checksum=asjkmc_" +
        "&application=Music" +
        "&locationID=1",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            ), (
              CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME,
              token!
            )
          )
          request.body = .init(data: tenMiB)
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .POST,
        "api/v1/file" +
        "?name=sixMiB" +
        "&kind=Apple%20MPEG-4%20Audio" +
        "&size=6291456" +
        "&checksum=\(sixMiBSHA512)" +
        "&application=Music" +
        "&locationID=1",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            ), (
              CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME,
              token!
            )
          )
          request.body = .init(data: sixMiB)
        },
        afterResponse: { response async throws in
          /* Conflict */
          #expect(response.status == .serviceUnavailable)
        }
      )

      try await app.testing().test(
        .GET,
        "api/v1/file" +
        "?id=3" +
        "&application=Music",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            ), (
              CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME,
              token!
            )
          )
          request.headers.range = .init(
            unit: .bytes,
            ranges: [.within(start: 48, end: 4194332 + 58)]
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .partialContent)
          var body = response.body
          let data = body.readData(length: body.readableBytes)
          #expect(data == sixMiB[48 ... (4194332 + 58)])
        }
      )
    }
  }
}
