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
      transactionCategoryID: TransactionCategory.IDValue?,
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
}
