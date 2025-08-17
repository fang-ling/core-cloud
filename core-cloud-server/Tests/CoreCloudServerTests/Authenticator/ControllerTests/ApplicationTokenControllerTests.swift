//
//  ApplicationTokenControllerTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/17.
//

@testable import CoreCloudServer
import Testing
import VaporTesting

extension ApplicationToken.Singular.Input.Insertion: Content { }

@Test("ApplicationTokenControllerTests")
func testApplicationTokenController() async throws {
  try await withApp(configure: CoreCloudServer.configure) { app in
    try await app.testing().test(
      .POST,
      "api/v1/application-token",
      afterResponse: { response async throws in
        #expect(response.status == .unauthorized)
      }
    )

    try await app.testing().test(
      .HEAD,
      "api/v1/application-token",
      afterResponse: { response async throws in
        #expect(response.status == .unauthorized)
      }
    )

    try await app.testing().test(
      .POST,
      "api/v1/user",
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
      "api/v1/user-token",
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
          .all[CoreCloudServer.COOKIE_NAME]
        #expect(cookie?.string != nil)
        #expect(cookie?.path == "/")
        #expect(cookie?.maxAge == nil)
        #expect(cookie?.isHTTPOnly == true)
      }
    )

    try await app.testing().test(
      .HEAD,
      "api/v1/application-token",
      beforeRequest: { request async throws in
        request.headers.cookie = .init(
          dictionaryLiteral: (
            CoreCloudServer.COOKIE_NAME,
            cookie!
          )
        )
      },
      afterResponse: { response async throws in
        #expect(response.status == .noContent)
      }
    )

    try await app.testing().test(
      .POST,
      "api/v1/application-token",
      beforeRequest: { request async throws in
        request.headers.cookie = .init(
          dictionaryLiteral: (
            CoreCloudServer.COOKIE_NAME,
            cookie!
          )
        )

        try request.content.encode(
          ApplicationToken.Singular.Input.Insertion(
            masterPassword: "test"
          )
        )
      },
      afterResponse: { response async throws in
        #expect(response.status == .unauthorized)
      }
    )

    var token: HTTPCookies.Value?
    try await app.testing().test(
      .POST,
      "api/v1/application-token",
      beforeRequest: { request async throws in
        request.headers.cookie = .init(
          dictionaryLiteral: (
            CoreCloudServer.COOKIE_NAME,
            cookie!
          )
        )

        try request.content.encode(
          ApplicationToken.Singular.Input.Insertion(
            masterPassword: "Top--1-Secret"
          )
        )
      },
      afterResponse: { response async throws in
        #expect(response.status == .created)

        token = response
          .headers
          .setCookie?
          .all[CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME]
        #expect(cookie?.string != nil)
        #expect(cookie?.path == "/")
        #expect(cookie?.maxAge == nil)
        #expect(cookie?.isHTTPOnly == true)
      }
    )

    try await app.testing().test(
      .HEAD,
      "api/v1/application-token",
      beforeRequest: { request async throws in
        request.headers.cookie = .init(
          dictionaryLiteral: (
            CoreCloudServer.COOKIE_NAME,
            cookie!
          ), (
            CoreCloudServer.APPLICATION_TOKEN_COOKIE_NAME,
            token!
          )
        )
      },
      afterResponse: { response async throws in
        #expect(response.status == .ok)
      }
    )
  }
}
