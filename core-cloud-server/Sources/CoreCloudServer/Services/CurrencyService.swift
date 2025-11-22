//
//  CurrencyService.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/19.
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

struct CurrencyService {
  /// Adds a new currency to the database.
  ///
  /// - Parameters:
  ///   - code: The unique currency code (e.g., "USD").
  ///   - minorUnit: The number of minor units in one unit of the currency
  ///     (e.g., 100 for cents).
  ///   - symbol: The symbol for the currency (e.g., "$").
  ///   - symbolPosition: The position of the currency symbol relative to the
  ///     amount.
  ///   - userID: The unique identifier for the user associated with the
  ///     currency.
  ///   - database: The database instance where the currency will be saved.
  ///
  /// - Returns: The unique identifier for the newly created currency.
  ///
  /// - Throws:
  ///   - ``Currency.Error/databaseError`` if there is an error saving the
  ///     currency to the database.
  func addCurrency(
    code: String,
    minorUnit: Int64,
    symbol: String,
    symbolPosition: Currency.SymbolPosition,
    for userID: User.IDValue,
    on database: Database
  ) async throws -> Currency.IDValue {
    let currency = Currency(
      code: code,
      minorUnit: minorUnit,
      symbol: symbol,
      symbolPosition: symbolPosition.rawValue,
      userID: userID
    )

    do {
      try await currency.save(on: database)

      return try currency.requireID()
    } catch {
      throw Currency.Error.databaseError
    }
  }

  /// Retrieves the details of a currency associated with a specified user.
  ///
  /// - Parameters:
  ///   - id: The identifier of the currency to be retrieved.
  ///   - userID: The identifier of the user who owns the currency.
  ///   - database: The database instance where the currency information
  ///     resides.
  ///
  /// - Returns: This function is expected to return the detailed information of
  ///   the currency, represented as a tuple containing fields relevant to the
  ///   currency. However, the current implementation does not return any data
  ///   as it only checks for the existence of the currency.
  ///
  /// - Throws:
  ///   - ``Currency.Error/noSuchCurrency`` if no currency with the specified ID
  ///     exists for the given user.
  ///   - ``Currency.Error/databaseError`` if a database error occurs during the
  ///     query operation.
  ///
  /// > Notes: This function currently verifies whether a currency exists for a
  ///   specified user by checking the count of matching records in the
  ///   database. If no such currency exists, an error is thrown.
  ///   In future iterations, this function is planned to return detailed
  ///   information about the currency instead of returning nothing.
  func getCurrency(
    with id: Currency.IDValue,
    /*fields: [String],*/
    for userID: User.IDValue,
    on database: Database
  ) async throws /*-> (
    id: Currency.IDValue
  )*/ {
    do {
      let count = try await Currency.query(on: database)
        .filter(\.$id == id)
        .filter(\.$user.$id == userID)
        .count()

      if count <= 0 {
        throw Currency.Error.noSuchCurrency
      }
    } catch Currency.Error.noSuchCurrency {
      throw Currency.Error.noSuchCurrency
    } catch {
      throw Currency.Error.databaseError
    }
  }

  /// Retrieves a list of currencies associated with a specific user.
  ///
  /// - Parameters:
  ///   - userID: The unique identifier for the user whose currencies are
  ///     being retrieved.
  ///   - fields: An array of field names to determine which currency
  ///     attributes to include in the result. For example, passing
  ///     `["code"]` will include the currency code in the results.
  ///   - database: The database instance to query for the currencies.
  ///
  /// - Returns: An array of tuples, each containing:
  ///   - `id`: The unique identifier for the currency.
  ///   - `code`: The currency code, or `nil` if not requested in the
  ///     `fields`.
  ///
  /// - Throws:
  ///   - ``Currency.Error/databaseError`` if there is an error while
  ///     querying the database.
  func getCurrencies(
    for userID: User.IDValue,
    fields: [String],
    on database: Database
  ) async throws -> [(
    id: Currency.IDValue,
    code: String?
  )] {
    do {
      return try await Currency.query(on: database)
        .filter(\.$user.$id == userID)
        .all()
        .map { currency in (
          id: try currency.requireID(),
          code: fields.contains("code") ? currency.code : nil
        )}
    } catch {
      throw Currency.Error.databaseError
    }
  }
}
