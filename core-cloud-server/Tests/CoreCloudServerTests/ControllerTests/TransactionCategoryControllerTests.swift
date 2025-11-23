//
//  TransactionCategoryControllerTests.swift
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

extension TransactionCategory.Singular.Input.Insertion: Content { }

extension ControllerTests {
  @Test("TransactionCategoryControllerTests")
  func testTransactionCategoryController() async throws {
    try await withApp(configure: CoreCloudServer.configure) { app in
      try await app.testing().test(
        .POST,
        "api/transaction-category",
        afterResponse: { response async throws in
          #expect(response.status == .unauthorized)
        }
      )

      try await app.testing().test(
        .GET,
        "api/transaction-categories",
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
        .GET,
        "api/transaction-categories?fields=name&filters=type_EQUALS_0",
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

          let categories = try response.content.decode(
            [TransactionCategory.Plural.Output.Retrieval].self
          )
          #expect(categories.count == 1)
          #expect(categories.first?.id == 1)
          #expect(categories.first?.name == "Food & Drinks")
        }
      )

      try await app.testing().test(
        .GET,
        "api/transaction-categories?fields=name&filters=type_EQUALS_1",
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

          let categories = try response.content.decode(
            [TransactionCategory.Plural.Output.Retrieval].self
          )
          #expect(categories.isEmpty)
        }
      )
    }
  }
}
