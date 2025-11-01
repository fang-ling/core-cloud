//
//  EpisodeControllerTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/1.
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

extension Episode.Singular.Input.Insertion: Content { }

extension ControllerTests {
  @Test("EpisodeControllerTests")
  func testEpisodeController() async throws {
    try await withApp(configure: CoreCloudServer.configure) { app in
      try? FileManager.default.removeItem(atPath: "/tmp/e-controller-test")

      try await app.testing().test(
        .POST,
        "api/episode",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .GET,
        "api/episodes",
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
            .all[CoreCloudServer.cookieName]
          #expect(cookie?.string != nil)
          #expect(cookie?.path == "/")
          #expect(cookie?.maxAge == nil)
          #expect(cookie?.isHTTPOnly == true)
        }
      )

      try await app.testing().test(
        .POST,
        "api/episode",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.cookieName,
              cookie!
            )
          )
          try request.content.encode(
            Episode.Singular.Input.Insertion(
              title: "1:23:45",
              artworkURLs: "https://exmaple.com/1-1.png",
              description: "April 26, 1986, USSR. An early-morning...",
              date: 1761961321000,
              episodeNumber: 1,
              seasonNumber: 1,
              duration: 3600,
              width: 1920,
              height: 1080,
              isHDR: false,
              videoCodec: "H.264",
              audioCodec: "ALAC",
              fileID: 1,
              tvShowID: 1
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .GET,
        "api/episodes?fields=title&filters=episodeID_EQUALS_1",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.cookieName,
              cookie!
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .ok)

          let episodes = try response.content.decode(
            [Episode.Plural.Output.Retrieval].self
          )
          #expect(episodes.isEmpty)
        }
      )

      try await app.testing().test(
        .POST,
        "api/location",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.cookieName,
              cookie!
            )
          )
          try request.content.encode(
            Location.Singular.Input.Insertion(
              name: "Tank2",
              path: "/tmp/e-controller-test"
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      var token: HTTPCookies.Value?
      try await app.testing().test(
        .POST,
        "api/application-token",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.cookieName,
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
            .all[CoreCloudServer.applicationTokenCookieName]
          #expect(cookie?.string != nil)
          #expect(cookie?.path == "/")
          #expect(cookie?.maxAge == nil)
          #expect(cookie?.isHTTPOnly == true)
        }
      )

      let twoBytes = Data([UInt8].random(count: 2))
      let twoByteSHA512 = Data(SHA512.hash(data: twoBytes))
        .base64EncodedString()
        .addingPercentEncoding(withAllowedCharacters: .alphanumerics)!

      try await app.testing().test(
        .POST,
        "api/file" +
        "?name=byte" +
        "&kind=JPEG%20Image" +
        "&size=2" +
        "&checksum=\(twoByteSHA512)" +
        "&application=Music" +
        "&locationID=1",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.cookieName,
              cookie!
            ), (
              CoreCloudServer.applicationTokenCookieName,
              token!
            )
          )
          request.body = .init(data: twoBytes)
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .POST,
        "api/episode",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.cookieName,
              cookie!
            )
          )
          try request.content.encode(
            Episode.Singular.Input.Insertion(
              title: "1:23:45",
              artworkURLs: "https://exmaple.com/1-1.png",
              description: "April 26, 1986, USSR. An early-morning...",
              date: 1761961321000,
              episodeNumber: 1,
              seasonNumber: 1,
              duration: 3600,
              width: 1920,
              height: 1080,
              isHDR: false,
              videoCodec: "H.264",
              audioCodec: "ALAC",
              fileID: 1,
              tvShowID: 1
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      let sixBytes = Data([UInt8].random(count: 6))
      let sixByteSHA512 = Data(SHA512.hash(data: sixBytes))
        .base64EncodedString()
        .addingPercentEncoding(withAllowedCharacters: .alphanumerics)!

      try await app.testing().test(
        .POST,
        "api/file" +
        "?name=byte" +
        "&kind=MPEG-4%20Movie" +
        "&size=6" +
        "&checksum=\(sixByteSHA512)" +
        "&application=Photos" +
        "&locationID=1",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.cookieName,
              cookie!
            ), (
              CoreCloudServer.applicationTokenCookieName,
              token!
            )
          )
          request.body = .init(data: sixBytes)
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .POST,
        "api/episode",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.cookieName,
              cookie!
            )
          )
          try request.content.encode(
            Episode.Singular.Input.Insertion(
              title: "1:23:45",
              artworkURLs: "https://exmaple.com/1-1.png",
              description: "April 26, 1986, USSR. An early-morning...",
              date: 1761961321000,
              episodeNumber: 1,
              seasonNumber: 1,
              duration: 3600,
              width: 1920,
              height: 1080,
              isHDR: false,
              videoCodec: "H.264",
              audioCodec: "ALAC",
              fileID: 2,
              tvShowID: 1
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      let tenBytes = Data([UInt8].random(count: 10))
      let tenByteSHA512 = Data(SHA512.hash(data: tenBytes))
        .base64EncodedString()
        .addingPercentEncoding(withAllowedCharacters: .alphanumerics)!

      try await app.testing().test(
        .POST,
        "api/file" +
        "?name=byte" +
        "&kind=MPEG-4%20Movie" +
        "&size=10" +
        "&checksum=\(tenByteSHA512)" +
        "&application=TV" +
        "&locationID=1",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.cookieName,
              cookie!
            ), (
              CoreCloudServer.applicationTokenCookieName,
              token!
            )
          )
          request.body = .init(data: tenBytes)
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .POST,
        "api/episode",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.cookieName,
              cookie!
            )
          )
          try request.content.encode(
            Episode.Singular.Input.Insertion(
              title: "1:23:45",
              artworkURLs: "https://exmaple.com/1-1.png",
              description: "April 26, 1986, USSR. An early-morning...",
              date: 1761961321000,
              episodeNumber: 1,
              seasonNumber: 1,
              duration: 3600,
              width: 1920,
              height: 1080,
              isHDR: false,
              videoCodec: "H.264",
              audioCodec: "ALAC",
              fileID: 3,
              tvShowID: 1
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .serviceUnavailable)
        }
      )

      try await app.testing().test(
        .POST,
        "api/tv-show",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.cookieName,
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
        .POST,
        "api/episode",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.cookieName,
              cookie!
            )
          )
          try request.content.encode(
            Episode.Singular.Input.Insertion(
              title: "1:23:45",
              artworkURLs: "https://exmaple.com/1-1.png",
              description: "April 26, 1986, USSR. An early-morning...",
              date: 1761961321000,
              episodeNumber: 1,
              seasonNumber: 1,
              duration: 3600,
              width: 1920,
              height: 1080,
              isHDR: false,
              videoCodec: "H.264",
              audioCodec: "ALAC",
              fileID: 3,
              tvShowID: 1
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .POST,
        "api/episode",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.cookieName,
              cookie!
            )
          )
          try request.content.encode(
            Episode.Singular.Input.Insertion(
              title: "1:23:45",
              artworkURLs: "https://exmaple.com/1-1.png",
              description: "April 26, 1986, USSR. An early-morning...",
              date: 1761961321000,
              episodeNumber: 1,
              seasonNumber: 1,
              duration: 3600,
              width: 1920,
              height: 1080,
              isHDR: false,
              videoCodec: "H.264",
              audioCodec: "ALAC",
              fileID: 3,
              tvShowID: 1
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .serviceUnavailable)
        }
      )

      try await app.testing().test(
        .GET,
        "api/episodes?fields=title,fileID,date&filters=episodeID_EQUALS_1",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.cookieName,
              cookie!
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .ok)

          let episodes = try response.content.decode(
            [Episode.Plural.Output.Retrieval].self
          )
          #expect(episodes.count == 1)
          #expect(episodes.first?.id == 1)
          #expect(episodes.first?.title == "1:23:45")
          #expect(episodes.first?.date == 1761961321000)
          #expect(episodes.first?.description == nil)
        }
      )

      try await app.testing().test(
        .GET,
        "api/episodes?fields=title,fileID&filters=episodeID_EQUALS_2",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.cookieName,
              cookie!
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .ok)

          let episodes = try response.content.decode(
            [Episode.Plural.Output.Retrieval].self
          )
          #expect(episodes.isEmpty)
        }
      )
    }
  }
}
