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

/* MARK: - Other Data Types */
/**
 * An untyped "generic" reference to any object.
 */
typedef const void* TypeReference;

#endif /* Base_h */
