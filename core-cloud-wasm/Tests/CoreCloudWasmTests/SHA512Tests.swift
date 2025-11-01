//
//  SHA512Tests.swift
//  core-cloud-wasm
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

import CoreCloudWasm
import Foundation
import Testing

@Test
func testSHA512() {
  var context1 = SHA512Context()

  SHA512Init(&context1)

  "1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./".withCString { cString in
    SHA512Update(&context1, cString, Int64(strlen(cString)))
  }

  let digest1 = UnsafeMutablePointer<UInt8>.allocate(
    capacity: Int(SHA512_DIGEST_LENGTH)
  )
  defer { digest1.deallocate() }

  SHA512Finalize(&context1, digest1)

  let data1 = Data(bytes: digest1, count: Int(SHA512_DIGEST_LENGTH))
  let expectedResult1 = (
    "6ubWL6vs1Awk0KFB/rB71uakKGB4Bf530R+a/aWTft6o" +
    "tRGM+3Sk/J9FddWVdPYQWIYegJhvK0g0HJyEoJzCTg=="
  )
  #expect(data1.base64EncodedString() == expectedResult1)

  /* Null test */
  var context2 = SHA512Context()

  SHA512Init(&context2)

  let digest2 = UnsafeMutablePointer<UInt8>.allocate(
    capacity: Int(SHA512_DIGEST_LENGTH)
  )
  defer { digest2.deallocate() }

  SHA512Finalize(&context2, digest2)

  let data2 = Data(bytes: digest2, count: Int(SHA512_DIGEST_LENGTH))
  let expectedResult2 = (
    "z4PhNX7vuL3xVChQ1m2AB9Yg5AULVxXcg/SpIdNs6c5H" +
    "0NE8XYXysP+DGNKHfuwvY7kxvUdBeoGlODJ6+SfaPg=="
  )
  #expect(data2.base64EncodedString() == expectedResult2)
}
