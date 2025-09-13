//
//  AlbumControllerTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/9/13.
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

extension Album.Singular.Input.Insertion: Content { }

extension ControllerTests {
  @Test("AlbumControllerTests")
  func testAlbumController() async throws {
    try await withApp(configure: CoreCloudServer.configure) { app in
      try await app.testing().test(
        .POST,
        "api/album",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .GET,
        "api/albums",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .GET,
        "api/album",
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
            .all[CoreCloudServer.COOKIE_NAME]
          #expect(cookie?.string != nil)
          #expect(cookie?.path == "/")
          #expect(cookie?.maxAge == nil)
          #expect(cookie?.isHTTPOnly == true)
        }
      )

      try await app.testing().test(
        .POST,
        "api/album",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            )
          )

          try request.content.encode(
            Album.Singular.Input.Insertion(
              name: "1996",
              artist: "Ryuichi Sakamoto",
              genre: "Chamber music",
              year: 1996,
              artworkURLs: "https://example.com/1.png"
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .GET,
        "api/albums",
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

          let albums = try response.content.decode(
            [Album.Plural.Output.Retrieval].self
          )
          #expect(albums.count == 1)
          #expect(albums.first?.id == 1)
          #expect(albums.first?.name == "1996")
          #expect(albums.first?.artist == "Ryuichi Sakamoto")
          #expect(albums.first?.artworkURLs == "https://example.com/1.png")
        }
      )

      try await app.testing().test(
        .GET,
        "api/album?id=1",
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

          let album = try response.content.decode(
            Album.Singular.Output.Retrieval.self
          )
          #expect(album.genre == "Chamber music")
          #expect(album.year == 1996)
        }
      )

      try await app.testing().test(
        .POST,
        "api/user",
        beforeRequest: { request async throws in
          try request.content.encode(
            User.Singular.Input.Insertion(
              firstName: "Alice",
              lastName: "Ou",
              username: "alice@example.com",
              password: "12333Top-Secret",
              masterPassword: "Top--1-Secret"
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .POST,
        "api/user-token",
        beforeRequest: { request async throws in
          request.headers.basicAuthorization = .init(
            username: "alice@example.com",
            password: "12333Top-Secret"
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
        "api/albums",
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

          let albums = try response.content.decode(
            [Album.Plural.Output.Retrieval].self
          )
          #expect(albums.isEmpty)
        }
      )
    }
  }
}
