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
            genre: "Soundtrack",
            year: 1992,
            trackNumber: 7,
            discNumber: 1,
            playCount: 0,
            sampleSize: 16,
            sampleRate: 44100,
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

        await #expect(throws: SongError.databaseError) {
          try await songService.addSong(
            title: "Por Una Cabeza",
            artist: "Thomas Newman",
            genre: "Soundtrack",
            year: 1992,
            trackNumber: 7,
            discNumber: 1,
            playCount: 0,
            sampleSize: 16,
            sampleRate: 44100,
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

        try await songService.addSong(
          title: "Por Una Cabeza",
          artist: "Thomas Newman",
          genre: "Soundtrack",
          year: 1992,
          trackNumber: 7,
          discNumber: 1,
          playCount: 0,
          sampleSize: 16,
          sampleRate: 44100,
          with: file.requireID(),
          for: eva.requireID(),
          on: app.db
        )
        let song = try await Song.query(on: app.db).first()
        #expect(song?.title == "Por Una Cabeza")
        #expect(song?.artist == "Thomas Newman")
        #expect(song?.genre == "Soundtrack")
        #expect(song?.year == 1992)
        #expect(song?.trackNumber == 7)
        #expect(song?.discNumber == 1)
        #expect(song?.playCount == 0)
        #expect(song?.sampleSize == 16)
        #expect(song?.sampleRate == 44100)

        await #expect(throws: SongError.databaseError) {
          try await songService.addSong(
            title: "Por Una Cabeza",
            artist: "Thomas Newman",
            genre: "Soundtrack",
            year: 1992,
            trackNumber: 7,
            discNumber: 1,
            playCount: 0,
            sampleSize: 16,
            sampleRate: 44100,
            with: file.requireID(),
            for: eva.requireID(),
            on: app.db
          )
        }
      }
    }

    @Test
    func testGetSongs() async throws {
      let songService = SongService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        let empty1 = try await songService.getSongs(for: 1, on: app.db)
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

        let song = try Song(
          title: "Por Una Cabeza",
          artist: "Thomas Newman",
          genre: "Soundtrack",
          year: 1992,
          trackNumber: 7,
          discNumber: 1,
          playCount: 0,
          sampleSize: 16,
          sampleRate: 44100,
          fileID: file.requireID(),
          userID: eva.requireID()
        )
        try await song.save(on: app.db)

        let songs = try await songService.getSongs(
          for: eva.requireID(),
          on: app.db
        )
        #expect(songs.count > 0)
        #expect(songs.first?.id == 1)
        #expect(songs.first?.title == "Por Una Cabeza")
        #expect(songs.first?.artist == "Thomas Newman")
        #expect(songs.first?.genre == "Soundtrack")
        #expect(songs.first?.year == 1992)
        #expect(songs.first?.trackNumber == 7)
        #expect(songs.first?.discNumber == 1)
        #expect(songs.first?.playCount == 0)
        #expect(songs.first?.sampleSize == 16)
        #expect(songs.first?.sampleRate == 44100)
      }
    }
  }
}
