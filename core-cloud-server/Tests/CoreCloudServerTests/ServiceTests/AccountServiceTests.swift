//
//  AccountServiceTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/22.
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
  @Suite("AccountServiceTests")
  struct AccountServiceTests {
    @Test
    func testAddAccount() async throws {
      let accountService = AccountService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: Account.Error.databaseError) {
          try await accountService.addAccount(
            title: "Chase Bank",
            subtitle: "Checking",
            number: "123456789",
            type: .asset,
            balance: 0,
            actualBalance: 0,
            logoURLs: "https://example.com/1.png",
            with: 1,
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

        await #expect(throws: Account.Error.databaseError) {
          try await accountService.addAccount(
            title: "Chase Bank",
            subtitle: "Checking",
            number: "123456789",
            type: .asset,
            balance: 0,
            actualBalance: 0,
            logoURLs: "https://example.com/1.png",
            with: 1,
            for: eva.requireID(),
            on: app.db
          )
        }

        let currency = try Currency(
          code: "USD",
          minorUnit: 100,
          symbol: "$",
          symbolPosition: Currency.SymbolPosition.leading.rawValue,
          userID: eva.requireID()
        )
        try await currency.save(on: app.db)

        let accountID = try await accountService.addAccount(
          title: "Chase Bank",
          subtitle: "Checking",
          number: "123456789",
          type: .asset,
          balance: 0,
          actualBalance: 0,
          logoURLs: "https://example.com/1.png",
          with: currency.requireID(),
          for: eva.requireID(),
          on: app.db
        )
        let account = try await Account.query(on: app.db).first()
        #expect(account?.id == accountID)
        #expect(account?.title == "Chase Bank")
        #expect(account?.subtitle == "Checking")
        #expect(account?.number == "123456789")
        #expect(account?.type == Currency.SymbolPosition.leading.rawValue)
        #expect(account?.balance == 0)
        #expect(account?.actualBalance == 0)
        #expect(account?.logoURLs == "https://example.com/1.png")
      }
    }

    @Test
    func testUpdateAccount() async throws {
      let accountService = AccountService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: Never.self) {
          try await accountService.updateAccount(
            with: 1,
            actualBalance: 10000,
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

        let currency = try Currency(
          code: "USD",
          minorUnit: 100,
          symbol: "$",
          symbolPosition: Currency.SymbolPosition.leading.rawValue,
          userID: eva.requireID()
        )
        try await currency.save(on: app.db)

        let type: Account.`Type` = .asset
        var account = try Account(
          title: "Chase Bank",
          subtitle: "Checking",
          number: "123456789",
          type: type.rawValue,
          balance: 0,
          actualBalance: 0,
          logoURLs: "https://example.com/1.png",
          currencyID: currency.requireID(),
          userID: eva.requireID()
        )
        try await account.save(on: app.db)

        try await accountService.updateAccount(
          with: account.requireID(),
          actualBalance: 10000,
          for: eva.requireID(),
          on: app.db
        )
        account = try await Account.query(on: app.db).first()!
        #expect(account.actualBalance == 10000)
      }
    }

    @Test
    func testGetAccounts() async throws {
      let accountService = AccountService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        var accounts = try await accountService.getAccounts(
          for: 1,
          fields: [],
          on: app.db
        )
        #expect(accounts.isEmpty)

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

        accounts = try await accountService.getAccounts(
          for: eva.requireID(),
          fields: [],
          on: app.db
        )
        #expect(accounts.isEmpty)

        let currency = try Currency(
          code: "USD",
          minorUnit: 100,
          symbol: "$",
          symbolPosition: Currency.SymbolPosition.leading.rawValue,
          userID: eva.requireID()
        )
        try await currency.save(on: app.db)

        let type: Account.`Type` = .asset
        let account = try Account(
          title: "Chase Bank",
          subtitle: "Checking",
          number: "123456789",
          type: type.rawValue,
          balance: 0,
          actualBalance: 0,
          logoURLs: "https://example.com/1.png",
          currencyID: currency.requireID(),
          userID: eva.requireID()
        )
        try await account.save(on: app.db)

        accounts = try await accountService.getAccounts(
          for: 1,
          fields: ["title", "subtitle", "number", "balance"],
          on: app.db
        )
        #expect(accounts.count == 1)
        #expect(accounts.first?.title == "Chase Bank")
        #expect(accounts.first?.subtitle == "Checking")
        #expect(accounts.first?.number == "123456789")
        #expect(accounts.first?.currencyMinorUnit == 100)

        // TODO: Add balance computation logic test
      }
    }
  }
}
