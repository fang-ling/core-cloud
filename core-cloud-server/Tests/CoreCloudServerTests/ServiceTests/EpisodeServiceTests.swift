//
//  EpisodeServiceTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/10/26.
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
  @Suite("EpisodeServiceTests")
  struct EpisodeServiceTests {
    @Test
    func testAddEpisode() async throws {
      let episodeService = EpisodeService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: Episode.Error.databaseError) {
          try await episodeService.addEpisode(
            title: "1:23:45",
            artworkURLs: "https://exmaple.com/1-1.png",
            description: "April 26, 1986, USSR. An early-morning...",
            date: Date(),
            episodeNumber: 1,
            seasonNumber: 1,
            duration: 3600,
            width: 1920,
            height: 1080,
            isHDR: false,
            videoCodec: "H.264",
            audioCodec: "ALAC",
            fileID: 1,
            tvShowID: 1,
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

        await #expect(throws: Episode.Error.databaseError) {
          try await episodeService.addEpisode(
            title: "1:23:45",
            artworkURLs: "https://exmaple.com/1-1.png",
            description: "April 26, 1986, USSR. An early-morning...",
            date: Date(),
            episodeNumber: 1,
            seasonNumber: 1,
            duration: 3600,
            width: 1920,
            height: 1080,
            isHDR: false,
            videoCodec: "H.264",
            audioCodec: "ALAC",
            fileID: 1,
            tvShowID: 1,
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
          name: "1.23.45",
          kind: "MPEG-4 Movie",
          size: 123,
          checksum: Data(),
          application: "TV",
          decryptionKeySealedBox: Data(),
          locationID: location.requireID(),
          userID: eva.requireID()
        )
        try await file.save(on: app.db)

        await #expect(throws: Episode.Error.databaseError) {
          try await episodeService.addEpisode(
            title: "1:23:45",
            artworkURLs: "https://exmaple.com/1-1.png",
            description: "April 26, 1986, USSR. An early-morning...",
            date: Date(),
            episodeNumber: 1,
            seasonNumber: 1,
            duration: 3600,
            width: 1920,
            height: 1080,
            isHDR: false,
            videoCodec: "H.264",
            audioCodec: "ALAC",
            fileID: file.requireID(),
            tvShowID: 1,
            for: eva.requireID(),
            on: app.db
          )
        }

        let tvShow = try TVShow(
          title: "Chernobyl",
          starring: "Jared Harris,Stellan Skarsgård,Emily Watson",
          genre: "Drama",
          startYear: 2019,
          endYear: 2019,
          region: "United States,Russia",
          description: (
            "Starring Jared Harris, Stellan Skarsgard and Emily Watson, " +
            #""Chernobyl" tells the story of the 1986 nuclear accident in "# +
            "this HBO Miniseries."
          ),
          posterURLs: "https://example.com/1.png",
          artworkURLs: "https://example.com/2.png",
          studio: "HBO",
          userID: eva.requireID()
        )
        try await tvShow.save(on: app.db)

        try await episodeService.addEpisode(
          title: "1:23:45",
          artworkURLs: "https://exmaple.com/1-1.png",
          description: "April 26, 1986, USSR...",
          date: Date(),
          episodeNumber: 1,
          seasonNumber: 1,
          duration: 3600,
          width: 1920,
          height: 1080,
          isHDR: false,
          videoCodec: "H.264",
          audioCodec: "ALAC",
          fileID: file.requireID(),
          tvShowID: tvShow.requireID(),
          for: eva.requireID(),
          on: app.db
        )
        let episode = try await Episode.query(on: app.db).first()
        #expect(episode?.title == "1:23:45")
        #expect(episode?.artworkURLs == "https://exmaple.com/1-1.png")
        #expect(episode?.description == "April 26, 1986, USSR...")
        #expect(episode?.episodeNumber == 1)
        #expect(episode?.seasonNumber == 1)
        #expect(episode?.duration == 3600)
        #expect(episode?.width == 1920)
        #expect(episode?.height == 1080)
        #expect(episode?.isHDR == false)
        #expect(episode?.videoCodec == "H.264")
        #expect(episode?.audioCodec == "ALAC")

        await #expect(throws: Episode.Error.databaseError) {
          try await episodeService.addEpisode(
            title: "1:23:45",
            artworkURLs: "https://exmaple.com/1-1.png",
            description: "April 26, 1986, USSR...",
            date: Date(),
            episodeNumber: 1,
            seasonNumber: 1,
            duration: 3600,
            width: 1920,
            height: 1080,
            isHDR: false,
            videoCodec: "H.264",
            audioCodec: "ALAC",
            fileID: file.requireID(),
            tvShowID: tvShow.requireID(),
            for: eva.requireID(),
            on: app.db
          )
        }
      }
    }

    @Test
    func testGetEpisodes() async throws {
      let episodeService = EpisodeService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        var episodes = try await episodeService.getEpisodes(
          for: 1,
          fields: [],
          filters: [],
          on: app.db
        )
        #expect(episodes.isEmpty)

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

        episodes = try await episodeService.getEpisodes(
          for: eva.requireID(),
          fields: [],
          filters: [],
          on: app.db
        )
        #expect(episodes.isEmpty)

        let location = try Location(
          name: "Tank",
          path: "/mnt/tank1",
          userID: eva.requireID()
        )
        try await location.save(on: app.db)

        let file = try File(
          name: "1.23.45",
          kind: "MPEG-4 Movie",
          size: 123,
          checksum: Data(),
          application: "TV",
          decryptionKeySealedBox: Data(),
          locationID: location.requireID(),
          userID: eva.requireID()
        )
        try await file.save(on: app.db)

        let tvShow = try TVShow(
          title: "Chernobyl",
          starring: "Jared Harris,Stellan Skarsgård,Emily Watson",
          genre: "Drama",
          startYear: 2019,
          endYear: 2019,
          region: "United States,Russia",
          description: (
            "Starring Jared Harris, Stellan Skarsgard and Emily Watson, " +
            #""Chernobyl" tells the story of the 1986 nuclear accident in "# +
            "this HBO Miniseries."
          ),
          posterURLs: "https://example.com/1.png",
          artworkURLs: "https://example.com/2.png",
          studio: "HBO",
          userID: eva.requireID()
        )
        try await tvShow.save(on: app.db)

        let episode = try Episode(
          title: "1:23:45",
          artworkURLs: "https://exmaple.com/1-1.png",
          description: "April 26, 1986, USSR. An early-morning...",
          date: Date(),
          episodeNumber: 1,
          seasonNumber: 1,
          duration: 3600,
          width: 1920,
          height: 1080,
          isHDR: false,
          videoCodec: "H.264",
          audioCodec: "ALAC",
          fileID: file.requireID(),
          userID: eva.requireID(),
          tvShowID: tvShow.requireID()
        )
        try await episode.save(on: app.db)

        episodes = try await episodeService.getEpisodes(
          for: eva.requireID(),
          fields: [],
          filters: [],
          on: app.db
        )
        #expect(episodes.count == 1)
        #expect(episodes.first?.title == nil)

        episodes = try await episodeService.getEpisodes(
          for: eva.requireID(),
          fields: ["title"],
          filters: [],
          on: app.db
        )
        #expect(episodes.count == 1)
        #expect(episodes.first?.title == "1:23:45")

        episodes = try await episodeService.getEpisodes(
          for: eva.requireID(),
          fields: ["title"],
          filters: ["episodeID_EQUALS_1"],
          on: app.db
        )
        #expect(episodes.count == 1)
        #expect(episodes.first?.title == "1:23:45")

        episodes = try await episodeService.getEpisodes(
          for: eva.requireID(),
          fields: ["title"],
          filters: ["episodeID_EQUALS_2"],
          on: app.db
        )
        #expect(episodes.isEmpty)
      }
    }
  }
}
