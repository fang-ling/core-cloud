//
//  HomeVideoServiceTests.swift
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
import Fluent
import Testing
import VaporTesting

extension ServiceTests {
  @Suite("HomeVideoServiceTests")
  struct HomeVideoServiceTests {
    @Test
    func testAddHomeVideo() async throws {
      let homeVideoService = HomeVideoService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: HomeVideoError.databaseError) {
          try await homeVideoService.addHomeVideo(
            title: "test",
            cast: "Alice",
            director: "Lorna",
            genre: "Vlog",
            tags: "",
            date: Date(),
            duration: 19358,
            artworkURLs: "https://example.com/1.png",
            width: 1920,
            height: 1080,
            isHDR: false,
            videoCodec: "H.264",
            audioCodec: "ALAC",
            with: 1,
            for: 1,
            on: app.db
          )
        }

        let eva = User(
          firstName: "Eva",
          lastName: "Chan",
          username: "eva@example.com",
          key: Data(),
          salt: Data(),
          masterKeySealedBox: Data(),
          masterKeySealedBoxSalt: Data(),
          avatarURLs: "https://example.com/1.png"
        )
        try await eva.save(on: app.db)

        await #expect(throws: HomeVideoError.databaseError) {
          try await homeVideoService.addHomeVideo(
            title: "test",
            cast: "Alice",
            director: "Lorna",
            genre: "Vlog",
            tags: "",
            date: Date(),
            duration: 19358,
            artworkURLs: "https://example.com/1.png",
            width: 1920,
            height: 1080,
            isHDR: false,
            videoCodec: "H.264",
            audioCodec: "ALAC",
            with: 1,
            for: eva.requireID(),
            on: app.db
          )
        }

        let location = try Location(
          name: "Tank",
          path: "/mnt/tank1",
          userID: eva.requireID()
        )
        try await location.save(on: app.db)

        let file = try File(
          name: "test",
          kind: "MPEG-4 Movie",
          size: 123,
          checksum: Data(),
          application: "TV",
          decryptionKeySealedBox: Data(),
          locationID: 1,
          userID: eva.requireID()
        )
        try await file.save(on: app.db)

        try await homeVideoService.addHomeVideo(
          title: "test",
          cast: "Alice",
          director: "Lorna",
          genre: "Vlog",
          tags: "",
          date: Date(timeIntervalSince1970: 19342),
          duration: 19358,
          artworkURLs: "https://example.com/1.png",
          width: 1920,
          height: 1080,
          isHDR: false,
          videoCodec: "H.264",
          audioCodec: "ALAC",
          with: file.requireID(),
          for: eva.requireID(),
          on: app.db
        )
        let homeVideo = try await HomeVideo.query(on: app.db).first()
        #expect(homeVideo?.title == "test")
        #expect(homeVideo?.cast == "Alice")
        #expect(homeVideo?.director == "Lorna")
        #expect(homeVideo?.genre == "Vlog")
        #expect(homeVideo?.date == Date(timeIntervalSince1970: 19342))
        #expect(homeVideo?.duration == 19358)
        #expect(homeVideo?.artworkURLs == "https://example.com/1.png")
        #expect(homeVideo?.width == 1920)
        #expect(homeVideo?.height == 1080)
        #expect(homeVideo?.isHDR == false)
        #expect(homeVideo?.videoCodec == "H.264")
        #expect(homeVideo?.audioCodec == "ALAC")

