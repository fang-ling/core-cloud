//
//  AccountControllerTests.swift
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

extension Account.Singular.Input.Insertion: Content { }
extension Account.Singular.Input.Modification: Content { }

extension ControllerTests {
  @Test("AccountControllerTests")
  func testAccountController() async throws {
    try await withApp(configure: CoreCloudServer.configure) { app in
      try await app.testing().test(
        .POST,
        "api/account",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .GET,
        "api/accounts",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .PATCH,
        "api/account",
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
          #expect(response.status == .badRequest)
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
        .GET,
        "api/accounts?fields=title,balance",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .ok)

          let accounts = try response.content.decode(
            [Account.Plural.Output.Retrieval].self
          )
          #expect(accounts.count == 1)
          #expect(accounts.first?.id == 1)
          #expect(accounts.first?.title == "Chase Bank")
          #expect(accounts.first?.subtitle == nil)
          #expect(accounts.first?.balance == "0")
        }
      )

      try await app.testing().test(
        .PATCH,
        "api/account",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )

          try request.content.encode(
            Account.Singular.Input.Modification(
              id: 1,
              actualBalance: "193.58"
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .ok)
        }
      )

      try await app.testing().test(
        .GET,
        "api/accounts?fields=title,balance,actualBalance",
        beforeRequest: { request async throws in
          request.headers.cookie = .init(
            dictionaryLiteral: (
              CoreCloudServer.Cookie.Keys.jwt,
              cookie!
            )
          )
        },
        afterResponse: { response async throws in
          #expect(response.status == .ok)

          let accounts = try response.content.decode(
            [Account.Plural.Output.Retrieval].self
          )
          #expect(accounts.count == 1)
          #expect(accounts.first?.id == 1)
          #expect(accounts.first?.title == "Chase Bank")
          #expect(accounts.first?.subtitle == nil)
          #expect(accounts.first?.balance == "0")
          #expect(accounts.first?.actualBalance == "193.58")
        }
      )

      // TODO: Add balance computation logic test
    }
  }
}
