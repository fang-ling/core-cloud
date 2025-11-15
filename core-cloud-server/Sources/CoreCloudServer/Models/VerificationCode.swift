//
//  VerificationCode.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/7.
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

final class VerificationCode: Model, @unchecked Sendable {
  @ID(custom: FieldKeys.id, generatedBy: .database)
  var id: Int64?

  @Field(key: FieldKeys.secretSealedBox)
  var secretSealedBox: Data

  @Field(key: FieldKeys.secretSealedBoxKeySealedBox)
  var secretSealedBoxKeySealedBox: Data

  @Field(key: FieldKeys.digest)
  var digest: Int64

  @Field(key: FieldKeys.digits)
  var digits: Int64

  @Field(key: FieldKeys.interval)
  var interval: Int64

  @Parent(key: FieldKeys.passwordID)
  var password: Password

  @Parent(key: FieldKeys.userID)
  var user: User

  @Timestamp(key: FieldKeys.createdAt, on: .create)
  var createdAt: Date?

  @Timestamp(key: FieldKeys.updatedAt, on: .update)
  var updatedAt: Date?

  init() { }

  init(
    id: Int64? = nil,
    secretSealedBox: Data,
    secretSealedBoxKeySealedBox: Data,
    digest: Int64,
    digits: Int64,
    interval: Int64,
    passwordID: Password.IDValue,
    userID: User.IDValue,
    createdAt: Date? = nil,
    updatedAt: Date? = nil
  ) {
    self.id = id
    self.secretSealedBox = secretSealedBox
    self.secretSealedBoxKeySealedBox = secretSealedBoxKeySealedBox
    self.digest = digest
    self.digits = digits
    self.interval = interval
    self.$password.id = passwordID
    self.$user.id = userID
    self.createdAt = createdAt
    self.updatedAt = updatedAt
  }
}

extension VerificationCode {
  static let schema = "VerificationCodes"

  enum FieldKeys {
    static let id: FieldKey = "id"
    static let secretSealedBox: FieldKey = "secret_sealed_box"
    static let secretSealedBoxKeySealedBox: FieldKey = (
      "secret_sealed_box_key_sealed_box"
    )
    static let digest: FieldKey = "digest"
    static let digits: FieldKey = "digits"
    static let interval: FieldKey = "interval"
    static let passwordID: FieldKey = "password_id"
    static let userID: FieldKey = "user_id"
    static let createdAt: FieldKey = "created_at"
    static let updatedAt: FieldKey = "updated_at"
  }
}

extension VerificationCode {
  enum Digest: Int64 {
    case sha1 = 0
    case sha256 = 1
    case sha512 = 2
  }

  enum Digits: Int64 {
    case six = 6
    case seven = 7
    case eight = 8
  }
}

extension OTPDigest {
  init(_ digest: VerificationCode.Digest) {
    switch digest {
    case .sha1:
      self = .sha1
    case .sha256:
      self = .sha256
    case .sha512:
      self = .sha512
    }
  }
}

extension OTPDigits {
  init(_ digits: VerificationCode.Digits) {
    switch digits {
    case .six:
      self = .six
    case .seven:
      self = .seven
    case .eight:
      self = .eight
    }
  }
}

extension VerificationCode {
  enum Error: Swift.Error {
    case cryptoError
    case databaseError
    case noSuchVerificationCode
  }
}

extension VerificationCode {
  enum Singular { }
  enum Plural { }
}

extension VerificationCode.Singular {
  enum Input { }
  enum Output { }
}

extension VerificationCode.Singular.Input {
  struct Insertion: Codable {
    var base32EncodedSecret: String
    var digest: String
    var digits: Int64
    var interval: Int64
    var passwordID: Int64
  }

  struct Retrieval: Codable {
    var id: Int64
  }
}

extension VerificationCode.Singular.Output {
  struct Retrieval: Codable {
    var verificationCode: String
  }
}
