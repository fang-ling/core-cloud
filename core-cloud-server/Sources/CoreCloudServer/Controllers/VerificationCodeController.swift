//
//  VerificationCodeController.swift
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

import Vapor

struct VerificationCodeController: RouteCollection {
  let verificationCodeService = VerificationCodeService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("verification-code")
      .grouped(AuthenticatorMiddleware())
      .post(use: insertVerificationCodeHandler)

    routes
      .grouped("api")
      .grouped("verification-code")
      .grouped(AuthenticatorMiddleware())
      .get(use: fetchVerificationCodeHandler)
  }

  func insertVerificationCodeHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return .init(status: .unauthorized)
    }

    guard let token = request
      .cookies
      .all[CoreCloudServer.Cookie.Keys.applicationToken]?
      .string,
          let slaveKeyData = Data(base64Encoded: token)
    else {
      return .init(status: .unauthorized)
    }
    let slaveKey = SymmetricKey(data: slaveKeyData)

    guard
      let input = try? request.content.decode(
        VerificationCode.Singular.Input.Insertion.self
      ),
      let secret = Data(base32Encoded: input.base32EncodedSecret),
      input.digits >= 6 && input.digits <= 8,
      input.interval == 30 // Currently supports 30-second interval
    else {
      return .init(status: .badRequest)
    }

    let digest: VerificationCode.Digest = switch input.digest {
    case "sha1":
        .sha1
    case "sha256":
        .sha256
    case "sha512":
        .sha512
    default:
        .sha1
    }

    do {
      let id = try await verificationCodeService.addVerificationCode(
        secret: secret,
        secretSealedBoxKeySealedBoxKey: slaveKey,
        digest: digest,
        digits: .init(rawValue: input.digits) ?? VerificationCode.Digits.six,
        interval: input.interval,
        with: input.passwordID,
        for: userID,
        on: request.db
      )

      return try .init(
        status: .created,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            VerificationCode.Singular.Output.Insertion(
              id: id
            )
          )
        )
      )
    } catch VerificationCode.Error.cryptoError {
      return .init(status: .unauthorized)
    } catch VerificationCode.Error.databaseError {
      return .init(status: .serviceUnavailable)
    } catch {
      return .init(status: .internalServerError)
    }
  }

  func fetchVerificationCodeHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return .init(status: .unauthorized)
    }

    guard let token = request
      .cookies
      .all[CoreCloudServer.Cookie.Keys.applicationToken]?
      .string,
          let slaveKeyData = Data(base64Encoded: token)
    else {
      return .init(status: .unauthorized)
    }
    let slaveKey = SymmetricKey(data: slaveKeyData)

    guard let input = try? request.query.decode(
      VerificationCode.Singular.Input.Retrieval.self
    ) else {
      return .init(status: .badRequest)
    }

    do {
      let verificationCode = try await verificationCodeService.getVerificationCode(
        with: input.id,
        secretSealedBoxKeySealedBoxKey: slaveKey,
        date: .init(
          timeIntervalSince1970: floor(Date().timeIntervalSince1970 / 30) * 30
        ),
        for: userID,
        on: request.db
      )

      return try .init(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            VerificationCode.Singular.Output.Retrieval(
              verificationCode: verificationCode
            )
          )
        )
      )
    } catch VerificationCode.Error.noSuchVerificationCode {
      return .init(status: .notFound)
    } catch VerificationCode.Error.cryptoError {
      return .init(status: .unauthorized)
    } catch VerificationCode.Error.databaseError {
      return .init(status: .serviceUnavailable)
    } catch {
      return .init(status: .internalServerError)
    }
  }
}
