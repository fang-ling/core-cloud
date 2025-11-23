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
    @Test func testAddTransactions() async throws {
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
        #expect(transactions.first?.outAccount?.id == eva.id)
        #expect(transactions.first?.transactionCategory?.id == category.id)
      }
    }
  }
}
