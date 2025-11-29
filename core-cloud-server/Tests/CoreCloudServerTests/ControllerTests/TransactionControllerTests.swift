//
//  TransactionControllerTests.swift
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

@testable import CoreCloudServer
import Testing
import VaporTesting

extension Transaction.Plural.Input.Insertion: Content { }

extension ControllerTests {
  @Test("TransactionControllerTests")
  func testTransactionController() async throws {
    try await withApp(configure: CoreCloudServer.configure) { app in
      try await app.testing().test(
        .POST,
        "api/transactions",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .GET,
        "api/transactions",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .POST,
        "api/user",
        beforeRequest: { request async throws in
          try request.content.encode(
            User.Singular.Input.Insertion(
              firstName: "Tracy",
              lastName: "Tang",
              username: "tracy@example.com",
              password: "19342Top-Secret",
              masterPassword: "Top--1-Secret"
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      var cookie: HTTPCookies.Value?
      try await app.testing().test(
        .POST,
        "api/user-token",
        beforeRequest: { request async throws in
          request.headers.basicAuthorization = .init(
            username: "tracy@example.com",
            password: "19342Top-Secret"
          )
          try request.content.encode(
            UserToken.Singular.Input.Insertion(rememberMe: false)
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)

          cookie = response
            .headers
            .setCookie?
            .all[CoreCloudServer.Cookie.Keys.jwt]
          #expect(cookie?.string != nil)
          #expect(cookie?.path == "/")
          #expect(cookie?.maxAge == nil)
          #expect(cookie?.isHTTPOnly == true)
        }
      )

      try await app.testing().test(
        .POST,
        "api/currency",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )
          try request.content.encode(
            Currency.Singular.Input.Insertion(
              code: "USD",
              minorUnit: 100,
              symbol: "$",
              symbolPosition: 0
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)

          let currencyIDOutput = try response.content.decode(
            Currency.Singular.Output.Insertion.self
          )
          #expect(currencyIDOutput.id == 1)
        }
      )

      try await app.testing().test(
        .POST,
        "api/account",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: Account.`Type` = .asset
          try request.content.encode(
            Account.Singular.Input.Insertion(
              title: "Chase Bank",
              subtitle: "Checking",
              number: "123456789",
              type: type.rawValue,
              balance: "0",
              actualBalance: "0",
              logoURLs: "https://example.com/1.png",
              currencyID: 1
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .POST,
        "api/transactions",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: Transaction.`Type` = .expense
          try request.content.encode([
            Transaction.Plural.Input.Insertion(
              description: "Restaurant",
              date: Int64(Date().timeIntervalSince1970 * 1000),
              notes: "",
              type: type.rawValue,
              outAmount: nil,
              outRefund: nil,
              outFee: nil,
              outAccountID: nil,
              inAmount: "123",
              inAccountID: 2,
              transactionCategoryID: nil
            )
          ])
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .POST,
        "api/transactions",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: Transaction.`Type` = .expense
          try request.content.encode([
            Transaction.Plural.Input.Insertion(
              description: "Restaurant",
              date: Int64(Date().timeIntervalSince1970 * 1000),
              notes: "",
              type: type.rawValue,
              outAmount: "193.58",
              outRefund: nil,
              outFee: nil,
              outAccountID: nil,
              inAmount: "123",
              inAccountID: 2,
              transactionCategoryID: nil
            )
          ])
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .POST,
        "api/transactions",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: Transaction.`Type` = .expense
          try request.content.encode([
            Transaction.Plural.Input.Insertion(
              description: "Restaurant",
              date: Int64(Date().timeIntervalSince1970 * 1000),
              notes: "",
              type: type.rawValue,
              outAmount: "193.58",
              outRefund: "123.33",
              outFee: nil,
              outAccountID: nil,
              inAmount: "123",
              inAccountID: 2,
              transactionCategoryID: nil
            )
          ])
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .POST,
        "api/transactions",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: Transaction.`Type` = .expense
          try request.content.encode([
            Transaction.Plural.Input.Insertion(
              description: "Restaurant",
              date: Int64(Date().timeIntervalSince1970 * 1000),
              notes: "",
              type: type.rawValue,
              outAmount: "193.58",
              outRefund: "123.33",
              outFee: "193.48",
              outAccountID: nil,
              inAmount: "123",
              inAccountID: 2,
              transactionCategoryID: nil
            )
          ])
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .POST,
        "api/transactions",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: Transaction.`Type` = .expense
          try request.content.encode([
            Transaction.Plural.Input.Insertion(
              description: "Restaurant",
              date: Int64(Date().timeIntervalSince1970 * 1000),
              notes: "",
              type: type.rawValue,
              outAmount: "193.58",
              outRefund: "123.33",
              outFee: "193.48",
              outAccountID: 1,
              inAmount: "123",
              inAccountID: 2,
              transactionCategoryID: nil
            )
          ])
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .POST,
        "api/transactions",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: Transaction.`Type` = .expense
          try request.content.encode([
            Transaction.Plural.Input.Insertion(
              description: "Restaurant",
              date: Int64(Date().timeIntervalSince1970 * 1000),
              notes: "",
              type: type.rawValue,
              outAmount: "193.58",
              outRefund: "123.33",
              outFee: "193.48",
              outAccountID: 1,
              inAmount: nil,
              inAccountID: 2,
              transactionCategoryID: nil
            )
          ])
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .POST,
        "api/transactions",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: Transaction.`Type` = .expense
          try request.content.encode([
            Transaction.Plural.Input.Insertion(
              description: "Restaurant",
              date: Int64(Date().timeIntervalSince1970 * 1000),
              notes: "",
              type: type.rawValue,
              outAmount: "193.58",
              outRefund: "123.33",
              outFee: "193.48",
              outAccountID: 1,
              inAmount: nil,
              inAccountID: nil,
              transactionCategoryID: nil
            )
          ])
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .POST,
        "api/transaction-category",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: TransactionCategory.`Type` = .expense
          try request.content.encode(
            TransactionCategory.Singular.Input.Insertion(
              name: "Food & Drinks",
              type: type.rawValue
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)

          let categoryIDOutput = try response.content.decode(
            TransactionCategory.Singular.Output.Insertion.self
          )
          #expect(categoryIDOutput.id == 1)
        }
      )

      try await app.testing().test(
        .POST,
        "api/transactions",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: Transaction.`Type` = .expense
          try request.content.encode([
            Transaction.Plural.Input.Insertion(
              description: "Restaurant",
              date: Int64(Date().timeIntervalSince1970 * 1000),
              notes: "",
              type: type.rawValue,
              outAmount: "193.58",
              outRefund: "123.33",
              outFee: "193.48",
              outAccountID: 1,
              inAmount: nil,
              inAccountID: nil,
              transactionCategoryID: 1
            )
          ])
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .POST,
        "api/transactions",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: Transaction.`Type` = .income
          try request.content.encode([
            Transaction.Plural.Input.Insertion(
              description: "Paycheck",
              date: Int64(Date().timeIntervalSince1970 * 1000),
              notes: "",
              type: type.rawValue,
              outAmount: nil,
              outRefund: nil,
              outFee: nil,
              outAccountID: nil,
              inAmount: "193.46",
              inAccountID: 1,
              transactionCategoryID: 1
            )
          ])
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .POST,
        "api/transaction-category",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: TransactionCategory.`Type` = .income
          try request.content.encode(
            TransactionCategory.Singular.Input.Insertion(
              name: "Salary",
              type: type.rawValue
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)

          let categoryIDOutput = try response.content.decode(
            TransactionCategory.Singular.Output.Insertion.self
          )
          #expect(categoryIDOutput.id == 2)
        }
      )

      try await app.testing().test(
        .POST,
        "api/transactions",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: Transaction.`Type` = .income
          try request.content.encode([
            Transaction.Plural.Input.Insertion(
              description: "Paycheck",
              date: Int64(Date().timeIntervalSince1970 * 1000),
              notes: "",
              type: type.rawValue,
              outAmount: nil,
              outRefund: nil,
              outFee: nil,
              outAccountID: nil,
              inAmount: "193.46",
              inAccountID: 1,
              transactionCategoryID: 2
            )
          ])
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .POST,
        "api/transactions",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: Transaction.`Type` = .transfer
          try request.content.encode([
            Transaction.Plural.Input.Insertion(
              description: "Money laundering",
              date: Int64(Date().timeIntervalSince1970 * 1000),
              notes: "",
              type: type.rawValue,
              outAmount: "193.46",
              outRefund: nil,
              outFee: nil,
              outAccountID: 1,
              inAmount: "193.46",
              inAccountID: 1,
              transactionCategoryID: 2
            )
          ])
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .POST,
        "api/transactions",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: Transaction.`Type` = .transfer
          try request.content.encode([
            Transaction.Plural.Input.Insertion(
              description: "Money laundering",
              date: Int64(Date().timeIntervalSince1970 * 1000),
              notes: "",
              type: type.rawValue,
              outAmount: "193.46",
              outRefund: "193.24",
              outFee: nil,
              outAccountID: 1,
              inAmount: "193.46",
              inAccountID: 1,
              transactionCategoryID: nil
            )
          ])
        },
        afterResponse: { response async throws in
          #expect(response.status == .badRequest)
        }
      )

      try await app.testing().test(
        .POST,
        "api/transactions",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          let type: Transaction.`Type` = .transfer
          try request.content.encode([
            Transaction.Plural.Input.Insertion(
              description: "Money laundering",
              date: 1764362098000,
              notes: "",
              type: type.rawValue,
              outAmount: "193.46",
              outRefund: nil,
              outFee: nil,
              outAccountID: 1,
              inAmount: "193.46",
              inAccountID: 1,
              transactionCategoryID: nil
            )
          ])
        },
        afterResponse: { response async throws in
          #expect(response.status == .created)
        }
      )

      try await app.testing().test(
        .GET,
        "api/transactions",
        beforeRequest: { request in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )
        },
        afterResponse: { response in
          let transactions = try response.content.decode(
            [Transaction.Plural.Output.Retrieval].self
          )
          #expect(transactions.count == 3)
        }
      )

      try await app.testing().test(
        .GET,
        "api/transactions?filters=type_EQUALS_2&fields=date",
        beforeRequest: { request in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )
        },
        afterResponse: { response in
          let transactions = try response.content.decode(
            [Transaction.Plural.Output.Retrieval].self
          )
          #expect(transactions.count == 1)
          #expect(transactions.first?.date == 1764362098000)
        }
      )
    }
  }
}
