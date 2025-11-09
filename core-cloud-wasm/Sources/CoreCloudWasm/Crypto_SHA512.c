//
//  Crypto_SHA512.c
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
 * Copyright (c) 2015 Allan Jude <allanjude@FreeBSD.org>
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

#include "Crypto_SHA512.h"

struct Crypto_SHA512_Context {
  UInt64 state[8];
  UInt64 count[2];
  UInt8 buffer[128];
};

/* SHA512 round constants. */
static const UInt64 K[80] = {
  0x428a2f98d728ae22ULL, 0x7137449123ef65cdULL,
  0xb5c0fbcfec4d3b2fULL, 0xe9b5dba58189dbbcULL,
  0x3956c25bf348b538ULL, 0x59f111f1b605d019ULL,
  0x923f82a4af194f9bULL, 0xab1c5ed5da6d8118ULL,
  0xd807aa98a3030242ULL, 0x12835b0145706fbeULL,
  0x243185be4ee4b28cULL, 0x550c7dc3d5ffb4e2ULL,
  0x72be5d74f27b896fULL, 0x80deb1fe3b1696b1ULL,
  0x9bdc06a725c71235ULL, 0xc19bf174cf692694ULL,
  0xe49b69c19ef14ad2ULL, 0xefbe4786384f25e3ULL,
  0x0fc19dc68b8cd5b5ULL, 0x240ca1cc77ac9c65ULL,
  0x2de92c6f592b0275ULL, 0x4a7484aa6ea6e483ULL,
  0x5cb0a9dcbd41fbd4ULL, 0x76f988da831153b5ULL,
  0x983e5152ee66dfabULL, 0xa831c66d2db43210ULL,
  0xb00327c898fb213fULL, 0xbf597fc7beef0ee4ULL,
  0xc6e00bf33da88fc2ULL, 0xd5a79147930aa725ULL,
  0x06ca6351e003826fULL, 0x142929670a0e6e70ULL,
  0x27b70a8546d22ffcULL, 0x2e1b21385c26c926ULL,
  0x4d2c6dfc5ac42aedULL, 0x53380d139d95b3dfULL,
  0x650a73548baf63deULL, 0x766a0abb3c77b2a8ULL,
  0x81c2c92e47edaee6ULL, 0x92722c851482353bULL,
  0xa2bfe8a14cf10364ULL, 0xa81a664bbc423001ULL,
  0xc24b8b70d0f89791ULL, 0xc76c51a30654be30ULL,
  0xd192e819d6ef5218ULL, 0xd69906245565a910ULL,
  0xf40e35855771202aULL, 0x106aa07032bbd1b8ULL,
  0x19a4c116b8d2d0c8ULL, 0x1e376c085141ab53ULL,
  0x2748774cdf8eeb99ULL, 0x34b0bcb5e19b48a8ULL,
  0x391c0cb3c5c95a63ULL, 0x4ed8aa4ae3418acbULL,
  0x5b9cca4f7763e373ULL, 0x682e6ff3d6b2b8a3ULL,
  0x748f82ee5defb2fcULL, 0x78a5636f43172f60ULL,
  0x84c87814a1f0ab72ULL, 0x8cc702081a6439ecULL,
  0x90befffa23631e28ULL, 0xa4506cebde82bde9ULL,
  0xbef9a3f7b2c67915ULL, 0xc67178f2e372532bULL,
  0xca273eceea26619cULL, 0xd186b8c721c0c207ULL,
  0xeada7dd6cde0eb1eULL, 0xf57d4f7fee6ed178ULL,
  0x06f067aa72176fbaULL, 0x0a637dc5a2c898a6ULL,
  0x113f9804bef90daeULL, 0x1b710b35131c471bULL,
  0x28db77f523047d84ULL, 0x32caab7b40c72493ULL,
  0x3c9ebe0a15c9bebcULL, 0x431d67c49c100d4cULL,
  0x4cc5d4becb3e42b6ULL, 0x597f299cfc657e2aULL,
  0x5fcb6fab3ad6faecULL, 0x6c44198c4a475817ULL
};

