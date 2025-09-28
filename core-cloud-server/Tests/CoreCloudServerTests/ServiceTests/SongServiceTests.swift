//
//  SongServiceTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/31.
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
  @Suite("SongServiceTests")
  struct SongServiceTests {
    @Test
    func testAddSong() async throws {
      let songService = SongService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: SongError.databaseError) {
          try await songService.addSong(
            title: "Por Una Cabeza",
            artist: "Thomas Newman",
            trackNumber: 7,
            discNumber: 1,
            playCount: 0,
            sampleSize: 16,
            sampleRate: 44100,
            isPopular: true,
            duration: 58,
            with: 1,
            for: 1,
            at: 1,
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

        await #expect(throws: SongError.databaseError) {
          try await songService.addSong(
            title: "Por Una Cabeza",
            artist: "Thomas Newman",
            trackNumber: 7,
            discNumber: 1,
            playCount: 0,
            sampleSize: 16,
            sampleRate: 44100,
            isPopular: true,
            duration: 58,
            with: 1,
            for: eva.requireID(),
            at: 1,
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
          name: "Por Una Cabeza",
          kind: "Apple MPEG-4 Audio",
          size: 123,
          checksum: Data(),
          application: "Music",
          decryptionKeySealedBox: Data(),
          locationID: 1,
          userID: eva.requireID()
        )
        try await file.save(on: app.db)

        await #expect(throws: SongError.databaseError) {
          try await songService.addSong(
            title: "Por Una Cabeza",
            artist: "Thomas Newman",
            trackNumber: 7,
            discNumber: 1,
            playCount: 0,
            sampleSize: 16,
            sampleRate: 44100,
            isPopular: true,
            duration: 58,
            with: file.requireID(),
            for: eva.requireID(),
            at: 1,
            on: app.db
          )
        }

        let album = try Album(
          name: "Scent of a Woman",
          artist: "Thomas Newman",
          genre: "Soundtrack",
          year: 1992,
          artworkURLs: "https://example.com/1.png",
          userID: eva.requireID()
        )
        try await album.save(on: app.db)

        try await songService.addSong(
          title: "Por Una Cabeza",
          artist: "Thomas Newman",
          trackNumber: 7,
          discNumber: 1,
          playCount: 0,
          sampleSize: 16,
          sampleRate: 44100,
          isPopular: true,
          duration: 58,
          with: file.requireID(),
          for: eva.requireID(),
          at: album.requireID(),
          on: app.db
        )
        let song = try await Song.query(on: app.db).first()
        #expect(song?.title == "Por Una Cabeza")
        #expect(song?.artist == "Thomas Newman")
        #expect(song?.trackNumber == 7)
        #expect(song?.discNumber == 1)
        #expect(song?.playCount == 0)
        #expect(song?.isPopular == true)
        #expect(song?.sampleSize == 16)
        #expect(song?.sampleRate == 44100)

        await #expect(throws: SongError.databaseError) {
          try await songService.addSong(
            title: "Por Una Cabeza",
            artist: "Thomas Newman",
            trackNumber: 7,
            discNumber: 1,
            playCount: 0,
            sampleSize: 16,
            sampleRate: 44100,
            isPopular: true,
            duration: 58,
            with: file.requireID(),
            for: eva.requireID(),
            at: album.requireID(),
            on: app.db
          )
        }
      }
    }

    @Test
    func testGetSongs() async throws {
      let songService = SongService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        let empty1 = try await songService.getSongs(
          fields: [],
          filters: [],
          for: 1,
          on: app.db
        )
        #expect(empty1.isEmpty)

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

        let empty2 = try await songService.getSongs(
          fields: [],
          filters: [],
          for: eva.requireID(),
          on: app.db
        )
        #expect(empty2.isEmpty)

        let location = try Location(
          name: "Tank",
          path: "/mnt/tank1",
          userID: eva.requireID()
        )
        try await location.save(on: app.db)

        let file = try File(
          name: "Por Una Cabeza",
          kind: "Apple MPEG-4 Audio",
          size: 123,
          checksum: Data(),
          application: "Music",
          decryptionKeySealedBox: Data(),
          locationID: 1,
          userID: eva.requireID()
        )
        try await file.save(on: app.db)

        let album = try Album(
          name: "Scent of a Woman",
          artist: "Thomas Newman",
          genre: "Soundtrack",
          year: 1992,
          artworkURLs: "https://example.com/1.png",
          userID: eva.requireID()
        )
        try await album.save(on: app.db)

        let song = try Song(
          title: "Por Una Cabeza",
          artist: "Thomas Newman",
          trackNumber: 7,
          discNumber: 1,
          playCount: 0,
          sampleSize: 16,
          sampleRate: 44100,
          isPopular: true,
          duration: 58,
          fileID: file.requireID(),
          userID: eva.requireID(),
          albumID: album.requireID()
        )
        try await song.save(on: app.db)

        var songs = try await songService.getSongs(
          fields: ["title", "artist", "duration"],
          filters: [],
          for: eva.requireID(),
          on: app.db
        )
        #expect(songs.count > 0)
        #expect(songs.first?.id == 1)
        #expect(songs.first?.title == "Por Una Cabeza")
        #expect(songs.first?.artist == "Thomas Newman")
        #expect(songs.first?.albumName == nil)
        #expect(songs.first?.artworkURLs == nil)
        #expect(songs.first?.duration == 58)

        songs = try await songService.getSongs(
          fields: ["title", "artist", "albumName", "artworkURLs", "duration"],
          filters: [],
          for: eva.requireID(),
          on: app.db
        )
        #expect(songs.count > 0)
        #expect(songs.first?.id == 1)
        #expect(songs.first?.title == "Por Una Cabeza")
        #expect(songs.first?.artist == "Thomas Newman")
        #expect(songs.first?.albumName == "Scent of a Woman")
        #expect(songs.first?.artworkURLs == "https://example.com/1.png")
        #expect(songs.first?.duration == 58)

        songs = try await songService.getSongs(
          fields: ["title", "artist", "albumName", "artworkURLs", "duration"],
          filters: ["albumID_EQUALS_19358"],
          for: eva.requireID(),
          on: app.db
        )
        #expect(songs.isEmpty)

        songs = try await songService.getSongs(
          fields: ["trackNumber", "discNumber", "isPopular"],
          filters: ["albumID_EQUALS_\(album.requireID())"],
          for: eva.requireID(),
          on: app.db
        )
        #expect(songs.count > 0)
        #expect(songs.first?.isPopular == true)
        #expect(songs.first?.title == nil)
        #expect(songs.first?.trackNumber == 7)
        #expect(songs.first?.discNumber == 1)
      }
    }

    @Test
    func testGetSong() async throws {
      let songService = SongService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: SongError.noSuchSong) {
          try await songService.getSong(
            with: 1,
            fields: ["playCount"],
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

        await #expect(throws: SongError.noSuchSong) {
          try await songService.getSong(
            with: 1,
            fields: ["playCount"],
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
          name: "Por Una Cabeza",
          kind: "Apple MPEG-4 Audio",
          size: 123,
          checksum: Data(),
          application: "Music",
          decryptionKeySealedBox: Data(),
          locationID: 1,
          userID: eva.requireID()
        )
        try await file.save(on: app.db)

        let album = try Album(
          name: "Scent of a Woman",
          artist: "Thomas Newman",
          genre: "Soundtrack",
          year: 1992,
          artworkURLs: "https://example.com/1.png",
          userID: eva.requireID()
        )
        try await album.save(on: app.db)

        let song = try Song(
          title: "Por Una Cabeza",
          artist: "Thomas Newman",
          trackNumber: 7,
          discNumber: 1,
          playCount: 0,
          sampleSize: 16,
          sampleRate: 44100,
          isPopular: true,
          duration: 58,
          fileID: file.requireID(),
          userID: eva.requireID(),
          albumID: album.requireID()
        )
        try await song.save(on: app.db)

        let songDetail = try await songService.getSong(
          with: song.requireID(),
          fields: ["playCount", "isPopular"],
          for: eva.requireID(),
          on: app.db
        )
        #expect(songDetail.playCount == 0)
        #expect(songDetail.isPopular == true)
        #expect(songDetail.sampleRate == nil)

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

        await #expect(throws: SongError.noSuchSong) {
          try await songService.getSong(
            with: song.requireID(),
            fields: ["playCount"],
            for: alice.requireID(),
            on: app.db
          )
        }
      }
    }

    @Test
    func testUpdateSong() async throws {
      let songService = SongService()

      try await withApp(configure: CoreCloudServer.configure) { app in
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

        let location = try Location(
          name: "Tank",
          path: "/mnt/tank1",
          userID: eva.requireID()
        )
        try await location.save(on: app.db)

        let file = try File(
          name: "Por Una Cabeza",
          kind: "Apple MPEG-4 Audio",
          size: 123,
          checksum: Data(),
          application: "Music",
          decryptionKeySealedBox: Data(),
          locationID: 1,
          userID: eva.requireID()
        )
        try await file.save(on: app.db)

        let album = try Album(
          name: "Scent of a Woman",
          artist: "Thomas Newman",
          genre: "Soundtrack",
          year: 1992,
          artworkURLs: "https://example.com/1.png",
          userID: eva.requireID()
        )
        try await album.save(on: app.db)

        let song = try Song(
          title: "Por Una Cabeza",
          artist: "Thomas Newman",
          trackNumber: 7,
          discNumber: 1,
          playCount: 0,
          sampleSize: 16,
          sampleRate: 44100,
          isPopular: true,
          duration: 58,
          fileID: file.requireID(),
          userID: eva.requireID(),
          albumID: album.requireID()
        )
        try await song.save(on: app.db)

        try await songService.updateSong(
          with: song.requireID(),
          playCount: 19358,
          for: eva.requireID(),
          on: app.db
        )

        let retrievedSong = try await Song.query(on: app.db)
          .first()
        #expect(retrievedSong?.id == 1)
        #expect(retrievedSong?.title == "Por Una Cabeza")
        #expect(retrievedSong?.artist == "Thomas Newman")
        #expect(retrievedSong?.trackNumber == 7)
        #expect(retrievedSong?.discNumber == 1)
        #expect(retrievedSong?.playCount == 19358)
        #expect(retrievedSong?.sampleSize == 16)
        #expect(retrievedSong?.sampleRate == 44100)
      }
    }
  }
}
