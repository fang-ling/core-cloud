//
//  CurrencyController.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/22.
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

struct CurrencyController: RouteCollection {
  let currencyService = CurrencyService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("currency")
      .grouped(AuthenticatorMiddleware())
      .post(use: insertCurrencyHandler)

    routes
      .grouped("api")
      .grouped("currencies")
      .grouped(AuthenticatorMiddleware())
      .get(use: fetchCurrenciesHandler)
  }

  func insertCurrencyHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return .init(status: .unauthorized)
    }

    guard
      let input = try? request.content.decode(
        Currency.Singular.Input.Insertion.self
      ),
      let symbolPosition = Currency.SymbolPosition.init(
        rawValue: input.symbolPosition
      )
    else {
      return .init(status: .badRequest)
    }

    do {
      let currencyID = try await currencyService.addCurrency(
        code: input.code,
        minorUnit: input.minorUnit,
        symbol: input.symbol,
        symbolPosition: symbolPosition,
        for: userID,
        on: request.db
      )

      return try .init(
        status: .created,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            Currency.Singular.Output.Insertion(id: currencyID)
          )
        )
      )
    } catch Currency.Error.databaseError {
      return .init(status: .serviceUnavailable)
    } catch {
      return .init(status: .internalServerError)
    }
  }

  func fetchCurrenciesHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return .init(status: .unauthorized)
    }

    guard let input = try? request.query.decode(
      Currency.Plural.Input.Retrieval.self
    ) else {
      return .init(status: .badRequest)
    }

    do {
      let currencies = try await currencyService.getCurrencies(
        for: userID,
        fields: input.fields.components(separatedBy: ","),
        on: request.db
      )

      return try .init(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            currencies.map { currency in
              Currency.Plural.Output.Retrieval(
                id: currency.id,
                code: currency.code
              )
            }
          )
        )
      )
    } catch Currency.Error.databaseError {
      return .init(status: .serviceUnavailable)
    } catch {
      return .init(status: .internalServerError)
    }
  }
}
