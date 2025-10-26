//
//  CoreCloudEnigmaClient.swift
//  core-cloud-enigma
//
//  Created by Fang Ling on 2025/10/25.
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

#if canImport(CryptoKit)
import CryptoKit
#else
import Crypto
#endif
import Foundation

@main
struct CoreCloudEnigmaClient {
  static func main() throws {
    let name = CommandLine.arguments[1]

    let key = SymmetricKey(size: .bits256)

    let path = FileManager.default.currentDirectoryPath
    try FileManager.default.contentsOfDirectory(atPath: path)
      .filter({ $0.hasPrefix(name) })
      .forEach { file in
        let cleartext = try Data(contentsOf: URL(filePath: file))
        try AES.GCM.seal(cleartext, using: key)
          .combined?
          .write(to: URL(filePath: "\(file).sealedbox"))
      }

    let keyString = key.withUnsafeBytes({ Data($0) }).base64EncodedString()
    print("Key: \(keyString)")
  }
}
