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
   * - Returns: Returns the newly created user.
   *
   * - Throws:
   *   - ``UserError/cryptoError``: if there is an error during key derivation
   *                                or encryption.
   *   - ``UserError/databaseError``: if there is an issue accessing the
   *                                  database.
   */
  @discardableResult
  func insertUser(
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    masterPassword: String,
    on database: Database
  ) async throws -> User {
    var key: SymmetricKey
    let salt = SymmetricKey(size: .bits256)
    do {
      key = try KDF.Scrypt.deriveKey(
        from: Data(password.utf8),
        salt: salt.withUnsafeBytes({ Data($0) }),
        outputByteCount: CoreCloudServer.Scrypt.outputByteCount,
        rounds: CoreCloudServer.Scrypt.rounds,
        blockSize: CoreCloudServer.Scrypt.blockSize,
        parallelism: CoreCloudServer.Scrypt.parallelism
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
        outputByteCount: CoreCloudServer.Scrypt.outputByteCount,
        rounds: CoreCloudServer.Scrypt.rounds,
        blockSize: CoreCloudServer.Scrypt.blockSize,
        parallelism: CoreCloudServer.Scrypt.parallelism
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

      return user
    } catch {
      throw UserError.databaseError
    }
  }

  /**
   * Returns user information based on the given id.
   *
   * - Parameters:
   *   - id: The id for the user.
   *   - database: The database to query for the user.
   *
   * - Returns: A tuple containing the user's details:
   *   - username: The username for the user.
   *   - firstName: The first name of the user.
   *   - lastName: The last name of the user.
   *   - avatarURLs: The avatar urls of the user.
   *
   * - Throws:
   *   - ``UserError/noSuchUser``: if the user is not found.
   *   - ``UserError/databaseError``: if there is an issue accessing the
   *                                  database.
   */
  func getUser(with id: Int64, on database: Database) async throws -> (
    username: String,
    firstName: String,
    lastName: String,
    avatarURLs: [String]
  ) {
    do {
      guard let user = try await User.query(on: database)
        .filter(\.$id == id)
        .first()
      else {
        throw UserError.noSuchUser
      }

      return (
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarURLs: user.avatarURLs
          .components(separatedBy: ",")
          .filter({ !$0.isEmpty })
      )
    } catch UserError.noSuchUser {
      throw UserError.noSuchUser
    } catch {
      throw UserError.databaseError
    }
  }

  /**
   * Returns the master key of a user.
   *
   * - Parameters:
   *   - id: The id of the user.
   *   - masterPassword: The passcode to unlock the master key.
   *   - database: The database to query for the user.
   *
   * - Returns: The master key of a user.
   *
   * - Throws:
   *   - ``UserError/noSuchUser``: if the user is not found.
   *   - ``UserError/cryptoError``: if there is an error during key derivation
   *                                or encryption.
   *   - ``UserError/databaseError``: if there is an issue accessing the
   *                                  database.
   */
  func getUser(
    with id: Int64,
    masterPassword: String,
    on database: Database
  ) async throws -> SymmetricKey {
    let user: User
    do {
      guard let _user = try await User.query(on: database)
        .filter(\.$id == id)
        .first()
      else {
        throw UserError.noSuchUser
      }

      user = _user
    } catch UserError.noSuchUser {
      throw UserError.noSuchUser
    } catch {
      throw UserError.databaseError
    }

    do {
      let key = try KDF.Scrypt.deriveKey(
        from: Data(masterPassword.utf8),
        salt: user.masterKeySealedBoxSalt,
        outputByteCount: CoreCloudServer.Scrypt.outputByteCount,
        rounds: CoreCloudServer.Scrypt.rounds,
        blockSize: CoreCloudServer.Scrypt.blockSize,
        parallelism: CoreCloudServer.Scrypt.parallelism
      )

      return try SymmetricKey(
        data: AES.GCM.open(
          .init(combined: user.masterKeySealedBox),
          using: key
        )
      )
    } catch {
      throw UserError.cryptoError
    }
  }
}