/* Elementary functions used by SHA512 */
#define Ch(x, y, z)  ((x & (y ^ z)) ^ z)
#define Maj(x, y, z) ((x & (y | z)) | (y & z))
#define SHR(x, n)    (x >> n)
#define ROTR(x, n)   ((x >> n) | (x << (64 - n)))
#define S0(x)        (ROTR(x, 28) ^ ROTR(x, 34) ^ ROTR(x, 39))
#define S1(x)        (ROTR(x, 14) ^ ROTR(x, 18) ^ ROTR(x, 41))
#define s0(x)        (ROTR(x, 1) ^ ROTR(x, 8) ^ SHR(x, 7))
#define s1(x)        (ROTR(x, 19) ^ ROTR(x, 61) ^ SHR(x, 6))

/* SHA512 round function */
#define RND(a, b, c, d, e, f, g, h, k) \
  h += S1(e) + Ch(e, f, g) + k;        \
  d += h;                              \
  h += S0(a) + Maj(a, b, c);

/* Adjusted round function for rotating state */
#define RNDr(S, W, i, ii)                \
  RND(S[(80 - i) % 8], S[(81 - i) % 8],  \
      S[(82 - i) % 8], S[(83 - i) % 8],  \
      S[(84 - i) % 8], S[(85 - i) % 8],  \
      S[(86 - i) % 8], S[(87 - i) % 8],  \
      W[i + ii] + K[i + ii])

/* Message schedule computation */
#define MSCH(W, ii, i)                  \
  W[i + ii + 16] = s1(W[i + ii + 14]) + \
                   W[i + ii + 9] +      \
                   s0(W[i + ii + 1]) +  \
                   W[i + ii]

/*
 * SHA512 block compression function.  The 512-bit state is transformed via
 * the 512-bit input block to produce a new state.
 */
static void Crypto_SHA512_Transform(UInt64* state, const UInt8 block[128]) {
  UInt64 W[80];
  UInt64 S[8];

  /* 1. Prepare the first part of the message schedule W. */
  for (Int32 i = 0; i < 16; i += 1) {
    UInt64_InitBigEndianBytes(block + i * 8, &W[i]);
  }

  /* 2. Initialize working variables. */
  memcpy(S, state, 64);

  /* 3. Mix. */
  for (Int32 i = 0; i < 80; i += 16) {
    RNDr(S, W, 0, i);
    RNDr(S, W, 1, i);
    RNDr(S, W, 2, i);
    RNDr(S, W, 3, i);
    RNDr(S, W, 4, i);
    RNDr(S, W, 5, i);
    RNDr(S, W, 6, i);
    RNDr(S, W, 7, i);
    RNDr(S, W, 8, i);
    RNDr(S, W, 9, i);
    RNDr(S, W, 10, i);
    RNDr(S, W, 11, i);
    RNDr(S, W, 12, i);
    RNDr(S, W, 13, i);
    RNDr(S, W, 14, i);
    RNDr(S, W, 15, i);

    if (i == 64) {
      break;
    }
    MSCH(W, 0, i);
    MSCH(W, 1, i);
    MSCH(W, 2, i);
    MSCH(W, 3, i);
    MSCH(W, 4, i);
    MSCH(W, 5, i);
    MSCH(W, 6, i);
    MSCH(W, 7, i);
    MSCH(W, 8, i);
    MSCH(W, 9, i);
    MSCH(W, 10, i);
    MSCH(W, 11, i);
    MSCH(W, 12, i);
    MSCH(W, 13, i);
    MSCH(W, 14, i);
    MSCH(W, 15, i);
  }

  /* 4. Mix local working variables into global state */
  for (Int32 i = 0; i < 8; i += 1) {
    state[i] += S[i];
  }
}

