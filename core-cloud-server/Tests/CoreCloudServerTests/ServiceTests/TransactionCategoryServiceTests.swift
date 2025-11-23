//
//  TransactionCategoryServiceTests.swift
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
  @Suite("TransactionCategoryServiceTests")
  struct name {
    @Test
    func testAddTransactionCategory() async throws {
      let transactionCategoryService = TransactionCategoryService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: TransactionCategory.Error.databaseError) {
          try await transactionCategoryService.addTransactionCategory(
            name: "Food & Drinks",
            type: .expense,
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

        let id = try await transactionCategoryService.addTransactionCategory(
          name: "Food & Drinks",
          type: .expense,
          for: eva.requireID(),
          on: app.db
        )
        let category = try await TransactionCategory.query(on: app.db)
          .first()
        #expect(category?.id == id)
        #expect(category?.name == "Food & Drinks")

        await #expect(throws: TransactionCategory.Error.databaseError) {
          try await transactionCategoryService.addTransactionCategory(
            name: "Food & Drinks",
            type: .expense,
            for: eva.requireID(),
            on: app.db
          )
        }

        await #expect(throws: Never.self) {
          try await transactionCategoryService.addTransactionCategory(
            name: "Food & Drinks",
            type: .income,
            for: eva.requireID(),
            on: app.db
          )
        }
      }
    }

    @Test
    func testGetTransactionCategory() async throws {
      let transactionCategoryService = TransactionCategoryService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(
          throws: TransactionCategory.Error.noSuchTransactionCategory
        ) {
          try await transactionCategoryService.getTransactionCategory(
            with: 1,
            fields: [],
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

        await #expect(
          throws: TransactionCategory.Error.noSuchTransactionCategory
        ) {
          try await transactionCategoryService.getTransactionCategory(
            with: 1,
            fields: [],
            for: eva.requireID(),
            on: app.db
          )
        }

        let type: TransactionCategory.`Type` = .expense
        let transactionCategory = try TransactionCategory(
          name: "Food & Drinks",
          type: type.rawValue,
          userID: eva.requireID()
        )
        try await transactionCategory.save(on: app.db)

        let category = try await transactionCategoryService
          .getTransactionCategory(
            with: transactionCategory.requireID(),
            fields: ["userID", "type"],
            for: eva.requireID(),
            on: app.db
          )
        #expect(category.type == .expense)
        #expect(category.userID == eva.id)
      }
    }

    @Test
    func testGetTransactionCategories() async throws {
      let transactionCategoryService = TransactionCategoryService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        var categories = try await transactionCategoryService
          .getTransactionCategories(
            for: 1,
            filters: [],
            fields: [],
            on: app.db
          )
        #expect(categories.isEmpty)

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

        categories = try await transactionCategoryService
          .getTransactionCategories(
            for: eva.requireID(),
            filters: [],
            fields: [],
            on: app.db
          )
        #expect(categories.isEmpty)

        let type: TransactionCategory.`Type` = .expense
        let transactionCategory = try TransactionCategory(
          name: "Food & Drinks",
          type: type.rawValue,
          userID: eva.requireID()
        )
        try await transactionCategory.save(on: app.db)

        categories = try await transactionCategoryService
          .getTransactionCategories(
            for: eva.requireID(),
            filters: ["type_EQUALS_0"],
            fields: ["name"],
            on: app.db
          )
        #expect(categories.count == 1)
        #expect(categories.first?.id != nil)
        #expect(categories.first?.name == "Food & Drinks")

        categories = try await transactionCategoryService
          .getTransactionCategories(
            for: eva.requireID(),
            filters: ["type_EQUALS_1"],
            fields: ["name"],
            on: app.db
          )
        #expect(categories.isEmpty)
      }
    }
  }
}
