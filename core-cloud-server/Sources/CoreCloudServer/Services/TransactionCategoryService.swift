//
//  TransactionCategoryService.swift
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

struct TransactionCategoryService {
  /// Adds a new transaction category for a specific user.
  ///
  /// - Parameters:
  ///   - name: The name of the transaction category to be added.
  ///   - userID: The user ID associated with the transaction category.
  ///   - database: The database instance where the transaction category will be
  ///     saved.
  ///
  /// - Returns: The ID of the newly created transaction category.
  ///
  /// - Throws:
  ///   - ``TransactionCategory.Error/databaseError`` if the category cannot be
  ///     saved in the database.
  func addTransactionCategory(
    name: String,
    type: TransactionCategory.`Type`,
    for userID: User.IDValue,
    on database: Database
  ) async throws -> TransactionCategory.IDValue {
    let transactionCategory = TransactionCategory(
      name: name,
      type: type.rawValue,
      userID: userID
    )

    do {
      try await transactionCategory.save(on: database)

      return try transactionCategory.requireID()
    } catch {
      throw TransactionCategory.Error.databaseError
    }
  }

  /// Retrieves the transaction category for a specific user.
  ///
  /// - Parameters:
  ///   - id: The identifier of the transaction category to be retrieved.
  ///   - userID: The user ID for which transaction category are being
  ///     retrieved.
  ///   - fields: An array of field names to determine which attributes to
  ///     include in the response.
  ///   - database: The database instance from which to fetch the transaction
  ///     category.
  ///
  /// - Returns: A tuple containing the detail (if requested) of the transaction
  ///   category.
  ///
  /// - Throws:
  ///   - ``TransactionCategory.Error/databaseError`` if the operation fails to
  ///     retrieve categories from the database.
  ///   - ``TransactionCategory.Error/noSuchTransactionCategory`` if no
  ///     transaction category with the specified ID exists for the given user.
  func getTransactionCategory(
    with id: TransactionCategory.IDValue,
    fields: [String],
    for userID: User.IDValue,
    on database: Database
  ) async throws -> (
    type: TransactionCategory.`Type`?,
    userID: User.IDValue?
  ) {
    do {
      guard let category = try await TransactionCategory.query(on: database)
        .filter(\.$id == id)
        .filter(\.$user.$id == userID)
        .first()
      else {
        throw TransactionCategory.Error.noSuchTransactionCategory
      }

      return (
        type: (
          fields.contains("type")
           ? .init(rawValue: category.type)
           : nil
        ),
        userID: fields.contains("userID") ? category.$user.id : nil
      )
    } catch TransactionCategory.Error.noSuchTransactionCategory {
      throw TransactionCategory.Error.noSuchTransactionCategory
    } catch {
      throw TransactionCategory.Error.databaseError
    }
  }

  /// Retrieves transaction categories for a specific user.
  ///
  /// - Parameters:
  ///   - userID: The user ID for which transaction categories are being
  ///     retrieved.
  ///   - filters: The filter rules to apply during the retrieval query.
  ///   - fields: An array of field names to determine which attributes to
  ///     include in the response.
  ///   - database: The database instance from which to fetch the transaction
  ///     categories.
  ///
  /// - Returns: An array of tuples, each containing the ID and the details
  ///   (if requested) of the corresponding transaction category.
  ///
  /// - Throws:
  ///   - ``TransactionCategory.Error/databaseError`` if the operation fails to
  ///     retrieve categories from the database.
  func getTransactionCategories(
    for userID: User.IDValue,
    filters: [String],
    fields: [String],
    on database: Database
  ) async throws -> [(
    id: TransactionCategory.IDValue,
    name: String?
  )] {
    do {
      var query = TransactionCategory.query(on: database)
        .filter(\.$user.$id == userID)

      for filter in filters {
        if filter.contains("_EQUALS_") {
          let entry = filter.components(separatedBy: "_EQUALS_")
          if entry.count < 2 {
            continue
          }

          if entry[0] == "type", let type = Int64(entry[1]) {
            query = query.filter(\.$type == type)
          }
        }
      }

      return try await query.all().map { transactionCategory in (
        id: try transactionCategory.requireID(),
        name: fields.contains("name") ? transactionCategory.name : nil
      )}
    } catch {
      throw TransactionCategory.Error.databaseError
    }
  }
}
