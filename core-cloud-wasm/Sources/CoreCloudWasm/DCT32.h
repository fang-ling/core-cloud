//
//  DCT32.h
//  core-cloud-wasm
//
//  Created by Fang Ling on 2025/11/1.
//
//  This library is free software; you can redistribute it and/or
//  modify it under the terms of the GNU Lesser General Public
//  License as published by the Free Software Foundation; either
//  version 2.1 of the License, or (at your option) any later version.
//
//  This library is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
//  Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public
//  License along with this library; if not, write to the Free Software
//  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301
//  USA
//

/*
 * Template for the Discrete Cosine Transform for 32 samples
 * Copyright (c) 2001, 2002 Fabrice Bellard
 *
 * This file is part of FFmpeg.
 *
 * FFmpeg is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * FFmpeg is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with FFmpeg; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */

#ifndef DCT32_h
#define DCT32_h

#include "Base.h"

/**
 * Computes an type-II out-of-place single-precision real discrete cosine
 * transform.
 *
 * The type-II DCT uses the following operation for a discrete cosine transform:
 *
 *     // `h` is the input array that contains real numbers.
 *     // `H` is the output array that contains real numbers.
 *
 *     For 0 <= k < 32
 *       H[k] = sum(h[j] * cos(k * (j+1/2) * pi / 32, 0 <= j < 32)
 */
void DCT32(const Float32 *vector, Float32 *result);

#endif /* DCT32_h */
