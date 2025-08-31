//
//  UserTokenServiceTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/23.
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
import _CryptoExtras
import Fluent
import Testing
import VaporTesting

extension ServiceTests {
  @Suite("UserTokenServiceTests")
  struct UserTokenServiceTests {
    @Test
    func testSignUserToken() async throws {
      let userTokenService = UserTokenService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: UserError.noSuchUser) {
          try await userTokenService.signUserToken(
            username: "lorna@example.com",
            password: "Top-1-Secret",
            on: app.db
          ) { token in
            try await app.jwt.keys.sign(token)
          }
        }

        let salt = SymmetricKey(size: .bits256)
        let key = try KDF.Scrypt.deriveKey(
          from: Data("Top-2-Secret".utf8),
          salt: salt.withUnsafeBytes({ Data($0) }),
          outputByteCount: CoreCloudServer.SCRYPT_OUTPUT_BYTE_COUNT,
          rounds: CoreCloudServer.SCRYPT_ROUNDS,
          blockSize: CoreCloudServer.SCRYPT_BLOCK_SIZE,
          parallelism: CoreCloudServer.SCRYPT_PARALLELISM
        )

        let alice = User(
          firstName: "Alice",
          lastName: "Ou",
          username: "alice@example.com",
          key: key.withUnsafeBytes({ Data($0) }),
          salt: salt.withUnsafeBytes({ Data($0) }),
          masterKeySealedBox: Data(),
          masterKeySealedBoxSalt: Data(),
          avatarURLs: "https://example.com/1.png"
        )
        try await alice.save(on: app.db)

        await #expect(throws: UserError.invalidCredentials) {
          try await userTokenService.signUserToken(
            username: "alice@example.com",
            password: "Top-1-Secret",
            on: app.db
          ) { token in
            try await app.jwt.keys.sign(token)
          }
        }

        let token = try await userTokenService.signUserToken(
          username: "alice@example.com",
          password: "Top-2-Secret",
          on: app.db
        ) { token in
          try await app.jwt.keys.sign(token)
        }
        #expect(token.count(where: { $0 == "." }) == 2)
      }
    }

    @Test
    func testVerifyUserToken() async throws {
      let userTokenService = UserTokenService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: UserTokenError.jwtError) {
          try await userTokenService.verifyUserToken(from: "a.b.c") { token in
            try await app.jwt.keys.verify(token)
          }
        }

        let salt = SymmetricKey(size: .bits256)
        let key = try KDF.Scrypt.deriveKey(
          from: Data("Top-2-Secret".utf8),
          salt: salt.withUnsafeBytes({ Data($0) }),
          outputByteCount: CoreCloudServer.SCRYPT_OUTPUT_BYTE_COUNT,
          rounds: CoreCloudServer.SCRYPT_ROUNDS,
          blockSize: CoreCloudServer.SCRYPT_BLOCK_SIZE,
          parallelism: CoreCloudServer.SCRYPT_PARALLELISM
        )

        let alice = User(
          firstName: "Alice",
          lastName: "Ou",
          username: "alice@example.com",
          key: key.withUnsafeBytes({ Data($0) }),
          salt: salt.withUnsafeBytes({ Data($0) }),
          masterKeySealedBox: Data(),
          masterKeySealedBoxSalt: Data(),
          avatarURLs: "https://example.com/1.png"
        )
        try await alice.save(on: app.db)

        let token = try await userTokenService.signUserToken(
          username: "alice@example.com",
          password: "Top-2-Secret",
          on: app.db
        ) { token in
          try await app.jwt.keys.sign(token)
        }

        let userID = try await userTokenService.verifyUserToken(
          from: token
        ) { token in
          try await app.jwt.keys.verify(token)
        }
        #expect(userID == 1)
      }
    }
  }
}
