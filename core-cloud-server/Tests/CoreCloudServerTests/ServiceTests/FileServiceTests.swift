//
//  FileServiceTests.swift
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
  @Suite("FileServiceTests")
  struct FileServiceTests {
    @Test
    func getFile() async throws {
      let fileService = FileService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: FileError.noSuchFile) {
          try await fileService.getFile(
            by: 1,
            for: 1,
            on: app.db
          )
        }

        let lorna = User(
          firstName: "Lorna",
          lastName: "Chu",
          username: "lorna@example.com",
          key: Data(),
          salt: Data(),
          masterKeySealedBox: Data(),
          masterKeySealedBoxSalt: Data(),
          avatarURLs: "https://example.com/1.png"
        )
        try await lorna.save(on: app.db)

        let location = try Location(
          name: "Tank",
          path: "/mnt/tank1",
          userID: lorna.requireID()
        )
        try await location.save(on: app.db)

        let file = try File(
          name: "test.jpg",
          kind: "JPEG Image",
          size: 123,
          checksum: Data(),
          application: "Photos",
          decryptionKeySealedBox: Data(),
          locationID: location.requireID(),
          userID: lorna.requireID()
        )
        try await file.save(on: app.db)

        let retrievedFile = try await fileService.getFile(
          by: file.requireID(),
          for: lorna.requireID(),
          on: app.db
        )
        #expect(retrievedFile.kind == "JPEG Image")
        #expect(retrievedFile.application == "Photos")
      }
    }

    @Test
    func testGetFiles() async throws {
      let fileService = FileService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        let lorna = User(
          firstName: "Lorna",
          lastName: "Chu",
          username: "lorna@example.com",
          key: Data(),
          salt: Data(),
          masterKeySealedBox: Data(),
          masterKeySealedBoxSalt: Data(),
          avatarURLs: "https://example.com/1.png"
        )
        try await lorna.save(on: app.db)

        let location = try Location(
          name: "Tank",
          path: "/mnt/tank1",
          userID: lorna.requireID()
        )
        try await location.save(on: app.db)

        var files = try await fileService.getFiles(
          for: lorna.requireID(),
          fields: ["name"],
          filters: [],
          on: app.db
        )
        #expect(files.isEmpty)

        let file1 = try File(
          name: "test",
          kind: "JPEG Image",
          size: 19358,
          checksum: Data(),
          application: "Photos",
          decryptionKeySealedBox: Data(),
          locationID: location.requireID(),
          userID: lorna.requireID()
        )
        try await file1.save(on: app.db)

        files = try await fileService.getFiles(
          for: lorna.requireID(),
          fields: ["name"],
          filters: [],
          on: app.db
        )
        #expect(files.count == 1)
        #expect(files.first?.id == 1)
        #expect(files.first?.name == "test")
        #expect(files.first?.kind == nil)
        #expect(files.first?.size == nil)
        #expect(files.first?.date == nil)

        files = try await fileService.getFiles(
          for: lorna.requireID(),
          fields: ["name"],
          filters: ["kind_EQUALS_HEIF Image"],
          on: app.db
        )
        #expect(files.isEmpty)

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

        files = try await fileService.getFiles(
          for: eva.requireID(),
          fields: ["name"],
          filters: [],
          on: app.db
        )
        #expect(files.isEmpty)
      }
    }
  }
}