        await #expect(throws: HomeVideoError.databaseError) {
          try await homeVideoService.addHomeVideo(
            title: "test",
            cast: "Alice",
            director: "Lorna",
            genre: "Vlog",
            tags: "",
            date: Date(timeIntervalSince1970: 19342),
            duration: 19358,
            artworkURLs: "https://example.com/1.png",
            width: 1920,
            height: 1080,
            isHDR: false,
            videoCodec: "H.264",
            audioCodec: "ALAC",
            with: file.requireID(),
            for: eva.requireID(),
            on: app.db
          )
        }
      }
    }

    @Test
    func testGetHomeVideos() async throws {
      let homeVideoService = HomeVideoService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        var homeVideos = try await homeVideoService.getHomeVideos(
          fields: [],
          filters: [],
          for: 1,
          on: app.db
        )
        #expect(homeVideos.isEmpty)

        let eva = User(
          firstName: "Eva",
          lastName: "Chan",
          username: "eva@example.com",
          key: Data(),
          salt: Data(),
          masterKeySealedBox: Data(),
          masterKeySealedBoxSalt: Data(),
          avatarURLs: "https://example.com/1.png"
        )
        try await eva.save(on: app.db)

        homeVideos = try await homeVideoService.getHomeVideos(
          fields: [],
          filters: [],
          for: eva.requireID(),
          on: app.db
        )
        #expect(homeVideos.isEmpty)

        let location = try Location(
          name: "Tank",
          path: "/mnt/tank1",
          userID: eva.requireID()
        )
        try await location.save(on: app.db)

        let file = try File(
          name: "test",
          kind: "MPEG-4 Movie",
          size: 123,
          checksum: Data(),
          application: "TV",
          decryptionKeySealedBox: Data(),
          locationID: 1,
          userID: eva.requireID()
        )
        try await file.save(on: app.db)

        try await homeVideoService.addHomeVideo(
          title: "test",
          cast: "Alice",
          director: "Lorna",
          genre: "Vlog",
          tags: "",
          date: Date(timeIntervalSince1970: 19342),
          duration: 19358,
          artworkURLs: "https://example.com/1.png",
          width: 1920,
          height: 1080,
          isHDR: false,
          videoCodec: "H.264",
          audioCodec: "ALAC",
          with: file.requireID(),
          for: eva.requireID(),
          on: app.db
        )

        homeVideos = try await homeVideoService.getHomeVideos(
          fields: [],
          filters: [],
          for: eva.requireID(),
          on: app.db
        )
        #expect(!homeVideos.isEmpty)
        #expect(homeVideos.first?.id == 1)
        #expect(homeVideos.first?.title == nil)

        homeVideos = try await homeVideoService.getHomeVideos(
          fields: ["artworkURLs"],
          filters: [],
          for: eva.requireID(),
          on: app.db
        )
        #expect(!homeVideos.isEmpty)
        #expect(homeVideos.first?.id == 1)
        #expect(homeVideos.first?.artworkURLs == "https://example.com/1.png")
      }
    }

    @Test
    func testGetHomeVideo() async throws {
      let homeVideoService = HomeVideoService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: HomeVideoError.noSuchHomeVideo) {
          try await homeVideoService.getHomeVideo(
            with: 1,
            fields: ["cast"],
            for: 1,
            on: app.db
          )
        }

        let eva = User(
          firstName: "Eva",
          lastName: "Chan",
          username: "eva@example.com",
          key: Data(),
          salt: Data(),
          masterKeySealedBox: Data(),
          masterKeySealedBoxSalt: Data(),
          avatarURLs: "https://example.com/1.png"
        )
        try await eva.save(on: app.db)

        await #expect(throws: HomeVideoError.noSuchHomeVideo) {
          try await homeVideoService.getHomeVideo(
            with: 1,
            fields: ["cast"],
            for: eva.requireID(),
            on: app.db
          )
        }

        let location = try Location(
          name: "Tank",
          path: "/mnt/tank1",
          userID: eva.requireID()
        )
        try await location.save(on: app.db)

        let file = try File(
          name: "test",
          kind: "MPEG-4 Movie",
          size: 123,
          checksum: Data(),
          application: "TV",
          decryptionKeySealedBox: Data(),
          locationID: 1,
          userID: eva.requireID()
        )
        try await file.save(on: app.db)

        let homeVideo = try HomeVideo(
          title: "test",
          cast: "Alice",
          director: "Lorna",
          genre: "Vlog",
          tags: "",
          date: Date(timeIntervalSince1970: 19342),
          duration: 19358,
          artworkURLs: "https://example.com/1.png",
          width: 1920,
          height: 1080,
          isHDR: false,
          videoCodec: "H.264",
          audioCodec: "ALAC",
          fileID: file.requireID(),
          userID: eva.requireID()
        )
        try await homeVideo.save(on: app.db)

        let homeVideoDetail = try await homeVideoService.getHomeVideo(
          with: homeVideo.requireID(),
          fields: ["cast", "videoCodec"],
          for: eva.requireID(),
          on: app.db
        )
        #expect(homeVideoDetail.cast == "Alice")
        #expect(homeVideoDetail.videoCodec == "H.264")
        #expect(homeVideoDetail.director == nil)

        let alice = User(
          firstName: "Alice",
          lastName: "Ou",
          username: "alice@example.com",
          key: Data(),
          salt: Data(),
          masterKeySealedBox: Data(),
          masterKeySealedBoxSalt: Data(),
          avatarURLs: "https://example.com/1.png"
        )
        try await alice.save(on: app.db)

        await #expect(throws: HomeVideoError.noSuchHomeVideo) {
          try await homeVideoService.getHomeVideo(
            with: homeVideo.requireID(),
            fields: ["cast"],
            for: alice.requireID(),
            on: app.db
          )
        }
      }
    }
  }
}
