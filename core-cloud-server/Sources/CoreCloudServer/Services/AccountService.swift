//
//  AccountService.swift
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

import Fluent
import Vapor

struct AccountService {
  /// Adds a new account to the database.
  ///
  /// - Parameters:
  ///   - title: The title of the account.
  ///   - subtitle: The subtitle or description of the account.
  ///   - number: The account number.
  ///   - type: The type of the account, represented by `Account.Type`.
  ///   - balance: The initial balance of the account.
  ///   - actualBalance: The actual balance that may differ from the initial
  ///     balance.
  ///   - logoURLs: A string containing URLs to logos associated with the
  ///     account.
  ///   - currencyID: The identifier for the currency associated with the
  ///     account.
  ///   - userID: The identifier for the user who owns the account.
  ///   - database: The database instance where the account will be saved.
  ///
  /// - Returns: The identifier of the newly created account.
  ///
  /// - Throws:
  ///   - ``Account.Error/databaseError`` if saving to the database fails.
  func addAccount(
    title: String,
    subtitle: String,
    number: String,
    type: Account.`Type`,
    balance: Int64,
    actualBalance: Int64,
    logoURLs: String,
    with currencyID: Currency.IDValue,
    for userID: User.IDValue,
    on database: Database
  ) async throws -> Account.IDValue {
    let account = Account(
      title: title,
      subtitle: subtitle,
      number: number,
      type: type.rawValue,
      balance: balance,
      actualBalance: actualBalance,
      logoURLs: logoURLs,
      currencyID: currencyID,
      userID: userID
    )

    do {
      try await account.save(on: database)

      return try account.requireID()
    } catch {
      throw Account.Error.databaseError
    }
  }

  /// Updates the account with the specified identifier.
  ///
  /// - Parameters:
  ///   - id: The identifier of the account to be updated.
  ///   - actualBalance: An optional new actual balance for the account. If
  ///     provided, this value will be updated.
  ///   - userID: The identifier of the user who owns the account.
  ///   - database: The database instance where the account information will be
  ///     updated.
  ///
  /// - Throws:
  ///   - ``Account.Error/databaseError`` if the update operation fails.
  func updateAccount(
    with id: Account.IDValue,
    actualBalance: Int64?,
    for userID: User.IDValue,
    on database: Database
  ) async throws {
    do {
      let query = Account.query(on: database)
        .filter(\.$id == id)
        .filter(\.$user.$id == userID)

      if let actualBalance {
        query.set(\.$actualBalance, to: actualBalance)
      }

      try await query.update()
    } catch {
      throw Account.Error.databaseError
    }
  }

  /// Retrieves account information for a specified user.
  ///
  /// - Parameters:
  ///   - id: The identifier of the account to be retrieved.
  ///   - fields: An array of strings specifying which fields to include in the
  ///     response.
  ///   - userID: The identifier of the user whose account is to be retrieved.
  ///   - database: The database instance from which to retrieve the accounts.
  ///
  /// - Returns: An array of tuples, each containing the following field(s):
  ///   - `currencyID`: The identifier of the currency, if requsted; otherwise,
  ///     `nil`.
  ///
  /// - Throws:
  ///   - ``Account.Error/databaseError`` if the retrieval operation fails.
  ///   - ``Account.Error/noSuchAccount`` if the account is not found.
  func getAccount(
    with id: Account.IDValue,
    fields: [String],
    for userID: User.IDValue,
    on database: Database
  ) async throws -> /*(*/
    /*currencyID: */Currency.IDValue?
  /*)*/ {
    do {
      guard let account = try await Account.query(on: database)
        .filter(\.$user.$id == userID)
        .first()
      else {
        throw Account.Error.noSuchAccount
      }

      return (
        /*currencyID: */(
          fields.contains("currencyID")
            ? account.$currency.id
            : nil
          )
      )
    } catch Account.Error.noSuchAccount {
      throw Account.Error.noSuchAccount
    } catch {
      throw Account.Error.databaseError
    }
  }

  /// Retrieves account information for a specified user.
  ///
  /// - Parameters:
  ///   - userID: The identifier of the user whose accounts are to be retrieved.
  ///   - fields: An array of strings specifying which fields to include in the
  ///     response. Possible fields include:
  ///       - "title": The account title.
  ///       - "subtitle": The account subtitle.
  ///       - "number": The account number.
  ///       - "type": The type of the account (as `Account.Type`).
  ///       - "balance": The account balance.
  ///       - "actualBalance": The actual balance of the account.
  ///       - "currencySymbol": The symbol of the currency associated with the
  ///         account.
  ///       - "currencySymbolPosition": The position of the currency symbol.
  ///   - database: The database instance from which to retrieve the accounts.
  ///
  /// - Returns: An array of tuples, each containing the following fields:
  ///   - `id`: The identifier of the account.
  ///   - `title`: The title of the account, if requested; otherwise, `nil`.
  ///   - `subtitle`: The subtitle of the account, if requested; otherwise,
  ///     `nil`.
  ///   - `number`: The account number, if requested; otherwise, `nil`.
  ///   - `type`: The type of the account, if requested; otherwise, `nil`.
  ///   - `balance`: The balance of the account, if requested; otherwise, `nil`.
  ///   - `actualBalance`: The actual balance of the account, if requested;
  ///     otherwise, `nil`.
  ///   - `currencySymbol`: The symbol of the currency, if requested; otherwise,
  ///     `nil.
  ///   - `currencySymbolPosition`: The position of the currency symbol, if
  ///     requested; otherwise, `nil`.
  ///   - `currencyMinorUnit`: The minor unit of the currency, if the balance or
  ///     the actual balance is requsted; otherwise, `nil`.
  ///
  /// - Throws:
  ///   ``Account.Error/databaseError`` if the retrieval operation fails.
  func getAccounts(
    for userID: User.IDValue,
    fields: [String],
    on database: Database
  ) async throws -> [(
    id: Account.IDValue,
    title: String?,
    subtitle: String?,
    number: String?,
    type: Account.`Type`?,
    balance: Int64?,
    actualBalance: Int64?,
    currencySymbol: String?,
    currencySymbolPosition: Currency.SymbolPosition?,
    currencyMinorUnit: Int64?
  )] {
    do {
      var query = Account.query(on: database)
        .filter(\.$user.$id == userID)

      if fields.contains("balance") ||
         fields.contains("actualBalance") ||
         fields.contains("currencySymbol") ||
         fields.contains("currencySymbolPosition") {
        query = query.with(\.$currency)
      }

      return try await query.all()
        .map { account in (
          id: try account.requireID(),
          title: fields.contains("title") ? account.title : nil,
          subtitle: fields.contains("subtitle") ? account.subtitle : nil,
          number: fields.contains("number") ? account.number : nil,
          type: fields.contains("type") ? .init(rawValue: account.type) : nil,
          balance: fields.contains("balance") ? account.balance : nil,
          actualBalance: (
            fields.contains("actualBalance")
              ? account.actualBalance
              : nil
            ),
          currencySymbol: (
            fields.contains("currencySymbol")
              ? account.currency.symbol
              : nil
          ),
          currencySymbolPosition: (
            fields.contains("currencySymbolPosition")
              ? .init(rawValue: account.currency.symbolPosition)
              : nil
          ),
          currencyMinorUnit: (
            fields.contains("balance") || fields.contains("actualBalance")
              ? account.currency.minorUnit
              : nil
          )
        )}
    } catch {
      throw Account.Error.databaseError
    }
  }
}
