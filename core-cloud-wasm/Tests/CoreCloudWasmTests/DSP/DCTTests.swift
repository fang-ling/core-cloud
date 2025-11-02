//
//  DCTTests.swift
//  core-cloud-wasm
//
//  Created by Fang Ling on 2025/11/1.
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

import Accelerate
import CoreCloudWasm
import Numerics
import Testing

@Test
func testDCT32() {
  let dct32 = vDSP.DCT(count: 32, transformType: .II)!
  var output = [Float32](repeating: 0, count: 32)

  var input = [Float32](repeating: 0, count: 32)
  DSPDCT32Execute(&input, &output)
  var result = dct32.transform(input)
  for i in 0 ..< 32 {
    #expect(output[i].isApproximatelyEqual(to: result[i]))
  }

  input = (0 ..< 32).map({ Float32($0) })
  DSPDCT32Execute(&input, &output)
  result = dct32.transform(input)
  for i in 0 ..< 32 {
    #expect(output[i].isApproximatelyEqual(to: result[i]))
  }

  input = (0 ..< 32).reversed().map({ Float32($0) })
  DSPDCT32Execute(&input, &output)
  result = dct32.transform(input)
  for i in 0 ..< 32 {
    #expect(output[i].isApproximatelyEqual(to: result[i]))
  }
}
