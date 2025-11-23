//
//  TransactionCategoryController.swift
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

struct TransactionCategoryController: RouteCollection {
  let transactionCategoryService = TransactionCategoryService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("transaction-category")
      .grouped(AuthenticatorMiddleware())
      .post(use: insertTransactionCategoryHandler)

    routes
      .grouped("api")
      .grouped("transaction-categories")
      .grouped(AuthenticatorMiddleware())
      .get(use: fetchTransactionCategoriesHandler)
  }

  func insertTransactionCategoryHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return .init(status: .unauthorized)
    }

    guard
      let input = try? request.content.decode(
        TransactionCategory.Singular.Input.Insertion.self
      ),
      let type: TransactionCategory.`Type` = .init(
        rawValue: input.type
      )
    else {
      return .init(status: .badRequest)
    }

    do {
      let id = try await transactionCategoryService.addTransactionCategory(
        name: input.name,
        type: type,
        for: userID,
        on: request.db
      )

      return try .init(
        status: .created,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            TransactionCategory.Singular.Output.Insertion(id: id)
          )
        )
      )
    } catch TransactionCategory.Error.databaseError {
      return .init(status: .serviceUnavailable)
    } catch {
      return .init(status: .internalServerError)
    }
  }

  func fetchTransactionCategoriesHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return .init(status: .unauthorized)
    }

    guard let input = try? request.query.decode(
      TransactionCategory.Plural.Input.Retrieval.self
    ) else {
      return .init(status: .badRequest)
    }

    do {
      let categories = try await transactionCategoryService
        .getTransactionCategories(
          for: userID,
          filters: input.filters.components(separatedBy: ","),
          fields: input.fields.components(separatedBy: ","),
          on: request.db
        )

      return try .init(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            categories.map { category in
              TransactionCategory.Plural.Output.Retrieval(
                id: category.id,
                name: category.name
              )
            }
          )
        )
      )
    } catch TransactionCategory.Error.databaseError {
      return .init(status: .serviceUnavailable)
    } catch {
      return .init(status: .internalServerError)
    }
  }
}
