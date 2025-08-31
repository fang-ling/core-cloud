//
//  ApplicationTokenTests.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/17.
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

extension ServiceTests {
  @Suite("ApplicationTokenTests")
  struct ApplicationTokenTests {
    @Test
    func testCreateApplicationToken() async throws {
      let applicationTokenService = ApplicationTokenService()

      try await withApp(configure: CoreCloudServer.configure) { _ in
        let masterKey1 = SymmetricKey(size: .bits256)
        let appToken = applicationTokenService.createApplicationToken(
          masterKey: masterKey1
        )
        #expect(appToken.bitCount == 256)

        let appToken2 = applicationTokenService.createApplicationToken(
          masterKey: masterKey1
        )
        #expect(appToken == appToken2)

        let appToken3 = applicationTokenService.createApplicationToken(
          masterKey: SymmetricKey(size: .bits256)
        )
        #expect(appToken != appToken3)
      }
    }
  }
}
