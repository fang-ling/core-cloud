//
//  VerificationCodeService.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/8.
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

import Fluent
import Vapor

struct VerificationCodeService {
  /// Adds a new verification code for a user, securely storing the secret using
  /// encryption. Returns the newly created verification-code's id.
  ///
  /// This method encrypts the provided secret with the given symmetric key and
  /// creates a new `VerificationCode` record in the database for the specified
  /// user.
  ///
  /// - Parameters:
  ///   - secret: The raw secret data to be stored for generating verification
  ///     codes.
  ///   - secretSealedBoxKeySealedBoxKey: The symmetric key used to encrypt the
  ///     secret.
  ///   - digest: The hash algorithm used for the verification code (e.g. SHA1,
  ///     SHA256).
  ///   - digits: The number of digits for the verification code (e.g. 6, 8).
  ///   - interval: The time step interval (in seconds) for the TOTP
  ///     verification code.
  ///   - passwordID: The password ID associated with the verification code.
  ///   - userID: The user ID associated with the verification code.
  ///   - database: The database connection to use for persisting the
  ///     verification code.
  ///
  /// - Returns: The id of the newly created verification code.
  ///
  /// - Throws:
  ///   - ``VerificationCode.Error/cryptoError``: If encryption of the secret
  ///     fails.
  ///   - ``VerificationCode.Error/databaseError``: If saving the verification
  ///     code to the database fails.
  func addVerificationCode(
    secret: Data,
    secretSealedBoxKeySealedBoxKey: SymmetricKey,
    digest: VerificationCode.Digest,
    digits: VerificationCode.Digits,
    interval: Int64,
    with passwordID: Password.IDValue,
    for userID: User.IDValue,
    on database: Database
  ) async throws -> VerificationCode.IDValue {
    let secretSealedBoxKey = SymmetricKey(size: .bits256)

    guard
      let secretSealedBox = try? AES.GCM.seal(
        secret,
        using: secretSealedBoxKey
      ),
      let secretSealedBoxData = secretSealedBox.combined,
      let secretSealedBoxKeySealedBox = try? AES.GCM.seal(
        secretSealedBoxKey.withUnsafeBytes({ Data($0) }),
        using: secretSealedBoxKeySealedBoxKey
      ),
      let secretSealedBoxKeySealedBoxData = secretSealedBoxKeySealedBox.combined
    else {
      throw VerificationCode.Error.cryptoError
    }

    let verificationCode = VerificationCode(
      secretSealedBox: secretSealedBoxData,
      secretSealedBoxKeySealedBox: secretSealedBoxKeySealedBoxData,
      digest: digest.rawValue,
      digits: digits.rawValue,
      interval: interval,
      passwordID: passwordID,
      userID: userID
    )

    do {
      try await verificationCode.save(on: database)

      return try verificationCode.requireID()
    } catch {
      throw VerificationCode.Error.databaseError
    }
  }

  /// Retrieves a one-time verification code for a specified user.
  ///
  /// This method securely fetches a `VerificationCode` record from the
  /// database, decrypts its secret key, and generates a TOTP (time-based
  /// one-time password) using the provided date.
  ///
  /// - Parameters:
  ///   - id: The unique identifier of the verification code.
  ///   - secretSealedBoxKeySealedBoxKey: The symmetric key used to decrypt the
  ///     sealed secret.
  ///   - date: The date and time for which the TOTP should be generated.
  ///   - userID: The user ID associated with the verification code.
  ///   - database: The database connection to use for querying the verification
  ///     code.
  ///
  /// - Returns: A string containing the generated verification code.
  ///
  /// - Throws:
  ///   - ``VerificationCode.Error/noSuchVerificationCode``: If no verification
  ///     code with the given ID/userID is found.
  ///   - ``VerificationCode.Error/cryptoError``: If decryption of the secret
  ///     fails.
  ///   - ``VerificationCode.Error/databaseError``: If there is an issue with
  ///     the verification code's digest or digits in the database.
  func getVerificationCode(
    with id: VerificationCode.IDValue,
    secretSealedBoxKeySealedBoxKey: SymmetricKey,
    date: Date,
    for userID: User.IDValue,
    on database: Database
  ) async throws -> String {
    guard let verificationCode = try? await VerificationCode.query(on: database)
      .filter(\.$id == id)
      .filter(\.$user.$id == id)
      .first()
    else {
      throw VerificationCode.Error.noSuchVerificationCode
    }

    guard
      let secretSealedBoxKeySealedBox = try? AES.GCM.SealedBox(
        combined: verificationCode.secretSealedBoxKeySealedBox
      ),
      let secretSealedBoxKey = try? AES.GCM.open(
        secretSealedBoxKeySealedBox,
        using: secretSealedBoxKeySealedBoxKey
      ),
      let secretSealedBox = try? AES.GCM.SealedBox(
        combined: verificationCode.secretSealedBox
      ),
      let secret = try? AES.GCM.open(
        secretSealedBox,
        using: .init(data: secretSealedBoxKey)
      )
    else {
      throw VerificationCode.Error.cryptoError
    }

    guard
      let digest = VerificationCode.Digest(rawValue: verificationCode.digest),
      let digits = VerificationCode.Digits(rawValue: verificationCode.digits)
    else {
      throw VerificationCode.Error.databaseError
    }

    return TOTP.generate(
      key: .init(data: secret),
      digest: .init(digest),
      digits: .init(digits),
      interval: Int(verificationCode.interval),
      time: date
    )
  }
}
