//
//  ExpenseCategoryService.swift
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

struct ExpenseCategoryService {
  /// Adds a new expense category for a specific user.
  ///
  /// - Parameters:
  ///   - name: The name of the expense category to be added.
  ///   - userID: The user ID associated with the expense category.
  ///   - database: The database instance where the expense category will be
  ///     saved.
  ///
  /// - Returns: The ID of the newly created expense category.
  ///
  /// - Throws:
  ///   - ``ExpenseCategory.Error/databaseError`` if the category cannot be
  ///     saved in the database.
  func addExpenseCategory(
    name: String,
    for userID: User.IDValue,
    on database: Database
  ) async throws -> ExpenseCategory.IDValue {
    let expenseCategory = ExpenseCategory(
      name: name,
      userID: userID
    )

    do {
      try await expenseCategory.save(on: database)

      return try expenseCategory.requireID()
    } catch {
      throw ExpenseCategory.Error.databaseError
    }
  }

  /// Retrieves the expense category for a specific user.
  ///
  /// - Parameters:
  ///   - id: The identifier of the expense category to be retrieved.
  ///   - userID: The user ID for which expense category are being retrieved.
  ///   - fields: An array of field names to determine which attributes to
  ///     include in the response.
  ///   - database: The database instance from which to fetch the expense
  ///     category.
  ///
  /// - Returns: A tuple containing the detail (if requested) of the expense
  ///   category.
  ///
  /// - Throws:
  ///   - ``ExpenseCategory.Error/databaseError`` if the operation fails to
  ///     retrieve categories from the database.
  ///   - ``ExpenseCategory.Error/noSuchExpenseCategory`` if no expense category
  ///     with the specified ID exists for the given user.
  func getExpenseCategory(
    with id: ExpenseCategory.IDValue,
    fields: [String],
    for userID: User.IDValue,
    on database: Database
  ) async throws -> /*(*/
    /*userID: */User.IDValue?
  /*)*/ {
    do {
      guard let expenseCategory = try await ExpenseCategory.query(on: database)
        .filter(\.$id == id)
        .filter(\.$user.$id == userID)
        .first()
      else {
        throw ExpenseCategory.Error.noSuchExpenseCategory
      }

      return fields.contains("userID") ? expenseCategory.$user.id : nil
    } catch ExpenseCategory.Error.noSuchExpenseCategory {
      throw ExpenseCategory.Error.noSuchExpenseCategory
    } catch {
      throw ExpenseCategory.Error.databaseError
    }
  }

  /// Retrieves expense categories for a specific user.
  ///
  /// - Parameters:
  ///   - userID: The user ID for which expense categories are being retrieved.
  ///   - fields: An array of field names to determine which attributes to
  ///     include in the response.
  ///   - database: The database instance from which to fetch the expense
  ///     categories.
  ///
  /// - Returns: An array of tuples, each containing the ID and the details
  ///   (if requested) of the corresponding expense category.
  ///
  /// - Throws:
  ///   - ``ExpenseCategory.Error/databaseError`` if the operation fails to
  ///     retrieve categories from the database.
  func getExpenseCategories(
    for userID: User.IDValue,
    fields: [String],
    on database: Database
  ) async throws -> [(
    id: ExpenseCategory.IDValue,
    name: String?
  )] {
    do {
      return try await ExpenseCategory.query(on: database)
        .filter(\.$user.$id == userID)
        .all()
        .map { expenseCategory in (
          id: try expenseCategory.requireID(),
          name: fields.contains("name") ? expenseCategory.name : nil
        )}
    } catch {
      throw ExpenseCategory.Error.databaseError
    }
  }
}
