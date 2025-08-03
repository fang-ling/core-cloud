//
//  Authenticator.swift
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

import Vapor

struct Authenticator {
  static let SCRYPT_ROUNDS = 256 * 1024
  static let SCRYPT_BLOCK_SIZE = 8
  static let SCRYPT_PARALLELISM = 1
  static let SCRYPT_OUTPUT_BYTE_COUNT = 256 / 8

  static let COOKIE_NAME = "CoreCloudServerJWT"
  static let COOKIE_MAX_AGE = 86400

  static func configure(_ app: Application) throws {
    app.migrations.add(UserMigrationV1())

    try app.routes.register(collection: UserController())
    try app.routes.register(collection: UserTokenController())
  }
}
