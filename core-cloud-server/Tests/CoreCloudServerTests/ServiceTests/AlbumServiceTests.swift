//
//  AlbumServiceTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/9/10.
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
  @Suite("AlbumServiceTests")
  struct AlbumServiceTests {
    @Test
    func testAddSong() async throws {
      let albumService = AlbumService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: AlbumError.databaseError) {
          try await albumService.addAlbum(
            name: "1996",
            artist: "Ryuichi Sakamoto",
            genre: "Chamber music",
            year: 1996,
            artworkURLs: "https://example.com/1.png",
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

        try await albumService.addAlbum(
          name: "1996",
          artist: "Ryuichi Sakamoto",
          genre: "Chamber music",
          year: 1996,
          artworkURLs: "https://example.com/1.png",
          for: eva.requireID(),
          on: app.db
        )
        let album = try await Album.query(on: app.db).first()
        #expect(album?.name == "1996")
        #expect(album?.artist == "Ryuichi Sakamoto")
        #expect(album?.genre == "Chamber music")
        #expect(album?.year == 1996)
        #expect(album?.artworkURLs == "https://example.com/1.png")

        await #expect(throws: AlbumError.databaseError) {
          try await albumService.addAlbum(
            name: "1996",
            artist: "Ryuichi Sakamoto",
            genre: "Chamber music",
            year: 1996,
            artworkURLs: "https://example.com/1.png",
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

        try await albumService.addAlbum(
          name: "1996",
          artist: "Ryuichi Sakamoto",
          genre: "Chamber music",
          year: 1996,
          artworkURLs: "https://example.com/1.png",
          for: alice.requireID(),
          on: app.db
        )
        let success = try await Album.query(on: app.db).count()
        #expect(success == 2)
      }
    }

    @Test
    func testGetAlbums() async throws {
      let albumService = AlbumService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        var albums = try await albumService.getAlbums(
          for: 1,
          fields: [],
          on: app.db
        )
        #expect(albums.isEmpty)

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

        albums = try await albumService.getAlbums(
          for: eva.requireID(),
          fields: [],
          on: app.db
        )
        #expect(albums.isEmpty)

        var album = try Album(
          name: "1996",
          artist: "Ryuichi Sakamoto",
          genre: "Chamber music",
          year: 1996,
          artworkURLs: "https://example.com/1.png",
          userID: eva.requireID()
        )
        try await album.save(on: app.db)

        albums = try await albumService.getAlbums(
          for: eva.requireID(),
          fields: ["name", "artist", "artworkURLs"],
          on: app.db
        )
        #expect(albums.count == 1)
        #expect(albums.first?.name == "1996")
        #expect(albums.first?.artist == "Ryuichi Sakamoto")
        #expect(albums.first?.artworkURLs == "https://example.com/1.png")

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

        album = try Album(
          name: "1996",
          artist: "Ryuichi Sakamoto",
          genre: "Chamber music",
          year: 1996,
          artworkURLs: "https://example.com/1.png",
          userID: alice.requireID()
        )
        try await album.save(on: app.db)

        albums = try await albumService.getAlbums(
          for: eva.requireID(),
          fields: [],
          on: app.db
        )
        #expect(albums.count == 1)

        albums = try await albumService.getAlbums(
          for: alice.requireID(),
          fields: [],
          on: app.db
        )
        #expect(albums.count == 1)

        albums = try await albumService.getAlbums(
          for: alice.requireID(),
          fields: ["year", "genre"],
          on: app.db
        )
        #expect(albums.count == 1)
        #expect(albums.first?.year == 1996)
        #expect(albums.first?.genre == "Chamber music")
        #expect(albums.first?.name == nil)
      }
    }

    @Test
    func testGetAlbum() async throws {
      let albumService = AlbumService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: AlbumError.noSuchAlbum) {
          try await albumService.getAlbum(
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

        await #expect(throws: AlbumError.noSuchAlbum) {
          try await albumService.getAlbum(
            with: 1,
            for: eva.requireID(),
            on: app.db
          )
        }

        let album = try Album(
          name: "1996",
          artist: "Ryuichi Sakamoto",
          genre: "Chamber music",
          year: 1996,
          artworkURLs: "https://example.com/1.png",
          userID: eva.requireID()
        )
        try await album.save(on: app.db)

        let albumDetail = try await albumService.getAlbum(
          with: album.requireID(),
          for: eva.requireID(),
          on: app.db
        )
        #expect(albumDetail.genre == "Chamber music")
        #expect(albumDetail.year == 1996)

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

        await #expect(throws: AlbumError.noSuchAlbum) {
          try await albumService.getAlbum(
            with: album.requireID(),
            for: alice.requireID(),
            on: app.db
          )
        }
      }
    }

    func testContainsAlbum() async throws {
      let albumService = AlbumService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        var isExist = try await albumService.containsAlbum(
          with: 1,
          for: 1,
          on: app.db
        )
        #expect(!isExist)

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

        isExist = try await albumService.containsAlbum(
          with: 1,
          for: eva.requireID(),
          on: app.db
        )
        #expect(!isExist)

        let album = try Album(
          name: "1996",
          artist: "Ryuichi Sakamoto",
          genre: "Chamber music",
          year: 1996,
          artworkURLs: "https://example.com/1.png",
          userID: eva.requireID()
        )
        try await album.save(on: app.db)

        isExist = try await albumService.containsAlbum(
          with: album.requireID(),
          for: eva.requireID(),
          on: app.db
        )
        #expect(isExist)

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

        isExist = try await albumService.containsAlbum(
          with: album.requireID(),
          for: alice.requireID(),
          on: app.db
        )
        #expect(!isExist)
      }
    }
  }
}
