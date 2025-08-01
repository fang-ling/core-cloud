//
//  UserService.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/7/29.
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

import _CryptoExtras
import Fluent
import Vapor

struct UserService {
  /**
   * Returns a Boolean value indicating whether the database contains a user
   * that has the given username.
   *
   * - Parameters:
   *   - username: The username of the user to check for.
   *   - database: The database to search for the user.
   *
   * - Returns: `true` if the user was found in the database;
   *            otherwise, `false`.
   *
   * - Throws:
   *   - ``UserError/databaseError``: if there is an issue accessing the
   *                                  database.
   */
  func peekUser(
    by username: String,
    on database: Database
  ) async throws -> Bool {
    do {
      let matchedUserCount = try await User.query(on: database)
        .filter(\.$username == username)
        .count()

      return matchedUserCount > 0
    } catch {
      throw UserError.databaseError
    }
  }

  /**
   * Adds a new user.
   *
   * - Parameters:
   *   - firstName: The first name of the user.
   *   - lastName: The last name of the user.
   *   - username: The desired username for the user.
   *   - password: The password of the user.
   *   - masterPassword: The master password of the user.
   *   - database: The database to insert for the user.
   *
   * - Throws:
   *   - ``UserError/cryptoError``: if there is an error during key derivation
   *                                or encryption.
   *   - ``UserError/databaseError``: if there is an issue accessing the
   *                                  database.
   */
  func insertUser(
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    masterPassword: String,
    on database: Database
  ) async throws {
    var key: SymmetricKey
    let salt = SymmetricKey(size: .bits256)
    do {
      key = try KDF.Scrypt.deriveKey(
        from: Data(password.utf8),
        salt: salt.withUnsafeBytes({ Data($0) }),
        outputByteCount: Authenticator.SCRYPT_OUTPUT_BYTE_COUNT,
        rounds: Authenticator.SCRYPT_ROUNDS,
        blockSize: Authenticator.SCRYPT_BLOCK_SIZE,
        parallelism: Authenticator.SCRYPT_PARALLELISM
      )
    } catch {
      throw UserError.cryptoError
    }

    var masterKeySealedBox: Data
    let masterKeySealedBoxSalt = SymmetricKey(size: .bits256)
    do {
      let masterKeySealedBoxKey = try KDF.Scrypt.deriveKey(
        from: Data(masterPassword.utf8),
        salt: masterKeySealedBoxSalt.withUnsafeBytes({ Data($0) }),
        outputByteCount: Authenticator.SCRYPT_OUTPUT_BYTE_COUNT,
        rounds: Authenticator.SCRYPT_ROUNDS,
        blockSize: Authenticator.SCRYPT_BLOCK_SIZE,
        parallelism: Authenticator.SCRYPT_PARALLELISM
      )

      let masterKey = SymmetricKey(size: .bits256)
      masterKeySealedBox = try AES.GCM
        .seal(
          masterKey.withUnsafeBytes({ Data($0) }),
          using: masterKeySealedBoxKey
        )
        .combined! /* We are using the default size of nonce, it is safe. */
    } catch {
      throw UserError.cryptoError
    }

    do {
      let user = User(
        firstName: firstName,
        lastName: lastName,
        username: username,
        key: key.withUnsafeBytes({ Data($0) }),
        salt: salt.withUnsafeBytes({ Data($0) }),
        masterKeySealedBox: masterKeySealedBox,
        masterKeySealedBoxSalt: masterKeySealedBoxSalt.withUnsafeBytes({
          Data($0)
        }),
        avatarURLs: ""
      )
      try await user.save(on: database)
    } catch {
      throw UserError.databaseError
    }
  }
}
