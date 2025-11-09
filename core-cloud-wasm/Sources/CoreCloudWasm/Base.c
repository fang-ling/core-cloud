//
//  Base.c
//  core-cloud-wasm
//
//  Created by Fang Ling on 2025/11/9.
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

#include "Base.h"

/* MARK: - Working with Byte Order */
/* Encode a 64-bit integer to byte strings in big-endian format. */
void UInt64_BigEndianBytes(const UInt64 source, UInt8* destination) {
  destination[0] = (source >> 56) & 0xFF;
  destination[1] = (source >> 48) & 0xFF;
  destination[2] = (source >> 40) & 0xFF;
  destination[3] = (source >> 32) & 0xFF;
  destination[4] = (source >> 24) & 0xFF;
  destination[5] = (source >> 16) & 0xFF;
  destination[6] = (source >> 8) & 0xFF;
  destination[7] = source & 0xFF;
}

/* Decode a 64-bit integer from byte strings in big-endian format. */
void UInt64_InitBigEndianBytes(const UInt8* source, UInt64* destination) {
  *destination = ((UInt64)source[0] << 56) |
                 ((UInt64)source[1] << 48) |
                 ((UInt64)source[2] << 40) |
                 ((UInt64)source[3] << 32) |
                 ((UInt64)source[4] << 24) |
                 ((UInt64)source[5] << 16) |
                 ((UInt64)source[6] << 8) |
                 ((UInt64)source[7]);
}
