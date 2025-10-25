//
//  SHA512.h
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

/*-
 * Copyright 2005 Colin Percival
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

#ifndef SHA512_h
#define SHA512_h

#include "Base.h"

#define SHA512_BLOCK_LENGTH          128
#define SHA512_DIGEST_LENGTH         64
#define SHA512_DIGEST_STRING_LENGTH  (SHA512_DIGEST_LENGTH * 2 + 1)

struct SHA512Context {
  UInt64 state[8];
  UInt64 count[2];
  UInt8 buffer[SHA512_BLOCK_LENGTH];
};

/**
 * Creates a SHA512 hash function.
 *
 * Initialize a new hash function by calling this method if you want to hash the
 * data iteratively, such as when you don't have a buffer large enough to hold
 * all the data at once. Provide data blocks to the hash function using the
 * ``SHA512Update()`` method. After providing all the data, call
 * ``SHA512Finalize()`` to get the digest.
 */
void SHA512Init(struct SHA512Context* context);

/**
 * Incrementally updates the hash function with the contents of the buffer.
 *
 * Call this method one or more times to provide data to the hash function in
 * blocks. After providing the last block of data, call the ``SHA512Finalize()``
 * method to get the computed digest. Don't call the update method again after
 * finalizing the hash function.
 *
 * - Parameters:
 *   - buffer: A pointer to the next block of data for the ongoing digest
 *             calculation.
 *   - count: The number of bytes in the buffer.
 */
void SHA512Update(struct SHA512Context* context,
                  TypeReference buffer,
                  Int64 count);

/**
 * Finalizes the hash function and returns the computed digest.
 *
 * Call this method after you provide the hash function with all the data to
 * hash by making one or more calls to the ``SHA512Update()`` method. After
 * finalizing the hash function, discard it. To compute a new digest, create a
 * new hash function with a call to the ``SHA512Init()`` method.
 *
 * - Returns: The computed digest of the data.
 */
void SHA512Finalize(struct SHA512Context* context,
                    UInt8 digest[static SHA512_DIGEST_LENGTH]);

#endif /* SHA512_h */
