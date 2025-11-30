//
//  TransactionService.swift
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

import Fluent
import Vapor

struct TransactionService {
  /// Adds multiple transactions for a specific user.
  ///
  /// This function takes an array of transaction data and persists them to the
  /// specified database within a single database transaction. If any part of
  /// the operation fails, it reverts all changes made in the database
  /// transaction.
  ///
  /// - Parameters:
  ///   - transactions: An array of tuples where each tuple contains the details
  ///     of a transaction.
  ///   - userID: The user ID for which the transactions are being added.
  ///   - database: The database instance where the transactions will be stored.
  ///
  /// - Throws:
  ///   - ``Transaction.Error/databaseError`` if the  operation fails to save
  ///     any of the transactions into the database.
  func addTransactions(
    transactions: [(
      description: String,
      date: Date,
      notes: String?,
      type: Transaction.`Type`,
      outAmount: Int64?,
      outRefund: Int64?,
      outFee: Int64?,
      outAccountID: Account.IDValue?,
      inAmount: Int64?,
      inAccountID: Account.IDValue?,
      transactionCategoryID: TransactionCategory.IDValue?
    )],
    for userID: User.IDValue,
    on database: Database
  ) async throws {
    do {
      try await database.transaction { transactionDatabase in
        try await transactions
          .map({ transaction in
            Transaction(
              description: transaction.description,
              date: transaction.date,
              notes: transaction.notes,
              type: transaction.type.rawValue,
              outAmount: transaction.outAmount,
              outRefund: transaction.outRefund,
              outFee: transaction.outFee,
              outAccountID: transaction.outAccountID,
              inAmount: transaction.inAmount,
              inAccountID: transaction.inAccountID,
              transactionCategoryID: transaction.transactionCategoryID,
              userID: userID
            )
          })
          .create(on: transactionDatabase)
      }
    } catch {
      throw Transaction.Error.databaseError
    }
  }

  /// Aggregates transaction amounts based on specified operations and filters.
  ///
  /// This function performs aggregation operations such as summing specified
  /// transaction fields for a specific user. It applies any filters provided to
  /// refine  the query results.
  ///
  /// - Parameters:
  ///   - operation: A string specifying the aggregation operation and the
  ///     transaction field to aggregate, separated by a comma.
  ///   - filters: An array of filter strings that specify conditions to refine
  ///     the transactions queried. Each filter should contain the field name
  ///     and value, separated by "_EQUALS_".
  ///   - userID: The user ID for which the transactions are being aggregated.
  ///   - database: The database instance on which to perform the query.
  ///
  /// - Returns: A tuple containing the aggregated results:
  ///   - `outAmount`: The total sum of outgoing amounts, if applicable.
  ///   - `outRefund`: The total sum of refunds, if applicable.
  ///   - `outFee`: The total sum of fees, if applicable.
  ///   - `inAmount`: The total sum of incoming amounts, if applicable.
  ///
  /// - Throws:
  ///   - ``Transaction.Error/databaseError`` if the  aggregation operation
  ///     fails to complete.
  func aggregateTransactions(
    operation: String,
    filters: [String],
    for userID: User.IDValue,
    on database: Database
  ) async throws -> (
    outAmount: Int64?,
    outRefund: Int64?,
    outFee: Int64?,
    inAmount: Int64?
  ) {
    do {
      var result: (
        outAmount: Int64?,
        outRefund: Int64?,
        outFee: Int64?,
        inAmount: Int64?
      ) = (
        nil,
        nil,
        nil,
        nil
      )

      var query = Transaction.query(on: database).filter(\.$user.$id == userID)

      for filter in filters {
        if filter.contains("_EQUALS_") {
          let entry = filter.components(separatedBy: "_EQUALS_")
          if entry.count < 2 {
            continue
          }

          if entry[0] == "type", let type = Int64(entry[1]) {
            query = query.filter(\.$type == type)
          } else if entry[0] == "outAccountID", let id = Int64(entry[1]) {
            query = query.filter(\.$outAccount.$id == id)
          } else if entry[0] == "inAccountID", let id = Int64(entry[1]) {
            query = query.filter(\.$inAccount.$id == id)
          }
        }
      }

      if operation.contains(",") {
        let entry = operation.components(separatedBy: ",")
        if entry.count >= 2 {
          if entry[0] == "SUM" {
            if entry[1] == "outAmount" {
              result.outAmount = try await query.sum(\.$outAmount)
            } else if entry[1] == "outRefund" {
              result.outRefund = try await query.sum(\.$outRefund)
            } else if entry[1] == "outFee" {
              result.outFee = try await query.sum(\.$outFee)
            } else if entry[1] == "inAmount" {
              result.inAmount = try await query.sum(\.$inAmount)
            }
          }
        }
      }

      return result
    } catch {
      throw Transaction.Error.databaseError
    }
  }

