// swift-tools-version: 6.1

//
//  Package.swift
//  core-cloud-enigma
//
//  Created by Fang Ling on 2025/10/24.
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
  ("https://github.com/apple/swift-crypto.git", "4.0.0"),
  ("https://github.com/vapor/jwt.git", "5.1.2")/*,
  ("https://github.com/vapor/vapor.git", "4.117.0")*/
]

let package = Package(
  name: "core-cloud-enigma",
  platforms: [.macOS(.v15)],
  dependencies: dependencies.map({ .package(url: $0.0, exact: $0.1) }) +
  [
    .package(
      url: "https://github.com/fang-ling/vapor.git",
      branch: "feature/add-heic-support"
    )
  ],
  targets: [
    .executableTarget(
      name: "CoreCloudEnigma",
      dependencies: [
        .product(name: "Crypto", package: "swift-crypto"),
        .product(name: "JWT", package: "jwt"),
        .product(name: "Vapor", package: "vapor")
      ]
    ),
    .executableTarget(
      name: "CoreCloudEnigmaClient",
      dependencies: [
        .product(name: "Crypto", package: "swift-crypto")
      ]
    )
  ]
)
