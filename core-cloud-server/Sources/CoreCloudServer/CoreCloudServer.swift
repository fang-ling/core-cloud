//
//  CoreCloudServer.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/7/28.
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

import Fluent
import FluentSQLiteDriver
import JWT
import Vapor

@main
struct CoreCloudServer {
  static func main() async throws {
    var env = try Environment.detect()
    try LoggingSystem.bootstrap(from: &env)

    let app = try await Application.make(.detect())

    do {
      try await configure(app)
    } catch {
      app.logger.report(error: error)
      try await app.asyncShutdown()
      throw error
    }

    try await app.execute()
    try await app.asyncShutdown()
  }

  static func configure(_ app: Application) async throws {
    /* Database configuration */
    if app.environment == .testing {
      app.databases.use(.sqlite(.memory), as: .sqlite)
    } else {
      app.databases.use(.sqlite(.file("core-cloud-server.sqlite")), as: .sqlite)
    }

    /* CORS on development. */
    if app.environment == .development {
      let corsMiddleware = CORSMiddleware(
        configuration: CORSMiddleware.Configuration(
          allowedOrigin: .all,
          allowedMethods: [.POST, .GET, .PATCH, .DELETE, .HEAD],
          allowedHeaders: [
            .accept,
            .authorization,
            .contentType,
            .origin,
            .xRequestedWith,
            .userAgent,
            .accessControlAllowOrigin
          ]
        )
      )
      app.middleware.use(corsMiddleware, at: .beginning)
    }

    /* JWT */
    if app.environment == .testing {
      await app.jwt.keys.add(hmac: "!!!TOP_SECRET!!!", digestAlgorithm: .sha512)
    } else {
      await app.jwt.keys.add(
        hmac: .init(from: Environment.get("JWT_SECRET")!),
        digestAlgorithm: .sha512
      )
    }

    /* Bodyguard middleware */
    app.middleware.use(BodyguardMiddleware())

    /* File middleware */
    app.middleware.use(
      FileMiddleware(
        publicDirectory: app.directory.publicDirectory,
        defaultFile: "index.html",
        directoryAction: .redirect
      )
    )

    /* Components configuration */
    try Authenticator.configure(app)

    try await app.autoMigrate()
  }
}