  /// Fetches transactions for a specified user from the database, applying the
  /// given fields and filters.
  ///
  /// - Parameters:
  ///   - userID: The unique identifier of the user whose transactions are being
  ///     fetched.
  ///   - fields: An array of strings representing the fields to be included in
  ///     the transaction results.
  ///   - filters: An array of strings used to filter the results based on
  ///     specific criteria.
  ///   - database: The database instance to query transactions from.
  ///
  /// - Returns: An array of tuples containing transaction details.
  ///
  /// - Throws:
  ///   - ``Transaction.Error/databaseError`` if there is a problem querying the
  ///     database.
  func getTransactions(
    for userID: User.IDValue,
    fields: [String],
    filters: [String],
    on database: Database
  ) async throws -> [(
    id: Transaction.IDValue,
    description: String?,
    date: Date?,
    type: Transaction.`Type`?,
    outAmount: Int64?,
    outCurrencySymbol: String?,
    outCurrencySymbolPosition: Currency.SymbolPosition?,
    outCurrencyMinorUnit: Int64?,
    inAmount: Int64?,
    inCurrencySymbol: String?,
    inCurrencySymbolPosition: Currency.SymbolPosition?,
    inCurrencyMinorUnit: Int64?,
    transactionCategoryName: String?
  )] {
    do {
      var query = Transaction.query(on: database).filter(\.$user.$id == userID)

      if (
        fields.contains("outAmount") ||
        fields.contains("outCurrencySymbol") ||
        fields.contains("outCurrencySymbolPosition")
      ) {
        query = query.with(\.$outAccount) { account in
          account.with(\.$currency)
        }
      }

      if (
        fields.contains("inAmount") ||
        fields.contains("inCurrencySymbol") ||
        fields.contains("inCurrencySymbolPosition")
      ) {
        query = query.with(\.$inAccount) { account in
          account.with(\.$currency)
        }
      }

      if fields.contains("transactionCategoryName") {
        query = query.with(\.$transactionCategory)
      }

      for filter in filters {
        if filter.contains("_CONTAINS_") {
          let entry = filter.components(separatedBy: "_CONTAINS_")
          if entry.count < 2 {
            continue
          }

          if entry[0] == "description" {
            query = query.filter(\.$description ~~ entry[1])
          }
        } else if filter.contains("_EQUALS_") {
          let entry = filter.components(separatedBy: "_EQUALS_")
          if entry.count < 2 {
            continue
          }

          if entry[0] == "type", let type = Int64(entry[1]) {
            query = query.filter(\.$type == type)
          }
        }
      }

      return try await query.sort(\.$date, .descending).all()
        .map { transaction in
          let type: Transaction.`Type`? = .init(rawValue: transaction.type)

          return (
            id: try transaction.requireID(),
            description: (
              fields.contains("description") ? transaction.description : nil
            ),
            date: fields.contains("date") ? transaction.date : nil,
            type: (
              fields.contains("type") ? type : nil
            ),
            outAmount: (
              fields.contains("outAmount") && type != nil && type != .income
                ? type == .transfer
                  ? transaction.outAmount
                  : (
                    (transaction.outAmount ?? 0) -
                    (transaction.outRefund ?? 0) +
                    (transaction.outFee ?? 0)
                  )
                : nil
            ),
            outCurrencySymbol: (
              fields.contains("outCurrencySymbol")
                ? transaction.outAccount?.currency.symbol
                : nil
            ),
            outCurrencySymbolPosition: (
              fields.contains("outCurrencySymbolPosition")
                ? .init(
                  rawValue: transaction.outAccount?.currency.symbolPosition ?? 9
                )
                : nil
            ),
            outCurrencyMinorUnit: (
              fields.contains("outAmount")
                ? transaction.outAccount?.currency.minorUnit
                : nil
            ),
            inAmount: (
              fields.contains("inAmount") && type != nil && type != .expense
                ? transaction.inAmount
                : nil
            ),
            inCurrencySymbol: (
              fields.contains("inCurrencySymbol")
                ? transaction.inAccount?.currency.symbol
                : nil
            ),
            inCurrencySymbolPosition: (
              fields.contains("inCurrencySymbolPosition")
                ? .init(
                  rawValue: transaction.inAccount?.currency.symbolPosition ?? 99
                )
                : nil
            ),
            inCurrencyMinorUnit: (
              fields.contains("inAmount")
                ? transaction.inAccount?.currency.minorUnit
                : nil
            ),
            transactionCategoryName: (
              fields.contains("transactionCategoryName")
                ? transaction.transactionCategory?.name
                : nil
            )
          )
        }
    } catch {
      throw Transaction.Error.databaseError
    }
  }
}
