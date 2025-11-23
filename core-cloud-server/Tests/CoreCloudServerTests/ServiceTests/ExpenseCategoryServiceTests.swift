//
//  ExpenseCategoryServiceTests.swift
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
  @Suite("ExpenseCategoryServiceTests")
  struct name {
    @Test
    func testAddExpenseCategory() async throws {
      let expenseCategoryService = ExpenseCategoryService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: ExpenseCategory.Error.databaseError) {
          try await expenseCategoryService.addExpenseCategory(
            name: "Food & Drinks",
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

        let id = try await expenseCategoryService.addExpenseCategory(
          name: "Food & Drinks",
          for: eva.requireID(),
          on: app.db
        )
        let expenseCategory = try await ExpenseCategory.query(on: app.db)
          .first()
        #expect(expenseCategory?.id == id)
        #expect(expenseCategory?.name == "Food & Drinks")

        await #expect(throws: ExpenseCategory.Error.databaseError) {
          try await expenseCategoryService.addExpenseCategory(
            name: "Food & Drinks",
            for: eva.requireID(),
            on: app.db
          )
        }
      }
    }

    @Test
    func testGetExpenseCategory() async throws {
      let expenseCategoryService = ExpenseCategoryService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: ExpenseCategory.Error.noSuchExpenseCategory) {
          try await expenseCategoryService.getExpenseCategory(
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

        await #expect(throws: ExpenseCategory.Error.noSuchExpenseCategory) {
          try await expenseCategoryService.getExpenseCategory(
            with: 1,
            fields: [],
            for: eva.requireID(),
            on: app.db
          )
        }

        let expenseCategory = try ExpenseCategory(
          name: "Food & Drinks",
          userID: eva.requireID()
        )
        try await expenseCategory.save(on: app.db)

        let userID = try await expenseCategoryService.getExpenseCategory(
          with: expenseCategory.requireID(),
          fields: ["userID"],
          for: eva.requireID(),
          on: app.db
        )
        #expect(userID == eva.id)
      }
    }

    @Test
    func testGetExpenseCategories() async throws {
      let expenseCategoryService = ExpenseCategoryService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        var categories = try await expenseCategoryService.getExpenseCategories(
          for: 1,
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

        categories = try await expenseCategoryService.getExpenseCategories(
          for: eva.requireID(),
          fields: [],
          on: app.db
        )
        #expect(categories.isEmpty)

        let expenseCategory = try ExpenseCategory(
          name: "Food & Drinks",
          userID: eva.requireID()
        )
        try await expenseCategory.save(on: app.db)

        categories = try await expenseCategoryService.getExpenseCategories(
          for: eva.requireID(),
          fields: ["name"],
          on: app.db
        )
        #expect(categories.count == 1)
        #expect(categories.first?.id != nil)
        #expect(categories.first?.name == "Food & Drinks")
      }
    }
  }
}
