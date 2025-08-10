// swift-tools-version: 6.1

//
//  Package.swift
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

import PackageDescription

let dependencies: [(String, PackageDescription.Version)] = [
  ("https://github.com/apple/swift-crypto.git", "3.14.0"),
  ("https://github.com/vapor/fluent.git", "4.12.0"),
  ("https://github.com/vapor/fluent-sqlite-driver.git", "4.8.1"),
  ("https://github.com/vapor/jwt.git", "5.1.2"),
  ("https://github.com/vapor/vapor.git", "4.115.1")
]

let package = Package(
  name: "core-cloud-server",
  platforms: [.macOS(.v15)],
  dependencies: dependencies.map({ .package(url: $0.0, exact: $0.1) }),
  targets: [
    .executableTarget(
      name: "CoreCloudServer",
      dependencies: [
        .product(name: "Crypto", package: "swift-crypto"),
        .product(name: "_CryptoExtras", package: "swift-crypto"),
        .product(name: "Fluent", package: "fluent"),
        .product(name: "FluentSQLiteDriver", package: "fluent-sqlite-driver"),
        .product(name: "JWT", package: "jwt"),
        .product(name: "Vapor", package: "vapor")
      ]
    ),
    .testTarget(
      name: "CoreCloudServerTests",
      dependencies: [
        .target(name: "CoreCloudServer"),
        .product(name: "Crypto", package: "swift-crypto"),
        .product(name: "_CryptoExtras", package: "swift-crypto"),
        .product(name: "VaporTesting", package: "vapor")
      ]
    )
  ]
)
