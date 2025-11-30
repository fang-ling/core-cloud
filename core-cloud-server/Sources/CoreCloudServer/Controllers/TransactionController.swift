//
//  TransactionController.swift
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

struct TransactionController: RouteCollection {
  let accountService = AccountService()
  let currencyService = CurrencyService()
  let transactionService = TransactionService()
  let transactionCategoryService = TransactionCategoryService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("transactions")
      .grouped(AuthenticatorMiddleware())
      .on(
        .POST,
        body: .collect(maxSize: "16mb"),
        use: insertTransactionsHandler
      )

    routes
      .grouped("api")
      .grouped("transactions")
      .grouped(AuthenticatorMiddleware())
      .get(use: fetchTransactionsHandler)
  }

  func insertTransactionsHandler(request: Request) async -> HTTPStatus {
    guard let userID = request.userID else {
      return .unauthorized
    }

    guard let input = try? request.content.decode(
      [Transaction.Plural.Input.Insertion].self
    ) else {
      return .badRequest
    }

    var transactions: [(
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
    )] = []
    for transaction in input {
      guard let type: Transaction.`Type` = .init(
        rawValue: transaction.type
      ) else {
        return .badRequest
      }

      var categoryType: TransactionCategory.`Type`? = nil
      if let categoryID = transaction.transactionCategoryID {
        do {
          let category = try await transactionCategoryService
            .getTransactionCategory(
              with: categoryID,
              fields: ["type"],
              for: userID,
              on: request.db
            )
          categoryType = category.type
        } catch TransactionCategory.Error.databaseError {
          return .serviceUnavailable
        } catch TransactionCategory.Error.noSuchTransactionCategory {
          let idDescription = "id = \(categoryID), userID = \(userID)"
          request.logger.notice(
            "TransactionCategory with \(idDescription) can not be found."
          )
          return .badRequest
        } catch {
          return .internalServerError
        }
      }

      switch type {
      case .expense:
        if transaction.outAmount == nil ||
           transaction.outRefund == nil ||
           transaction.outFee == nil ||
           transaction.outAccountID == nil ||
           transaction.inAmount != nil ||
           transaction.inAccountID != nil ||
           categoryType != .expense {
          request.logger.notice("Invalid expense found: \(transaction)")
          return .badRequest
        }

      case .income:
        if transaction.outAmount != nil ||
           transaction.outRefund != nil ||
           transaction.outFee != nil ||
           transaction.outAccountID != nil ||
           transaction.inAmount == nil ||
           transaction.inAccountID == nil ||
           categoryType != .income {
          request.logger.notice("Invalid income found: \(transaction)")
          return .badRequest
        }

      case .transfer:
        if transaction.outAmount == nil ||
           transaction.outRefund != nil ||
           transaction.outFee != nil ||
           transaction.outAccountID == nil ||
           transaction.inAmount == nil ||
           transaction.inAccountID == nil ||
           categoryType != nil {
          request.logger.notice("Invalid transfer found: \(transaction)")
          return .badRequest
        }
      }

      var outMinorUnit: Int64? = nil
      if let outAccountID = transaction.outAccountID {
        do {
          guard let currencyID = try await accountService.getAccount(
            with: outAccountID,
            fields: ["currencyID"],
            for: userID,
            on: request.db
          ) else {
            throw Account.Error.noSuchAccount
          }

          guard let minorUnit = try await currencyService.getCurrency(
            with: currencyID,
            fields: ["minorUnit"],
            for: userID,
            on: request.db
          ) else {
            throw Currency.Error.noSuchCurrency
          }

          outMinorUnit = minorUnit
        } catch Account.Error.noSuchAccount {
          let idDescription = "id = \(outAccountID), userID = \(userID)"
          request.logger.notice(
            "Account with \(idDescription) can not be found."
          )
          return .badRequest
        } catch Account.Error.databaseError {
          return .serviceUnavailable
        } catch Currency.Error.noSuchCurrency {
          let idDescription = "accountID = \(outAccountID), userID = \(userID)"
          request.logger.notice(
            "Currency with \(idDescription) can not be found."
          )
          return .badRequest
        } catch Currency.Error.databaseError {
          return .serviceUnavailable
        } catch {
          return .internalServerError
        }
      }

      var inMinorUnit: Int64? = nil
      if let inAccountID = transaction.inAccountID {
        do {
          guard let currencyID = try await accountService.getAccount(
            with: inAccountID,
            fields: ["currencyID"],
            for: userID,
            on: request.db
          ) else {
            throw Account.Error.noSuchAccount
          }

          guard let minorUnit = try await currencyService.getCurrency(
            with: currencyID,
            fields: ["minorUnit"],
            for: userID,
            on: request.db
          ) else {
            throw Currency.Error.noSuchCurrency
          }

          inMinorUnit = minorUnit
        } catch Account.Error.noSuchAccount {
          let idDescription = "id = \(inAccountID), userID = \(userID)"
          request.logger.notice(
            "Account with \(idDescription) can not be found."
          )
          return .badRequest
        } catch Account.Error.databaseError {
          return .serviceUnavailable
        } catch Currency.Error.noSuchCurrency {
          let idDescription = "accountID = \(inAccountID), userID = \(userID)"
          request.logger.notice(
            "Currency with \(idDescription) can not be found."
          )
          return .badRequest
        } catch Currency.Error.databaseError {
          return .serviceUnavailable
        } catch {
          return .internalServerError
        }
      }

      transactions.append((
        description: transaction.description,
        date: Date(timeIntervalSince1970: Double(transaction.date) / 1000),
        notes: transaction.notes,
        type: type,
        outAmount: (
          transaction.outAmount != nil && outMinorUnit != nil
            ? Int64(
              (
                (Decimal(string: transaction.outAmount!) ?? 0) *
                Decimal(outMinorUnit!)
              ).description
            )
            : nil
        ),
        outRefund: (
          transaction.outRefund != nil && outMinorUnit != nil
            ? Int64(
              (
                (Decimal(string: transaction.outRefund!) ?? 0) *
                Decimal(outMinorUnit!)
              ).description
            )
            : nil
        ),
        outFee: (
          transaction.outFee != nil && outMinorUnit != nil
            ? Int64(
              (
                (Decimal(string: transaction.outFee!) ?? 0) *
                Decimal(outMinorUnit!)
              ).description
            )
            : nil
        ),
        outAccountID: transaction.outAccountID,
        inAmount: (
          transaction.inAmount != nil && inMinorUnit != nil
            ? Int64(
              (
                (Decimal(string: transaction.inAmount!) ?? 0) *
                Decimal(inMinorUnit!)
              ).description
            )
            : nil
        ),
        inAccountID: transaction.inAccountID,
        transactionCategoryID: transaction.transactionCategoryID
      ))
    }

    do {
      try await transactionService.addTransactions(
        transactions: transactions,
        for: userID,
        on: request.db
      )

      return .created
    } catch Transaction.Error.databaseError {
      return .serviceUnavailable
    } catch {
      return .internalServerError
    }
  }

  func fetchTransactionsHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return .init(status: .unauthorized)
    }

    guard let input = try? request.query.decode(
      Transaction.Plural.Input.Retrieval.self
    ) else {
      return .init(status: .badRequest)
    }

    do {
      let transactions = try await transactionService.getTransactions(
        for: userID,
        fields: input.fields?.components(separatedBy: ",") ?? [],
        filters: input.filters?.components(separatedBy: ",") ?? [],
        on: request.db
      )

      return try .init(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(
          data: CoreCloudServer.encoder.encode(
            transactions.map { transaction in
              Transaction.Plural.Output.Retrieval(
                id: transaction.id,
                description: transaction.description,
                date: (
                  transaction.date != nil
                    ? Int64(transaction.date!.timeIntervalSince1970 * 1000)
                    : nil
                ),
                type: transaction.type?.rawValue,
                outAmount: (
                  (
                    transaction.outAmount != nil &&
                    transaction.outCurrencyMinorUnit != nil
                  )
                    ? (
                      Decimal(transaction.outAmount!) /
                      Decimal(transaction.outCurrencyMinorUnit!)
                    ).description
                    : nil
                ),
                outCurrencySymbol: transaction.outCurrencySymbol,
                outCurrencySymbolPosition: (
                  transaction.outCurrencySymbolPosition?.rawValue
                ),
                inAmount: (
                  (
                    transaction.inAmount != nil &&
                    transaction.inCurrencyMinorUnit != nil
                  )
                    ? (
                      Decimal(transaction.inAmount!) /
                      Decimal(transaction.inCurrencyMinorUnit!)
                    ).description
                    : nil
                ),
                inCurrencySymbol: transaction.inCurrencySymbol,
                inCurrencySymbolPosition: (
                  transaction.inCurrencySymbolPosition?.rawValue
                ),
                transactionCategoryName: transaction.transactionCategoryName
              )
            }
          )
        )
      )
    } catch Transaction.Error.databaseError {
      return .init(status: .serviceUnavailable)
    } catch {
      return .init(status: .internalServerError)
    }
  }
}
