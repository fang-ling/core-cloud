//
//  PasswordController.swift
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

struct PasswordController: RouteCollection {
  let passwordService = PasswordService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("password")
      .grouped(AuthenticatorMiddleware())
      .post(use: insertPasswordHandler)

    routes
      .grouped("api")
      .grouped("passwords")
      .grouped(AuthenticatorMiddleware())
      .get(use: fetchPasswordsHandler)

    routes
      .grouped("api")
      .grouped("password")
      .grouped(AuthenticatorMiddleware())
      .get(use: fetchPasswordHandler)
  }

  func insertPasswordHandler(request: Request) async -> Response {
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

    guard let input = try? request.content.decode(
      Password.Singular.Input.Insertion.self
    ) else {
      return .init(status: .badRequest)
    }

    do {
      let passwordID = try await passwordService.addPassword(
        label: input.label,
        username: input.username,
        key: input.key,
        keySealedBoxKeySealedBoxKey: slaveKey,
        notes: input.notes,
        for: userID,
        on: request.db
      )

      return try .init(
        status: .created,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            Password.Singular.Output.Insertion(
              id: passwordID
            )
          )
        )
      )
    } catch Password.Error.cryptoError {
      return .init(status: .unauthorized)
    } catch Password.Error.databaseError {
      return .init(status: .serviceUnavailable)
    } catch {
      return .init(status: .internalServerError)
    }
  }

  func fetchPasswordsHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return .init(status: .unauthorized)
    }

    guard let input = try? request.query.decode(
      Password.Plural.Input.Retrieval.self
    ) else {
      return .init(status: .badRequest)
    }

    do {
      let passwords = try await passwordService.getPasswords(
        for: userID,
        fields: input.fields.components(separatedBy: ","),
        on: request.db
      )

      return try .init(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            passwords.map { password in
              Password.Plural.Output.Retrieval(
                id: password.id,
                label: password.label,
                username: password.username,
                verificationCodeID: password.verificationCodeID
              )
            }
          )
        )
      )
    } catch Password.Error.databaseError {
      return .init(status: .serviceUnavailable)
    } catch {
      return .init(status: .internalServerError)
    }
  }

  func fetchPasswordHandler(request: Request) async -> Response {
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
      Password.Singular.Input.Retrieval.self
    ) else {
      return .init(status: .badRequest)
    }

    do {
      let password = try await passwordService.getPassword(
        with: input.id,
        keySealedBoxKeySealedBoxKey: slaveKey,
        for: userID,
        on: request.db
      )

      return try Response(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            Password.Singular.Output.Retrieval(
              key: password/*.key*/
            )
          )
        )
      )
    } catch Password.Error.cryptoError {
      return .init(status: .unauthorized)
    } catch Password.Error.noSuchPassword {
      return .init(status: .notFound)
    } catch {
      return .init(status: .internalServerError)
    }
  }
}
