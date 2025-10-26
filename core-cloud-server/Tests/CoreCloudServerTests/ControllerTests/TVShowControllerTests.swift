//
//  TVShowControllerTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/10/19.
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

extension TVShow.Singular.Input.Insertion: Content { }

extension ControllerTests {
  @Test("TVShowControllerTests")
  func testTVShowController() async throws {
    try await withApp(configure: CoreCloudServer.configure) { app in
      try await app.testing().test(
        .POST,
        "api/tv-show",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .GET,
        "api/tv-shows",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .GET,
        "api/tv-show",
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
        "api/tv-show",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            )
          )

          try request.content.encode(
            TVShow.Singular.Input.Insertion(
              title: "Chernobyl",
              starring: "Jared Harris,Stellan Skarsgård,Emily Watson",
              genre: "Drama",
              startYear: 2019,
              endYear: 2019,
              region: "United States,Russia",
              description: (
                "Starring Jared Harris, Stellan Skarsgard and Emily Watson, " +
                #""Chernobyl" tells the story of the 1986 nuclear accident "# +
                "in this HBO Miniseries."
              ),
              posterURLs: "https://example.com/1.png",
              artworkURLs: "https://example.com/2.png",
              titleLogoURLs: "https://example.com/3.png",
              studio: "HBO"
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .GET,
        "api/tv-show?id=1",
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

          let tvShow = try response.content.decode(
            TVShow.Singular.Output.Retrieval.self
          )
          #expect(tvShow.genre == "Drama")
          #expect(tvShow.startYear == 2019)
        }
      )

      try await app.testing().test(
        .GET,
        "api/tv-shows?fields=posterURLs",
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

          let tvShows = try response.content.decode(
            [TVShow.Plural.Output.Retrieval].self
          )
          #expect(tvShows.count == 1)
          #expect(tvShows.first?.posterURLs == "https://example.com/1.png")
        }
      )
    }
  }
}
