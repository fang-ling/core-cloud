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
}
