//
//  SettingServiceTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/10.
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
  @Suite("SettingServiceTests")
  struct SettingServiceTests {
    @Test
    func testInsertSetting() async throws {
      let settingService = SettingService()

      try await withApp(configure: CoreCloudServer.configure) { app in
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

        try await settingService.insertSetting(
          homeBackgroundColor: 0,
          for: alice.requireID(),
          on: app.db
        )
        let exists = try await Setting.query(on: app.db)
          .filter(\.$user.$id == alice.requireID())
          .first()
        #expect(exists != nil)
        #expect(exists?.homeBackgroundColor == 0)

        await #expect(throws: SettingError.databaseError) {
          try await settingService.insertSetting(
            homeBackgroundColor: 0,
            for: alice.requireID(),
            on: app.db
          )
        }

        await #expect(throws: SettingError.databaseError) {
          try await settingService.insertSetting(
            homeBackgroundColor: 0,
            for: -1,
            on: app.db
          )
        }
      }
    }

    @Test
    func testFetchSetting() async throws {
      let settingService = SettingService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: SettingError.noSuchSetting) {
          try await settingService.fetchSetting(for: -1, on: app.db)
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

        let aliceSetting = try Setting(
          userID: alice.requireID(),
          homeBackgroundColor: 12333
        )
        try await aliceSetting.save(on: app.db)

        let setting = try await settingService.fetchSetting(
          for: alice.requireID(),
          on: app.db
        )
        #expect(setting == aliceSetting.homeBackgroundColor)
      }
    }

    @Test
    func testModifySetting() async throws {
      let settingService = SettingService()

      try await withApp(configure: CoreCloudServer.configure) { app in
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

        let aliceSetting = try Setting(
          userID: alice.requireID(),
          homeBackgroundColor: 12333
        )
        try await aliceSetting.save(on: app.db)

        try await settingService.modifySetting(
          homeBackgroundColor: -12333,
          for: alice.requireID(),
          on: app.db
        )
        let modified = try await Setting.query(on: app.db)
          .filter(\.$user.$id == alice.requireID())
          .first()
        #expect(modified != nil)
        #expect(modified?.homeBackgroundColor == -12333)
      }
    }
  }
}
