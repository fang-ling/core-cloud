//
//  VerificationCodeServiceTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/11.
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
  @Suite("VerificationCodeServiceTests")
  struct VerificationCodeServiceTests {
    @Test
    func testAddVerificationCode() async throws {
      let verificationCodeService = VerificationCodeService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: VerificationCode.Error.databaseError) {
          try await verificationCodeService.addVerificationCode(
            secret: .init(count: 32),
            secretSealedBoxKeySealedBoxKey: .init(size: .bits256),
            digest: .sha1,
            digits: .six,
            interval: 30,
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

        await #expect(throws: VerificationCode.Error.databaseError) {
          try await verificationCodeService.addVerificationCode(
            secret: .init(count: 32),
            secretSealedBoxKeySealedBoxKey: .init(size: .bits256),
            digest: .sha1,
            digits: .six,
            interval: 30,
            with: 1,
            for: eva.requireID(),
            on: app.db
          )
        }

        let password = try Password(
          label: "example.com",
          keySealedBox: Data(),
          keySealedBoxKeySealedBox: Data(),
          userID: eva.requireID()
        )
        try await password.save(on: app.db)

        try await verificationCodeService.addVerificationCode(
          secret: Data(count: 32),
          secretSealedBoxKeySealedBoxKey: .init(size: .bits256),
          digest: .sha1,
          digits: .six,
          interval: 30,
          with: password.requireID(),
          for: eva.requireID(),
          on: app.db
        )
        let verificationCode = try await VerificationCode.query(on: app.db)
          .first()
        #expect(verificationCode?.digest == 0)
        #expect(verificationCode?.digits == 6)
        #expect(verificationCode?.interval == 30)
        #expect(verificationCode?.$password.id == password.id)

        await #expect(throws: VerificationCode.Error.databaseError) {
          try await verificationCodeService.addVerificationCode(
            secret: Data(count: 32),
            secretSealedBoxKeySealedBoxKey: .init(size: .bits256),
            digest: .sha1,
            digits: .six,
            interval: 30,
            with: password.requireID(),
            for: eva.requireID(),
            on: app.db
          )
        }
      }
    }

    @Test
    func testGetVerificationCode() async throws {
      let verificationCodeService = VerificationCodeService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: VerificationCode.Error.noSuchVerificationCode) {
          try await verificationCodeService.getVerificationCode(
            with: 1,
            secretSealedBoxKeySealedBoxKey: .init(size: .bits256),
            date: Date(),
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

        let password = try Password(
          label: "example.com",
          keySealedBox: Data(),
          keySealedBoxKeySealedBox: Data(),
          userID: eva.requireID()
        )
        try await password.save(on: app.db)

        let secret = Data(base32Encoded: "JBSWY3DPEHPK3PXP")!
        let secretSealedBoxKey = SymmetricKey(size: .bits256)
        let secretSealedBox = try AES.GCM.seal(
          secret,
          using: secretSealedBoxKey
        ).combined!
        let secretSealedBoxKeySealedBoxKey = SymmetricKey(size: .bits256)
        let secretSealedBoxKeySealedBox = try AES.GCM.seal(
          secretSealedBoxKey.withUnsafeBytes({ Data($0) }),
          using: secretSealedBoxKeySealedBoxKey
        ).combined!
        let verificationCode = try VerificationCode(
          secretSealedBox: secretSealedBox,
          secretSealedBoxKeySealedBox: secretSealedBoxKeySealedBox,
          digest: 0,
          digits: 6,
          interval: 30,
          passwordID: password.requireID(),
          userID: eva.requireID()
        )
        try await verificationCode.save(on: app.db)

        await #expect(throws: VerificationCode.Error.cryptoError) {
          try await verificationCodeService.getVerificationCode(
            with: verificationCode.requireID(),
            secretSealedBoxKeySealedBoxKey: .init(size: .bits256),
            date: Date(),
            for: eva.requireID(),
            on: app.db
          )
        }

        let code = try await verificationCodeService.getVerificationCode(
          with: verificationCode.requireID(),
          secretSealedBoxKeySealedBoxKey: secretSealedBoxKeySealedBoxKey,
          date: Date(timeIntervalSince1970: 1762826415),
          for: eva.requireID(),
          on: app.db
        )
        #expect(code == "364551")
      }
    }
  }
}
