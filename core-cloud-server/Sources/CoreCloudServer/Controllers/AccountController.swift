//
//  AccountController.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/23.
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

struct AccountController: RouteCollection {
  let accountService = AccountService()
  let currencyService = CurrencyService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("account")
      .grouped(AuthenticatorMiddleware())
      .post(use: insertAccountHandler)

    routes
      .grouped("api")
      .grouped("accounts")
      .grouped(AuthenticatorMiddleware())
      .get(use: fetchAccountsHandler)

    routes
      .grouped("api")
      .grouped("account")
      .grouped(AuthenticatorMiddleware())
      .patch(use: modifyAccountHandler)
  }

  func insertAccountHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return .init(status: .unauthorized)
    }

    guard
      let input = try? request.content.decode(
        Account.Singular.Input.Insertion.self
      ),
      let type: Account.`Type` = .init(rawValue: input.type),
      let minorUnit = try? await currencyService.getCurrency(
        with: input.currencyID,
        fields: ["minorUnit"],
        for: userID,
        on: request.db
      ),
      let balance = Decimal(string: input.balance),
      let actualBalance = Decimal(string: input.actualBalance),
      let newBalance = Int64((balance * Decimal(minorUnit)).description),
      let newActualBalance = Int64(
        (actualBalance * Decimal(minorUnit)).description
      )
    else {
      return .init(status: .badRequest)
    }

    do {
      let accountID = try await accountService.addAccount(
        title: input.title,
        subtitle: input.subtitle,
        number: input.number,
        type: type,
        balance: newBalance,
        actualBalance: newActualBalance,
        logoURLs: input.logoURLs,
        with: input.currencyID,
        for: userID,
        on: request.db
      )

      return try .init(
        status: .created,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            Account.Singular.Output.Insertion(id: accountID)
          )
        )
      )
    } catch Account.Error.databaseError {
      return .init(status: .serviceUnavailable)
    } catch {
      return .init(status: .internalServerError)
    }
  }

  func fetchAccountsHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return .init(status: .unauthorized)
    }

    guard let input = try? request.query.decode(
      Account.Plural.Input.Retrieval.self
    ) else {
      return .init(status: .badRequest)
    }

    do {
      let accounts = try await accountService.getAccounts(
        for: userID,
        fields: input.fields.components(separatedBy: ","),
        on: request.db
      )

      return try .init(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            accounts.map { account in
              let balance = (
                account.balance != nil && account.currencyMinorUnit != nil
                  ? (
                    Decimal(account.balance!) /
                    Decimal(account.currencyMinorUnit!)
                  ).description
                  : nil
              )
              let actualBalance = (
                account.actualBalance != nil && account.currencyMinorUnit != nil
                  ? (
                    Decimal(account.actualBalance!) /
                    Decimal(account.currencyMinorUnit!)
                  ).description
                  : nil
              )

              return Account.Plural.Output.Retrieval(
                id: account.id,
                title: account.title,
                subtitle: account.subtitle,
                number: account.number,
                type: account.type?.rawValue,
                balance: balance,
                actualBalance: actualBalance,
                currencySymbol: account.currencySymbol,
                currencySymbolPosition: account.currencySymbolPosition?.rawValue
              )
            }
          )
        )
      )
    } catch Account.Error.databaseError {
      return .init(status: .serviceUnavailable)
    } catch {
      return .init(status: .internalServerError)
    }
  }

  func modifyAccountHandler(request: Request) async -> HTTPStatus {
    guard let userID = request.userID else {
      return .unauthorized
    }

    guard let input = try? request.content.decode(
      Account.Singular.Input.Modification.self
    ) else {
      return .badRequest
    }

    guard
      let currencyID = try? await accountService.getAccount(
        with: input.id,
        fields: ["currencyID"],
        for: userID,
        on: request.db
      ),
      let minorUnit = try? await currencyService.getCurrency(
        with: currencyID,
        fields: ["minorUnit"],
        for: userID,
        on: request.db
      )
    else {
      return .notFound
    }

    var newActualBalance: Int64? = nil
    if let actualBalance = input.actualBalance {
      newActualBalance = Int64(
        ((Decimal(string: actualBalance) ?? 0) * Decimal(minorUnit)).description
      )
    }

    do {
      try await accountService.updateAccount(
        with: input.id,
        actualBalance: newActualBalance,
        for: userID,
        on: request.db
      )

      return .ok
    } catch Account.Error.databaseError {
      return .serviceUnavailable
    } catch {
      return .internalServerError
    }
  }
}
