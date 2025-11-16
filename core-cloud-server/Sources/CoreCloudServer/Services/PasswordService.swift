//
//  PasswordService.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/14.
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

struct PasswordService {
  /// Adds a new password entry to the database, encrypting the secret and
  /// safely wrapping the per-item encryption key. Returns the newly created
  /// password's id.
  ///
  /// The sealed values are stored using AES-GCM's combined representation.
  /// To decrypt later, load both blobs, open the DEK with the KEK, reconstruct
  /// the `SymmetricKey` from the unwrapped bytes, and then open the secret with
  /// that DEK.
  ///
  /// - Parameters:
  ///   - label: A human-readable label for the credential.
  ///   - username: An optional username associated with the credential.
  ///   - key: The secret to protect. This is UTF-8–encoded before encryption.
  ///   - keySealedBoxKeySealedBoxKey: The key-encryption key (KEK) used to wrap
  ///     the per-item DEK.
  ///     Must be distinct from the generated DEK.
  ///   - notes: Optional notes associated with the credential.
  ///   - userID: The owner of this credential.
  ///   - database: The database connection on which to persist the new record.
  ///
  /// - Returns: The id of the newly created password.
  ///
  /// - Throws:
  ///   - ``Password.Error/cryptoError`` if any cryptographic step fails.
  ///   - ``Password.Error/databaseError`` if saving the model to the database
  ///     fails.
  func addPassword(
    label: String,
    username: String?,
    key: String,
    keySealedBoxKeySealedBoxKey: SymmetricKey,
    notes: String?,
    for userID: User.IDValue,
    on database: Database
  ) async throws -> Password.IDValue {
    let keySealedBoxKey = SymmetricKey(size: .bits256)

    guard
      let keyData = key.data(using: .utf8),
      let keySealedBox = try? AES.GCM.seal(
        keyData,
        using: keySealedBoxKey
      ),
      let keySealedBoxData = keySealedBox.combined,
      let keySealedBoxKeySealedBox = try? AES.GCM.seal(
        keySealedBoxKey.withUnsafeBytes({ Data($0) }),
        using: keySealedBoxKeySealedBoxKey
      ),
      let keySealedBoxKeySealedBoxData = keySealedBoxKeySealedBox.combined
    else {
      throw Password.Error.cryptoError
    }

    let password = Password(
      label: label,
      username: username,
      keySealedBox: keySealedBoxData,
      keySealedBoxKeySealedBox: keySealedBoxKeySealedBoxData,
      notes: notes,
      userID: userID
    )

    do {
      try await password.save(on: database)

      return try password.requireID()
    } catch {
      throw Password.Error.databaseError
    }
  }

  /// Returns a filtered projection of passwords for a given user.
  ///
  /// This function queries the database for all `Password` models that belong
  /// to the specified `userID`, then maps each result to a lightweight tuple
  /// containing only the fields requested via `fields`.
  ///
  /// Supported field keys are:
  ///   - "label" → includes the password's `label`
  ///   - "username" → includes the password's `username`
  ///   - "verificationCodeID" → includes the password's `verificationCodeID`
  ///
  /// Any requested field not listed above will be ignored. Non-requested fields
  /// are returned as `nil` in the resulting tuples. The `id` is always
  /// included.
  ///
  /// - Parameters:
  ///   - userID: The identifier of the `User` whose passwords should be
  ///     fetched.
  ///   - fields: A list of field keys that determine which optional properties
  ///     to include in the result.
  ///   - database: The `Database` to run the query on.
  ///
  /// - Returns: An array of tuples containing requested fields for each
  ///   password owned by the user. Field are `nil` if their keys are not
  ///   present in `fields`.
  ///
  /// - Throws:
  ///   - ``Password.Error/databaseError`` if the database query fails or cannot
  ///     be completed.
  func getPasswords(
    for userID: User.IDValue,
    fields: [String],
    on database: Database
  ) async throws -> [(
    id: User.IDValue,
    label: String?,
    username: String?,
    verificationCodeID: VerificationCode.IDValue?
  )] {
    do {
      return try await Password.query(on: database)
        .with(\.$verificationCode)
        .filter(\.$user.$id == userID)
        .all()
        .map { password in (
          id: try password.requireID(),
          label: fields.contains("label") ? password.label : nil,
          username: fields.contains("username") ? password.username : nil,
          verificationCodeID: fields.contains("verificationCodeID")
            ? password.verificationCode?.id
            : nil
        )}
    } catch {
      throw Password.Error.databaseError
    }
  }

  /// Retrieves a decrypted password for a specific user from the database.
  ///
  /// - Parameters:
  ///   - id: The unique identifier of the password to retrieve.
  ///   - keySealedBoxKeySealedBoxKey: A symmetric key used to decrypt the key.
  ///   - userID: The unique identifier of the user for whom the password is
  ///     being retrieved.
  ///   - database: The database instance used to query the password.
  ///
  /// - Returns: The decrypted password.
  ///
  /// - Throws:
  ///   - ``Password.Error/noSuchPassword``: if the password cannot be found.
  ///   - ``Password.Error/cryptoError``: if a cryptographic error occurs.
  func getPassword(
    with id: Password.IDValue,
    keySealedBoxKeySealedBoxKey: SymmetricKey,
    for userID: User.IDValue,
    on database: Database
  ) async throws -> /*(
    key: */String
  /*)*/ {
    guard
      let password = try? await Password.query(on: database)
        .filter(\.$user.$id == userID)
        .filter(\.$id == id)
        .first()
    else {
      throw Password.Error.noSuchPassword
    }

    guard
      let keySealedBoxKeySealedBox = try? AES.GCM.SealedBox(
        combined: password.keySealedBoxKeySealedBox
      ),
      let keySealedBoxKey = try? AES.GCM.open(
        keySealedBoxKeySealedBox,
        using: keySealedBoxKeySealedBoxKey
      ),
      let keySealedBox = try? AES.GCM.SealedBox(
        combined: password.keySealedBox
      ),
      let keyData = try? AES.GCM.open(
        keySealedBox,
        using: .init(data: keySealedBoxKey)
      ),
      let key = String(data: keyData, encoding: .utf8)
    else {
      throw Password.Error.cryptoError
    }

    return /*(
      key: */key/*
    )*/
  }
}
