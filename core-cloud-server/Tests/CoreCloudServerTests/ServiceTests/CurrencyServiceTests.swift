//
//  CurrencyServiceTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/11/20.
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
  @Suite("CurrencyServiceTests")
  struct CurrencyServiceTests {
    @Test
    func testAddCurrency() async throws {
      let currencyService = CurrencyService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: Currency.Error.databaseError) {
          try await currencyService.addCurrency(
            code: "USD",
            minorUnit: 100,
            symbol: "$",
            symbolPosition: .leading,
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

        let currencyID = try await currencyService.addCurrency(
          code: "USD",
          minorUnit: 100,
          symbol: "$",
          symbolPosition: .leading,
          for: eva.requireID(),
          on: app.db
        )
        let currency = try await Currency.query(on: app.db).first()
        #expect(currency?.id == currencyID)
        #expect(currency?.code == "USD")
        #expect(currency?.minorUnit == 100)
        #expect(currency?.symbol == "$")
        #expect(
          currency?.symbolPosition == Currency.SymbolPosition.leading.rawValue
        )

        await #expect(throws: Currency.Error.databaseError) {
          try await currencyService.addCurrency(
            code: "USD",
            minorUnit: 100,
            symbol: "$",
            symbolPosition: .leading,
            for: eva.requireID(),
            on: app.db
          )
        }
      }
    }

    @Test
    func testGetCurrency() async throws {
      let currencyService = CurrencyService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        await #expect(throws: Currency.Error.noSuchCurrency) {
          try await currencyService.getCurrency(
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

        await #expect(throws: Currency.Error.noSuchCurrency) {
          try await currencyService.getCurrency(
            with: 1,
            fields: [],
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

        let minorUnit = try await currencyService.getCurrency(
          with: 1,
          fields: ["minorUnit"],
          for: eva.requireID(),
          on: app.db
        )
        #expect(minorUnit == 100)
      }
    }

    @Test
    func testGetCurrencies() async throws {
      let currencyService = CurrencyService()

      try await withApp(configure: CoreCloudServer.configure) { app in
        var currencies = try await currencyService.getCurrencies(
          for: 1,
          fields: [],
          on: app.db
        )
        #expect(currencies.isEmpty)

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

        currencies = try await currencyService.getCurrencies(
          for: eva.requireID(),
          fields: [],
          on: app.db
        )
        #expect(currencies.isEmpty)

        let currency = try Currency(
          code: "USD",
          minorUnit: 100,
          symbol: "$",
          symbolPosition: Currency.SymbolPosition.leading.rawValue,
          userID: eva.requireID()
        )
        try await currency.save(on: app.db)

        currencies = try await currencyService.getCurrencies(
          for: eva.requireID(),
          fields: ["code"],
          on: app.db
        )
        #expect(currencies.count == 1)
        #expect(currencies.first?.id != nil)
        #expect(currencies.first?.code == "USD")

        currencies = try await currencyService.getCurrencies(
          for: 2,
          fields: ["code"],
          on: app.db
        )
        #expect(currencies.isEmpty)
      }
    }
  }
}