static UInt8 PAD[128] = {
  0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0x00, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0x00, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0x00, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0x00, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0x00, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0x00, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0x00, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
};

/* Add padding and terminating bit-count. */
static void Crypto_SHA512_Pad(struct Crypto_SHA512_Context *context) {
  /* Figure out how many bytes we have buffered. */
  UInt64 r = (context->count[1] >> 3) & 0x7f;

  /* Pad to 112 mod 128, transforming if we finish a block en route. */
  if (r < 112) {
    /* Pad to 112 mod 128. */
    memcpy(&context->buffer[r], PAD, 112 - r);
  } else {
    /* Finish the current block and mix. */
    memcpy(&context->buffer[r], PAD, 128 - r);
    Crypto_SHA512_Transform(context->state, context->buffer);

    /* The start of the final block is all zeroes. */
    memset(&context->buffer[0], 0, 112);
  }

  /* Add the terminating bit-count. */
  for (Int32 i = 0; i < 2; i += 1) {
    UInt64_BigEndianBytes(context->count[i], &context->buffer[112] + i * 8);
  }

  /* Mix in the final block. */
  Crypto_SHA512_Transform(context->state, context->buffer);
}

/* SHA-512 initialization.  Begins a SHA-512 operation. */
void Crypto_SHA512_Init(struct Crypto_SHA512_Context* context) {
  /* Zero bits processed so far */
  context->count[0] = context->count[1] = 0;

  /* Magic initialization constants */
  context->state[0] = 0x6a09e667f3bcc908ULL;
  context->state[1] = 0xbb67ae8584caa73bULL;
  context->state[2] = 0x3c6ef372fe94f82bULL;
  context->state[3] = 0xa54ff53a5f1d36f1ULL;
  context->state[4] = 0x510e527fade682d1ULL;
  context->state[5] = 0x9b05688c2b3e6c1fULL;
  context->state[6] = 0x1f83d9abfb41bd6bULL;
  context->state[7] = 0x5be0cd19137e2179ULL;
}

/* Add bytes into the hash */
void Crypto_SHA512_Update(struct Crypto_SHA512_Context* context,
                          const UInt8* buffer,
                          Int64 count) {
  const UInt8* source = buffer;

  /* Number of bytes left in the buffer from previous updates */
  UInt64 r = (context->count[1] >> 3) & 0x7f;

  /* Convert the length into a number of bits */
  UInt64 bitlen[2];
  bitlen[1] = ((UInt64)count) << 3;
  bitlen[0] = ((UInt64)count) >> 61;

  /* Update number of bits */
  if ((context->count[1] += bitlen[1]) < bitlen[1]) {
    context->count[0] += 1;
  }
  context->count[0] += bitlen[0];

  /* Handle the case where we don't need to perform any transforms */
  if (count < 128 - r) {
    memcpy(&context->buffer[r], source, count);
    return;
  }

  /* Finish the current block */
  memcpy(&context->buffer[r], source, 128 - r);
  Crypto_SHA512_Transform(context->state, context->buffer);
  source += 128 - r;
  count -= 128 - r;

  /* Perform complete blocks */
  while (count >= 128) {
    Crypto_SHA512_Transform(context->state, source);
    source += 128;
    count -= 128;
  }

  /* Copy left over data into buffer */
  memcpy(context->buffer, source, count);
}

/*
 * SHA-512 finalization.  Pads the input data, exports the hash value,
 * and clears the context state.
 */
void Crypto_SHA512_Finalize(struct Crypto_SHA512_Context* context,
                            UInt8 digest[static 64]) {
  /* Add padding */
  Crypto_SHA512_Pad(context);

  /* Write the hash */
  for (Int32 i = 0; i < 8; i += 1) {
    UInt64_BigEndianBytes(context->state[i], digest + i * 8);
  }

  /* Clear the context state */
  memset(context, 0, sizeof(*context));
}
