//
//  TransactionServiceTests.swift
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
import Fluent
import Testing
import VaporTesting

extension ServiceTests {
  @Suite("TransactionServiceTests")
  struct TransactionServiceTests {
    @Test
    func testAddTransactions() async throws {
      let transactionService = TransactionService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: Transaction.Error.databaseError) {
          try await transactionService.addTransactions(
            transactions: [(
              description: "Restaurant",
              date: Date(),
              notes: "",
              type: .expense,
              outAmount: 19358,
              outRefund: 12333,
              outFee: 19348,
              outAccountID: 1,
              inAmount: nil,
              inAccountID: nil,
              transactionCategoryID: 1
            )],
            for: 1,
            on: app.db
          )
        }

        let eva = User(
          firstName: "Eva",
          lastName: "Chan",
          username: "eva@example.com",
          key: Data(),
          salt: Data(),
          masterKeySealedBox: Data(),
          masterKeySealedBoxSalt: Data(),
          avatarURLs: "https://example.com/1.png"
        )
        try await eva.save(on: app.db)

        await #expect(throws: Transaction.Error.databaseError) {
          try await transactionService.addTransactions(
            transactions: [(
              description: "Restaurant",
              date: Date(),
              notes: "",
              type: .expense,
              outAmount: 19358,
              outRefund: 12333,
              outFee: 19348,
              outAccountID: 1,
              inAmount: nil,
              inAccountID: nil,
              transactionCategoryID: 1
            )],
            for: eva.requireID(),
            on: app.db
          )
        }

        let currency = try Currency(
          code: "USD",
          minorUnit: 100,
          symbol: "$",
          symbolPosition: 0,
          userID: eva.requireID()
        )
        try await currency.save(on: app.db)

        let account = try Account(
          title: "Chase Bank",
          subtitle: "Checking",
          number: "123456789",
          type: 0,
          balance: 0,
          actualBalance: 0,
          logoURLs: "https://example.com/1.png",
          currencyID: currency.requireID(),
          userID: eva.requireID()
        )
        try await account.save(on: app.db)

