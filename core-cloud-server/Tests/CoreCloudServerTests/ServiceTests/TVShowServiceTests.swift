//
//  TVShowServiceTests.swift
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
import Fluent
import Testing
import VaporTesting

extension ServiceTests {
  @Suite("TVShowServiceTests")
  struct TVShowServiceTests {
    @Test
    func testAddTVShow() async throws {
      let tvShowService = TVShowService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: TVShow.Error.databaseError) {
          try await tvShowService.addTVShow(
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
            titleLogoURLs: "https://example.com/3.png",
            studio: "HBO",
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

        try await tvShowService.addTVShow(
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
          titleLogoURLs: "https://example.com/3.png",
          studio: "HBO",
          for: eva.requireID(),
          on: app.db
        )
        let tvShow = try await TVShow.query(on: app.db).first()
        #expect(tvShow?.title == "Chernobyl")
        #expect(tvShow?.starring.starts(with: "Jared Harris") ?? false)
        #expect(tvShow?.genre == "Drama")
        #expect(tvShow?.startYear == 2019)
        #expect(tvShow?.endYear == 2019)
        #expect(tvShow?.region == "United States,Russia")
        #expect(tvShow?.description.starts(with: "Starring Jared ") ?? false)
        #expect(tvShow?.posterURLs == "https://example.com/1.png")
        #expect(tvShow?.artworkURLs == "https://example.com/2.png")
        #expect(tvShow?.titleLogoURLs == "https://example.com/3.png")
        #expect(tvShow?.studio == "HBO")

        await #expect(throws: TVShow.Error.databaseError) {
          try await tvShowService.addTVShow(
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
            titleLogoURLs: "https://example.com/3.png",
            studio: "HBO",
            for: eva.requireID(),
            on: app.db
          )
        }

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

        try await tvShowService.addTVShow(
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
          titleLogoURLs: "https://example.com/3.png",
          studio: "HBO",
          for: alice.requireID(),
          on: app.db
        )
        let count = try await TVShow.query(on: app.db).count()
        #expect(count == 2)
      }
    }

    @Test
    func testGetTVShows() async throws {
      let tvShowService = TVShowService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        var tvShows = try await tvShowService.getTVShows(
          for: 1,
          fields: [],
          on: app.db
        )
        #expect(tvShows.isEmpty)

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

        tvShows = try await tvShowService.getTVShows(
          for: eva.requireID(),
          fields: [],
          on: app.db
        )
        #expect(tvShows.isEmpty)

        var tvShow = try TVShow(
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

        tvShows = try await tvShowService.getTVShows(
          for: eva.requireID(),
          fields: ["posterURLs"],
          on: app.db
        )
        #expect(tvShows.count == 1)
        #expect(tvShows.first?.posterURLs == "https://example.com/1.png")

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

        tvShow = try TVShow(
          title: "Five Days at Memorial",
          starring: "Vera Farmiga,Cherry Jones,Cornelius Smith Jr.",
          genre: "Drama",
          startYear: 2022,
          endYear: 2022,
          region: "United States,Canada",
          description: (
            "Based on actual events from Hurricane Katrina. When the " +
            "floodwaters rose, power failed, and heat soared, exhausted " +
            "caregivers at a New Orleans hospital were forced to make " +
            "profound, heart-wrenching decisions."
          ),
          posterURLs: "https://example.com/1.png",
          artworkURLs: "https://example.com/2.png",
          studio: "Apple TV",
          userID: alice.requireID()
        )
        try await tvShow.save(on: app.db)

        tvShows = try await tvShowService.getTVShows(
          for: eva.requireID(),
          fields: [],
          on: app.db
        )
        #expect(tvShows.count == 1)

        tvShows = try await tvShowService.getTVShows(
          for: alice.requireID(),
          fields: [],
          on: app.db
        )
        #expect(tvShows.count == 1)
      }
    }

    @Test
    func testGetTVShow() async throws {
      let tvShowService = TVShowService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: TVShow.Error.noSuchTVShow) {
          try await tvShowService.getTVShow(
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

        await #expect(throws: TVShow.Error.noSuchTVShow) {
          try await tvShowService.getTVShow(
            with: 1,
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

        let tvShowDetail = try await tvShowService.getTVShow(
          with: tvShow.requireID(),
          for: eva.requireID(),
          on: app.db
        )
        #expect(tvShowDetail.artworkURLs == "https://example.com/2.png")
        #expect(tvShowDetail.genre == "Drama")

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

        await #expect(throws: TVShow.Error.noSuchTVShow) {
          try await tvShowService.getTVShow(
            with: tvShow.requireID(),
            for: alice.requireID(),
            on: app.db
          )
        }
      }
    }
  }
}
