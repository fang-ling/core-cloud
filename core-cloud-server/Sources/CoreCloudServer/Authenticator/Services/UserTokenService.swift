//
//  UserTokenService.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/2.
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
import JWT
import Vapor

struct UserTokenService {
  /**
   * Creates a new user token for the specified user and signs it.
   *
   * - Parameters:
   *   - username: The username of the user.
   *   - password: The password of the user.
   *   - database: The database to search for the user.
   *   - jwt: The JWT instance used to sign the token.
   *
   * - Returns: The JWT string.
   *
   * - Throws:
   *   - ``UserError/noSuchUser``: if the user is not found.
   *   - ``UserError/invalidCredentials``: if the password is wrong.
   *   - ``UserTokenError/databaseError``: if there is an issue accessing the
   *                                       database.
   *   - ``UserTokenError/jwtError``: if there is an issue during the signing
   *                                  process.
   */
  func insertUserToken(
    username: String,
    password: String,
    on database: Database,
    with jwt: Request.JWT
  ) async throws -> String {
    var token: UserToken
    do {
      guard let user = try await User.query(on: database)
        .filter(\.$username == username)
        .first() else {
        throw UserError.noSuchUser
      }
      let derivedKey = try KDF.Scrypt.deriveKey(
        from: Data(password.utf8),
        salt: user.salt,
        outputByteCount: 256 / 8,
        rounds: Authenticator.SCRYPT_ROUNDS,
        blockSize: Authenticator.SCRYPT_BLOCK_SIZE,
        parallelism: Authenticator.SCRYPT_PARALLELISM
      )
      if user.key != derivedKey.withUnsafeBytes({ Data($0) }) {
        throw UserError.invalidCredentials
      }
      token = try UserToken(
        subject: SubjectClaim(value: "\(user.requireID())"),
        expiration: ExpirationClaim(value: Date().addingTimeInterval(86_400))
      )
    } catch {
      throw UserTokenError.databaseError
    }

    do {
      return try await jwt.sign(token)
    } catch {
      throw UserTokenError.jwtError
    }
  }
}
