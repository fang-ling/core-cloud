//
//  UserServiceTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/7/30.
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

@Suite("UserServiceTests")
struct UserServiceTests {
  @Test
  func peekUser() async throws {
    let userService = UserService()

    try await withApp(configure: CoreCloudServer.configure) { app in
      var exists = try await userService.peekUser(
        by: "alice@example.com",
        on: app.db
      )
      #expect(exists == false)

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

      exists = try await userService.peekUser(
        by: "alice@example.com",
        on: app.db
      )
      #expect(exists == true)

      exists = try await userService.peekUser(
        by: "eva@example.com",
        on: app.db
      )
      #expect(exists == false)

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

      exists = try await userService.peekUser(
        by: "eva@example.com",
        on: app.db
      )
      #expect(exists == true)

      try await User.query(on: app.db).filter(\.$lastName == "Ou").delete()

      exists = try await userService.peekUser(
        by: "alice@example.com",
        on: app.db
      )
      #expect(exists == false)
    }
  }
}
