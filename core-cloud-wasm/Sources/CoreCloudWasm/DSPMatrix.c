//
//  DSPMatrix.c
//  core-cloud-wasm
//
//  Created by Fang Ling on 2025/11/2.
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

#include "DSPMatrix.h"

/* 32x32 matrix transposition. */
void DSPMatrixTranspose32x32(const Float32* input, Float32* output) {
  for (Int32 i = 0; i < 32; i += 8) {
    for (Int32 j = 0; j < 32; j += 8) {
      for (Int32 r = 0; r < 8; r += 1) {
        for (Int32 c = 0; c < 8; c += 1) {
          output[(j + c) * 32 + (i + r)] = input[(i + r) * 32 + (j + c)];
        }
      }
    }
  }
}