        await #expect(throws: Transaction.Error.databaseError) {
          try await transactionService.addTransactions(
            transactions: [(
              description: "Restaurant",
              date: Date(),
              notes: "",
              type: .expense,
              outAmount: 19358,
              outRefund: 12333,
              outFee: 19348,
              outAccountID: account.requireID(),
              inAmount: nil,
              inAccountID: nil,
              transactionCategoryID: 1
            )],
            for: eva.requireID(),
            on: app.db
          )
        }

        let category = try TransactionCategory(
          name: "Food & Drinks",
          type: 0,
          userID: eva.requireID()
        )
        try await category.save(on: app.db)

        try await transactionService.addTransactions(
          transactions: [(
            description: "Restaurant",
            date: Date(),
            notes: "",
            type: .expense,
            outAmount: 19358,
            outRefund: 12333,
            outFee: 19348,
            outAccountID: account.requireID(),
            inAmount: nil,
            inAccountID: nil,
            transactionCategoryID: category.requireID()
          )],
          for: eva.requireID(),
          on: app.db
        )
        let transactions = try await Transaction.query(on: app.db).all()
        #expect(transactions.count == 1)
        #expect(transactions.first?.description == "Restaurant")
        #expect(transactions.first?.date != nil)
        #expect(transactions.first?.notes == "")
        #expect(transactions.first?.type == 0)
        #expect(transactions.first?.outAmount == 19358)
        #expect(transactions.first?.outRefund == 12333)
        #expect(transactions.first?.outFee == 19348)
        #expect(transactions.first?.$outAccount.id == account.id)
        #expect(transactions.first?.$transactionCategory.id == category.id)
      }
    }

    @Test
    func testAggregateTransactions() async throws {
      let transactionService = TransactionService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        var result = try await transactionService.aggregateTransactions(
          operation: "SUM,inAmount",
          filters: [],
          for: 1,
          on: app.db
        )
        #expect(result.inAmount == nil)
        #expect(result.outAmount == nil)
        #expect(result.outRefund == nil)
        #expect(result.outFee == nil)

        let eva = User(
          firstName: "Eva",
          lastName: "Chan",
          username: "eva@example.com",
          key: Data(),
          salt: Data(),
          masterKeySealedBox: Data(),
          masterKeySealedBoxSalt: Data(),
          avatarURLs: "https://example.com/1.png"
        )
        try await eva.save(on: app.db)

        let currency = try Currency(
          code: "USD",
          minorUnit: 100,
          symbol: "$",
          symbolPosition: 0,
          userID: eva.requireID()
        )
        try await currency.save(on: app.db)

        let category = try TransactionCategory(
          name: "Food & Drinks",
          type: 0,
          userID: eva.requireID()
        )
        try await category.save(on: app.db)

        let account = try Account(
          title: "Chase Bank",
          subtitle: "Checking",
          number: "123456789",
          type: 0,
          balance: 0,
          actualBalance: 0,
          logoURLs: "https://example.com/1.png",
          currencyID: currency.requireID(),
          userID: eva.requireID()
        )
        try await account.save(on: app.db)

        let transaction = try Transaction(
          description: "Restaurant",
          date: Date(),
          notes: "",
          type: 0,
          outAmount: 19358,
          outRefund: 12333,
          outFee: 19348,
          outAccountID: account.requireID(),
          inAmount: nil,
          inAccountID: nil,
          transactionCategoryID: category.requireID(),
          userID: eva.requireID()
        )
        try await transaction.save(on: app.db)

        result = try await transactionService.aggregateTransactions(
          operation: "SUM,outAmount",
          filters: ["outAccountID_EQUALS_\(account.requireID())"],
          for: eva.requireID(),
          on: app.db
        )
        #expect(result.inAmount == nil)
        #expect(result.outAmount == 19358)
        #expect(result.outRefund == nil)
        #expect(result.outFee == nil)

        result = try await transactionService.aggregateTransactions(
          operation: "SUM,outAmount",
          filters: ["outAccountID_EQUALS_3"],
          for: eva.requireID(),
          on: app.db
        )
        #expect(result.inAmount == nil)
        #expect(result.outAmount == nil)
        #expect(result.outRefund == nil)
        #expect(result.outFee == nil)
      }
    }

    @Test
    func testGetTransactions() async throws {
      let transactionService = TransactionService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        var transactions = try await transactionService.getTransactions(
          for: 1,
          fields: [],
          filters: [],
          on: app.db
        )
        #expect(transactions.isEmpty)

        let eva = User(
          firstName: "Eva",
          lastName: "Chan",
          username: "eva@example.com",
          key: Data(),
          salt: Data(),
          masterKeySealedBox: Data(),
          masterKeySealedBoxSalt: Data(),
          avatarURLs: "https://example.com/1.png"
        )
        try await eva.save(on: app.db)

        let currency = try Currency(
          code: "USD",
          minorUnit: 100,
          symbol: "$",
          symbolPosition: 0,
          userID: eva.requireID()
        )
        try await currency.save(on: app.db)

        var category = try TransactionCategory(
          name: "Food & Drinks",
          type: 0,
          userID: eva.requireID()
        )
        try await category.save(on: app.db)

        let expenseAccount = try Account(
          title: "Chase Bank",
          subtitle: "Checking",
          number: "123456789",
          type: 0,
          balance: 0,
          actualBalance: 0,
          logoURLs: "https://example.com/1.png",
          currencyID: currency.requireID(),
          userID: eva.requireID()
        )
        try await expenseAccount.save(on: app.db)

        var transaction = try Transaction(
          description: "Restaurant",
          date: Date(),
          notes: "",
          type: 0,
          outAmount: 19358,
          outRefund: 12333,
          outFee: 19348,
          outAccountID: expenseAccount.requireID(),
          inAmount: nil,
          inAccountID: nil,
          transactionCategoryID: category.requireID(),
          userID: eva.requireID()
        )
        try await transaction.save(on: app.db)

        transactions = try await transactionService.getTransactions(
          for: eva.requireID(),
          fields: [
            "description",
            "outAmount",
            "outCurrencySymbol",
            "transactionCategoryName",
            "type"
          ],
          filters: [],
          on: app.db
        )
        #expect(transactions.count == 1)
        #expect(transactions.first?.description == "Restaurant")
        #expect(transactions.first?.outAmount == 26373)
        #expect(transactions.first?.outCurrencySymbol == "$")
        #expect(transactions.first?.transactionCategoryName == "Food & Drinks")
        #expect(transactions.first?.type == .expense)
        #expect(transactions.first?.inAmount == nil)

        category = try TransactionCategory(
          name: "Salary",
          type: 0,
          userID: eva.requireID()
        )
        try await category.save(on: app.db)

        let incomeAccount = try Account(
          title: "Chase Bank",
          subtitle: "Checking",
          number: "87654321",
          type: 0,
          balance: 0,
          actualBalance: 0,
          logoURLs: "https://example.com/1.png",
          currencyID: currency.requireID(),
          userID: eva.requireID()
        )
        try await incomeAccount.save(on: app.db)

        transaction = try Transaction(
          description: "Paycheck",
          date: Date(),
          notes: "",
          type: 1,
          outAmount: nil,
          outRefund: nil,
          outFee: nil,
          outAccountID: nil,
          inAmount: 19348,
          inAccountID: incomeAccount.requireID(),
          transactionCategoryID: category.requireID(),
          userID: eva.requireID()
        )
        try await transaction.save(on: app.db)

        transactions = try await transactionService.getTransactions(
          for: eva.requireID(),
          fields: [
            "description",
            "inAmount",
            "inCurrencySymbol",
            "transactionCategoryName",
            "type"
          ],
          filters: ["type_EQUALS_1"],
          on: app.db
        )
        #expect(transactions.count == 1)
        #expect(transactions.first?.description == "Paycheck")
        #expect(transactions.first?.inAmount == 19348)
        #expect(transactions.first?.inCurrencySymbol == "$")
        #expect(transactions.first?.transactionCategoryName == "Salary")
        #expect(transactions.first?.type == .income)
        #expect(transactions.first?.outAmount == nil)

        transaction = try Transaction(
          description: "Transfer",
          date: Date(),
          notes: "",
          type: 2,
          outAmount: 19324,
          outRefund: nil,
          outFee: nil,
          outAccountID: incomeAccount.requireID(),
          inAmount: 19324,
          inAccountID: expenseAccount.requireID(),
          transactionCategoryID: nil,
          userID: eva.requireID()
        )
        try await transaction.save(on: app.db)

        transactions = try await transactionService.getTransactions(
          for: eva.requireID(),
          fields: [
            "description",
            "outAmount",
            "inAmount",
            "outCurrencySymbol",
            "inCurrencySymbol",
            "type"
          ],
          filters: ["type_EQUALS_2"],
          on: app.db
        )
        #expect(transactions.count == 1)
        #expect(transactions.first?.description == "Transfer")
        #expect(transactions.first?.outAmount == 19324)
        #expect(transactions.first?.inAmount == 19324)
        #expect(transactions.first?.outCurrencySymbol == "$")
        #expect(transactions.first?.inCurrencySymbol == "$")
        #expect(transactions.first?.transactionCategoryName == nil)
        #expect(transactions.first?.type == .transfer)

        transactions = try await transactionService.getTransactions(
          for: eva.requireID(),
          fields: [],
          filters: [],
          on: app.db
        )
        #expect(transactions.count == 3)

        transactions = try await transactionService.getTransactions(
          for: eva.requireID(),
          fields: [],
          filters: ["description_CONTAINS_ych"],
          on: app.db
        )
        #expect(transactions.count == 1)

        transactions = try await transactionService.getTransactions(
          for: eva.requireID(),
          fields: [],
          filters: ["description_CONTAINS_ych", "type_EQUALS_0"],
          on: app.db
        )
        #expect(transactions.isEmpty)
      }
    }
  }
}
