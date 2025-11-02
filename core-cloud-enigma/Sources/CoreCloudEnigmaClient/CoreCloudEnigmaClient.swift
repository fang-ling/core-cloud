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
  static func main() async throws {
    let command: String
    if CommandLine.arguments.count >= 2 {
      command = CommandLine.arguments[1]
    } else {
      command = ""
    }

    if command == "encrypt" {
      if CommandLine.arguments.count < 3 {
        print(
          """
          Missing required argument: FILENAME

          Usage:
            CoreCloudEnigmaClient encrypt <FILENAME>
                Encrypts all files in the current directory whose base name
                matches FILENAME (extension is ignored). Prints the generated
                decryption key.
          """
        )
        return
      }

      let name = CommandLine.arguments[2]
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

      let base64EncodedKey = key
        .withUnsafeBytes({ Data($0) })
        .base64EncodedString()
      print("Key: \(base64EncodedKey)")
    } else if command == "add" {
      if CommandLine.arguments.count < 3 {
        print(
          """
          Missing required argument: API

          Usage:
            CoreCloudEnigmaClient add <API>
                Reads a decryption key and sends it to the server.
          """
        )
        return
      }

      let api = CommandLine.arguments[2]

      print("Enter filename: ")
      let filename = readLine()!

      print("Enter key: ")
      let base64EncodedKey = readLine()!

      print("Enter JWT: ")
      let jwt = readLine()!

      var request = URLRequest(url: URL(string: api)!)
      request.httpMethod = "POST"
      request.setValue("application/json", forHTTPHeaderField: "Content-Type")
      request.setValue("CoreCloudJWT=\(jwt)", forHTTPHeaderField: "Cookie")
      request.httpBody = try JSONSerialization.data(
        withJSONObject: [
          "name": filename,
          "base64EncodedData": base64EncodedKey
        ],
        options: []
      )

      _ = try await URLSession.shared.data(for: request)
    } else {
      print(
        """
        Unknown command.

        Usage:
          CoreCloudEnigmaClient encrypt <FILENAME>
              Encrypts all files in the current directory whose base name
              matches FILENAME (extension is ignored). Prints the generated
              decryption key.

          CoreCloudEnigmaClient add <API>
              Reads a decryption key and sends it to the server.
        """
      )
      return
    }
  }
}
