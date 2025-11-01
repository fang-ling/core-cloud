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
import NIOSSL
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
        hmac: .init(from: Environment.get(Keys.jwtSecret)!),
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

    /* TLS */
    if (Environment.get(Keys.tls) ?? "false") == "true" {
      app.http.server.configuration.tlsConfiguration = .makeServerConfiguration(
        certificateChain: try NIOSSLCertificate
          .fromPEMFile(Environment.get(Keys.certificate) ?? "")
          .map ({ .certificate($0) }),
          privateKey: .privateKey(
            try NIOSSLPrivateKey(
              file: Environment.get(Keys.privateKey) ?? "",
              format: .pem
            )
          )
      )
    }

    /* Migrations */
    app.migrations.add(UserMigrationV1())
    app.migrations.add(SettingMigrationV1())
    app.migrations.add(LocationMigrationV1())
    app.migrations.add(FileMigrationV1())
    app.migrations.add(SongMigrationV1())
    app.migrations.add(SongMigrationV2())
    app.migrations.add(SongMigrationV3())
    app.migrations.add(SongMigrationV4())
    app.migrations.add(AlbumMigrationV1())
    app.migrations.add(SongMigrationV5())
    app.migrations.add(SongMigrationV6())
    app.migrations.add(FileMigrationV2())
    app.migrations.add(HomeVideoMigrationV1())
    app.migrations.add(TVShowMigrationV1())
    app.migrations.add(EpisodeMigrationV1())
    try await app.autoMigrate()

    /* Routes */
    try app.routes.register(collection: UserController())
    try app.routes.register(collection: UserTokenController())
    try app.routes.register(collection: SettingController())
    try app.routes.register(collection: DiskController())
    try app.routes.register(collection: LocationController())
    try app.routes.register(collection: ApplicationTokenController())
    try app.routes.register(collection: FileController())
    try app.routes.register(collection: SongController())
    try app.routes.register(collection: AlbumController())
    try app.routes.register(collection: HomeVideoController())
    try app.routes.register(collection: TVShowController())
    try app.routes.register(collection: EpisodeController())
  }
}

extension CoreCloudServer {
  static let SCRYPT_ROUNDS = 256 * 1024
  static let SCRYPT_BLOCK_SIZE = 8
  static let SCRYPT_PARALLELISM = 1
  static let SCRYPT_OUTPUT_BYTE_COUNT = 256 / 8

  static let cookieName = "CoreCloudJWT"
  static let cookieMaxAge = 86400

  static let applicationTokenCookieName = "CoreCloudServerApplicationToken"

  static let CHUNK_SIZE: Int64 = 4 * 1024 * 1024
}

extension CoreCloudServer {
  enum Keys {
    static let jwtSecret = "JWT_SECRET"
    static let tls = "TLS"
    static let certificate = "CERTIFICATE"
    static let privateKey = "PRIVATE_KEY"
    static let disks = "DISKS"
    static let cookieDomain = "COOKIE_DOMAIN"
  }
}

extension CoreCloudServer {
  static let encoder = JSONEncoder()
}
