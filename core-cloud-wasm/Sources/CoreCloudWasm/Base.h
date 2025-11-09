//
//  Base.h
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

#ifndef Base_h
#define Base_h

#include <stdint.h>
#include <string.h>

/* MARK: - Unsigned Integers */
/**
 * An 8-bit unsigned integer value type.
 */
typedef uint8_t UInt8;
/**
 * A 32-bit unsigned integer value type.
 */
typedef uint32_t UInt32;
/**
 * A 64-bit unsigned integer value type.
 */
typedef uint64_t UInt64;

/* MARK: - Signed Integers */
/**
 * A 32-bit signed integer value type.
 */
typedef int32_t Int32;
/**
 * A 64-bit signed integer value type.
 */
typedef int64_t Int64;

/* MARK: - Floating-Point Values */
/**
 * A 32-bit floating point type.
 */
typedef float Float32;

/* MARK: - Working with Byte Order */

/**
 * Converts a 64-bit integer from the host's native byte order to big-endian
 * format bytes.
 *
 * - Parameters:
 *   - source: The integer whose bytes should be swapped.
 *   - destination: A byte buffer to be filled with values from the integer with
 *     its bytes swapped.
 */
void UInt64_BigEndianBytes(const UInt64 source, UInt8* destination);

/**
 * Creates an integer value from a byte buffer in big-endian format.
 *
 * - Parameters:
 *   - source: A byte buffer in big-endian format.
 *   - destination: A pointer to an integer where the value converted from the
 *     byte buffer will be stored.
 */
void UInt64_InitBigEndianBytes(const UInt8* source, UInt64* destination);

#endif /* Base_h */
