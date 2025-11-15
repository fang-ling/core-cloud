//
//  PasswordServiceTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/15.
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
  @Suite("PasswordServiceTests")
  struct PasswordServiceTests {
    @Test
    func testAddPassword() async throws {
      let passwordService = PasswordService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: Password.Error.databaseError) {
          try await passwordService.addPassword(
            label: "example.com",
            username: "Alice",
            key: "1234567890",
            keySealedBoxKeySealedBoxKey: .init(size: .bits256),
            notes: "Notes",
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

        try await passwordService.addPassword(
          label: "example.com",
          username: "Alice",
          key: "1234567890",
          keySealedBoxKeySealedBoxKey: .init(size: .bits256),
          notes: "Notes",
          for: eva.requireID(),
          on: app.db
        )
        let password = try await Password.query(on: app.db).first()
        #expect(password?.label == "example.com")
        #expect(password?.username == "Alice")
        #expect(password?.notes == "Notes")
      }
    }

    @Test
    func testGetPasswords() async throws {
      let passwordService = PasswordService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        var passwords = try await passwordService.getPasswords(
          for: 1,
          fields: [],
          on: app.db
        )
        #expect(passwords.isEmpty)

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

        passwords = try await passwordService.getPasswords(
          for: eva.requireID(),
          fields: [],
          on: app.db
        )
        #expect(passwords.isEmpty)

        let password = try Password(
          label: "example.com",
          username: "Alice",
          keySealedBox: Data(),
          keySealedBoxKeySealedBox: Data(),
          userID: eva.requireID()
        )
        try await password.save(on: app.db)

        passwords = try await passwordService.getPasswords(
          for: eva.requireID(),
          fields: ["label", "username", "verificationCode"],
          on: app.db
        )
        #expect(passwords.count == 1)
        #expect(passwords.first?.id != nil)
        #expect(passwords.first?.label == "example.com")
        #expect(passwords.first?.username == "Alice")
        #expect(passwords.first?.verificationCodeID == nil)

        let verificationCode = try VerificationCode(
          secretSealedBox: Data(),
          secretSealedBoxKeySealedBox: Data(),
          digest: 0,
          digits: 6,
          interval: 30,
          passwordID: password.requireID(),
          userID: eva.requireID()
        )
        try await verificationCode.save(on: app.db)

        passwords = try await passwordService.getPasswords(
          for: eva.requireID(),
          fields: ["label", "username", "verificationCodeID"],
          on: app.db
        )
        #expect(passwords.count == 1)
        #expect(passwords.first?.id != nil)
        #expect(passwords.first?.label == "example.com")
        #expect(passwords.first?.username == "Alice")
        #expect(passwords.first?.verificationCodeID == verificationCode.id)
      }
    }

    @Test
    func testGetPassword() async throws {
      let passwordService = PasswordService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: Password.Error.noSuchPassword) {
          try await passwordService.getPassword(
            with: 1,
            keySealedBoxKeySealedBoxKey: .init(size: .bits256),
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

        await #expect(throws: Password.Error.noSuchPassword) {
          try await passwordService.getPassword(
            with: 1,
            keySealedBoxKeySealedBoxKey: .init(size: .bits256),
            for: eva.requireID(),
            on: app.db
          )
        }

        let keySealedBoxKeySealedBoxKey = SymmetricKey(size: .bits256)
        let keySealedBoxKey = SymmetricKey(size: .bits256)
        let keySealedBoxKeySealedBox = try AES.GCM.seal(
          keySealedBoxKey.withUnsafeBytes({ Data($0) }),
          using: keySealedBoxKeySealedBoxKey
        ).combined!
        let keySealedBox = try AES.GCM.seal(
          "1234567890".data(using: .utf8)!,
          using: keySealedBoxKey
        ).combined!
        let password = try Password(
          label: "example.com",
          username: "Alice",
          keySealedBox: keySealedBox,
          keySealedBoxKeySealedBox: keySealedBoxKeySealedBox,
          userID: eva.requireID()
        )
        try await password.save(on: app.db)

        await #expect(throws: Password.Error.cryptoError) {
          try await passwordService.getPassword(
            with: password.requireID(),
            keySealedBoxKeySealedBoxKey: .init(size: .bits256),
            for: eva.requireID(),
            on: app.db
          )
        }

        let passwordDetail = try await passwordService.getPassword(
          with: password.requireID(),
          keySealedBoxKeySealedBoxKey: keySealedBoxKeySealedBoxKey,
          for: eva.requireID(),
          on: app.db
        )
        #expect(passwordDetail == "1234567890")
      }
    }
  }
}
