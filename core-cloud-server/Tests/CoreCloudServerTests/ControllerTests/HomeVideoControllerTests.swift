//
//  HomeVideoControllerTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/10/5.
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

extension HomeVideo.Singular.Input.Insertion: Content { }

extension ControllerTests {
  @Test("HomeVideoControllerTests")
  func testHomeVideoController() async throws {
    try await withApp(configure: CoreCloudServer.configure) { app in
      try? FileManager.default.removeItem(atPath: "/tmp/h-v-controller-test")

      try await app.testing().test(
        .POST,
        "api/home-video",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .GET,
        "api/home-videos",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .GET,
        "api/home-video",
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
        "api/home-video",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            )
          )
          try request.content.encode(
            HomeVideo.Singular.Input.Insertion(
              title: "test",
              cast: "Alice",
              director: "Lorna",
              genre: "Vlog",
              tags: "",
              date: 19358,
              duration: 19342,
              artworkURLs: "https://example.com/1.png",
              width: 1920,
              height: 1080,
              isHDR: false,
              videoCodec: "H.264",
              audioCodec: "ALAC",
              fileID: 1
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .GET,
        "api/home-videos?fields=title",
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

          let songs = try response.content.decode(
            [HomeVideo.Plural.Output.Retrieval].self
          )
          #expect(songs.isEmpty)
        }
      )

      try await app.testing().test(
        .POST,
        "api/location",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            )
          )
          try request.content.encode(
            Location.Singular.Input.Insertion(
              name: "Tank2",
              path: "/tmp/h-v-controller-test"
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
              CoreCloudServer.COOKIE_NAME,
              cookie!
            ), (
              CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME,
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
        "api/home-video",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            )
          )
          try request.content.encode(
            HomeVideo.Singular.Input.Insertion(
              title: "test",
              cast: "Alice",
              director: "Lorna",
              genre: "Vlog",
              tags: "",
              date: 19358,
              duration: 19342,
              artworkURLs: "https://example.com/1.png",
              width: 1920,
              height: 1080,
              isHDR: false,
              videoCodec: "H.264",
              audioCodec: "ALAC",
              fileID: 1
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
              CoreCloudServer.COOKIE_NAME,
              cookie!
            ), (
              CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME,
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
        "api/home-video",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            )
          )
          try request.content.encode(
            HomeVideo.Singular.Input.Insertion(
              title: "test",
              cast: "Alice",
              director: "Lorna",
              genre: "Vlog",
              tags: "",
              date: 19358,
              duration: 19342,
              artworkURLs: "https://example.com/1.png",
              width: 1920,
              height: 1080,
              isHDR: false,
              videoCodec: "H.264",
              audioCodec: "ALAC",
              fileID: 2
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
              CoreCloudServer.COOKIE_NAME,
              cookie!
            ), (
              CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME,
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
        "api/home-video",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            )
          )
          try request.content.encode(
            HomeVideo.Singular.Input.Insertion(
              title: "test",
              cast: "Alice",
              director: "Lorna",
              genre: "Vlog",
              tags: "",
              date: 19358,
              duration: 19342,
              artworkURLs: "https://example.com/1.png",
              width: 1920,
              height: 1080,
              isHDR: false,
              videoCodec: "H.264",
              audioCodec: "ALAC",
              fileID: 3
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .POST,
        "api/home-video",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.COOKIE_NAME,
              cookie!
            )
          )
          try request.content.encode(
            HomeVideo.Singular.Input.Insertion(
              title: "test",
              cast: "Alice",
              director: "Lorna",
              genre: "Vlog",
              tags: "",
              date: 19358,
              duration: 19342,
              artworkURLs: "https://example.com/1.png",
              width: 1920,
              height: 1080,
              isHDR: false,
              videoCodec: "H.264",
              audioCodec: "ALAC",
              fileID: 3
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .serviceUnavailable)
        }
      )

      try await app.testing().test(
        .GET,
        "api/home-videos?fields=title,fileID",
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

          let homeVideos = try response.content.decode(
            [HomeVideo.Plural.Output.Retrieval].self
          )
          #expect(homeVideos.count == 1)
          #expect(homeVideos.first?.id == 1)
          #expect(homeVideos.first?.title == "test")
          #expect(homeVideos.first?.fileID == 3)
        }
      )

      try await app.testing().test(
        .GET,
        "api/home-video?fields=cast,audioCodec&id=1",
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

          let homeVideo = try response.content.decode(
            HomeVideo.Singular.Output.Retrieval.self
          )
          #expect(homeVideo.cast == "Alice")
          #expect(homeVideo.audioCodec == "ALAC")
          #expect(homeVideo.videoCodec == nil)
        }
      )
    }
  }
}
