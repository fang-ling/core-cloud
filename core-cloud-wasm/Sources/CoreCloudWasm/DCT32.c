//
//  DCT32.c
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

#include "DCT32.h"

#define MULH3(x, y, s) ((s)*(y)*(x))

/* tab[i][j] = 1.0 / (2.0 * cos(pi*(2*k+1) / 2^(6 - j))) */

/* cos(i*pi/64) */

#define COS0_0  (Float32)( 0.50060299823519630134 /  2)
#define COS0_1  (Float32)( 0.50547095989754365998 /  2)
#define COS0_2  (Float32)( 0.51544730992262454697 /  2)
#define COS0_3  (Float32)( 0.53104259108978417447 /  2)
#define COS0_4  (Float32)( 0.55310389603444452782 /  2)
#define COS0_5  (Float32)( 0.58293496820613387367 /  2)
#define COS0_6  (Float32)( 0.62250412303566481615 /  2)
#define COS0_7  (Float32)( 0.67480834145500574602 /  2)
#define COS0_8  (Float32)( 0.74453627100229844977 /  2)
#define COS0_9  (Float32)( 0.83934964541552703873 /  2)
#define COS0_10 (Float32)( 0.97256823786196069369 /  2)
#define COS0_11 (Float32)( 1.16943993343288495515 /  4)
#define COS0_12 (Float32)( 1.48416461631416627724 /  4)
#define COS0_13 (Float32)( 2.05778100995341155085 /  8)
#define COS0_14 (Float32)( 3.40760841846871878570 /  8)
#define COS0_15 (Float32)(10.19000812354805681150 / 32)

#define COS1_0 (Float32)(0.50241928618815570551 /  2)
#define COS1_1 (Float32)(0.52249861493968888062 /  2)
#define COS1_2 (Float32)(0.56694403481635770368 /  2)
#define COS1_3 (Float32)(0.64682178335999012954 /  2)
#define COS1_4 (Float32)(0.78815462345125022473 /  2)
#define COS1_5 (Float32)(1.06067768599034747134 /  4)
#define COS1_6 (Float32)(1.72244709823833392782 /  4)
#define COS1_7 (Float32)(5.10114861868916385802 / 16)

#define COS2_0 (Float32)(0.50979557910415916894 / 2)
#define COS2_1 (Float32)(0.60134488693504528054 / 2)
#define COS2_2 (Float32)(0.89997622313641570463 / 2)
#define COS2_3 (Float32)(2.56291544774150617881 / 8)

#define COS3_0 (Float32)(0.54119610014619698439 / 2)
#define COS3_1 (Float32)(1.30656296487637652785 / 4)

#define COS4_0 (Float32)(0.707106781186547524400844362104849039 / 2)

/* butterfly operator */
#define BF(a, b, c, s) {               \
  alpha = value##a + value##b;         \
  beta = value##a - value##b;          \
  value##a = alpha;                    \
  value##b = MULH3(beta, c, 1 << (s)); \
}

#define BF0(a, b, c, s) {              \
  alpha = input[a] + input[b];         \
  beta = input[a] - input[b];          \
  value##a = alpha;                    \
  value##b = MULH3(beta, c, 1 << (s)); \
}

#define BF1(a, b, c, d) { \
  BF(a, b, COS4_0, 1);    \
  BF(c, d, -COS4_0, 1);   \
  value##c += value##d;   \
}

#define BF2(a, b, c, d) { \
  BF(a, b, COS4_0, 1);    \
  BF(c, d, -COS4_0, 1);   \
  value##c += value##d;   \
  value##a += value##c;   \
  value##c += value##b;   \
  value##b += value##d;   \
}

#define ADD(a, b) value##a += value##b

/* DCT32 without 1/sqrt(2) coef zero scaling. */
void DCT32Execute(const Float32 *input, Float32 *output) {
  Float32 alpha;
  Float32 beta;
  Float32 value0;
  Float32 value1;
  Float32 value2;
  Float32 value3;
  Float32 value4;
  Float32 value5;
  Float32 value6;
  Float32 value7;
  Float32 value8;
  Float32 value9;
  Float32 value10;
  Float32 value11;
  Float32 value12;
  Float32 value13;
  Float32 value14;
  Float32 value15;
  Float32 value16;
  Float32 value17;
  Float32 value18;
  Float32 value19;
  Float32 value20;
  Float32 value21;
  Float32 value22;
  Float32 value23;
  Float32 value24;
  Float32 value25;
  Float32 value26;
  Float32 value27;
  Float32 value28;
  Float32 value29;
  Float32 value30;
  Float32 value31;

  /* pass 1 */
  BF0( 0, 31, COS0_0 , 1);
  BF0(15, 16, COS0_15, 5);
  /* pass 2 */
  BF( 0, 15, COS1_0 , 1);
  BF(16, 31, -COS1_0, 1);
  /* pass 1 */
  BF0( 7, 24, COS0_7 , 1);
  BF0( 8, 23, COS0_8 , 1);
  /* pass 2 */
  BF( 7,  8, COS1_7 , 4);
  BF(23, 24, -COS1_7, 4);
  /* pass 3 */
  BF( 0,  7, COS2_0 , 1);
  BF( 8, 15, -COS2_0, 1);
  BF(16, 23, COS2_0 , 1);
  BF(24, 31, -COS2_0, 1);
  /* pass 1 */
  BF0( 3, 28, COS0_3 , 1);
  BF0(12, 19, COS0_12, 2);
  /* pass 2 */
  BF( 3, 12, COS1_3 , 1);
  BF(19, 28, -COS1_3, 1);
  /* pass 1 */
  BF0( 4, 27, COS0_4 , 1);
  BF0(11, 20, COS0_11, 2);
  /* pass 2 */
  BF( 4, 11, COS1_4 , 1);
  BF(20, 27, -COS1_4, 1);
  /* pass 3 */
  BF( 3,  4, COS2_3 , 3);
  BF(11, 12, -COS2_3, 3);
  BF(19, 20, COS2_3 , 3);
  BF(27, 28, -COS2_3, 3);
  /* pass 4 */
  BF( 0,  3, COS3_0 , 1);
  BF( 4,  7, -COS3_0, 1);
  BF( 8, 11, COS3_0 , 1);
  BF(12, 15, -COS3_0, 1);
  BF(16, 19, COS3_0 , 1);
  BF(20, 23, -COS3_0, 1);
  BF(24, 27, COS3_0 , 1);
  BF(28, 31, -COS3_0, 1);



  /* pass 1 */
  BF0( 1, 30, COS0_1 , 1);
  BF0(14, 17, COS0_14, 3);
  /* pass 2 */
  BF( 1, 14, COS1_1 , 1);
  BF(17, 30, -COS1_1, 1);
  /* pass 1 */
  BF0( 6, 25, COS0_6 , 1);
  BF0( 9, 22, COS0_9 , 1);
  /* pass 2 */
  BF( 6,  9, COS1_6 , 2);
  BF(22, 25, -COS1_6, 2);
  /* pass 3 */
  BF( 1,  6, COS2_1 , 1);
  BF( 9, 14, -COS2_1, 1);
  BF(17, 22, COS2_1 , 1);
  BF(25, 30, -COS2_1, 1);

  /* pass 1 */
  BF0( 2, 29, COS0_2 , 1);
  BF0(13, 18, COS0_13, 3);
  /* pass 2 */
  BF( 2, 13, COS1_2 , 1);
  BF(18, 29, -COS1_2, 1);
  /* pass 1 */
  BF0( 5, 26, COS0_5 , 1);
  BF0(10, 21, COS0_10, 1);
  /* pass 2 */
  BF( 5, 10, COS1_5 , 2);
  BF(21, 26, -COS1_5, 2);
  /* pass 3 */
  BF( 2,  5, COS2_2 , 1);
  BF(10, 13, -COS2_2, 1);
  BF(18, 21, COS2_2 , 1);
  BF(26, 29, -COS2_2, 1);
  /* pass 4 */
  BF( 1,  2, COS3_1 , 2);
  BF( 5,  6, -COS3_1, 2);
  BF( 9, 10, COS3_1 , 2);
  BF(13, 14, -COS3_1, 2);
  BF(17, 18, COS3_1 , 2);
  BF(21, 22, -COS3_1, 2);
  BF(25, 26, COS3_1 , 2);
  BF(29, 30, -COS3_1, 2);

  /* pass 5 */
  BF1( 0,  1,  2,  3);
  BF2( 4,  5,  6,  7);
  BF1( 8,  9, 10, 11);
  BF2(12, 13, 14, 15);
  BF1(16, 17, 18, 19);
  BF2(20, 21, 22, 23);
  BF1(24, 25, 26, 27);
  BF2(28, 29, 30, 31);

  /* pass 6 */

  ADD( 8, 12);
  ADD(12, 10);
  ADD(10, 14);
  ADD(14,  9);
  ADD( 9, 13);
  ADD(13, 11);
  ADD(11, 15);

  output[ 0] = value0;
  output[16] = value1;
  output[ 8] = value2;
  output[24] = value3;
  output[ 4] = value4;
  output[20] = value5;
  output[12] = value6;
  output[28] = value7;
  output[ 2] = value8;
  output[18] = value9;
  output[10] = value10;
  output[26] = value11;
  output[ 6] = value12;
  output[22] = value13;
  output[14] = value14;
  output[30] = value15;

  ADD(24, 28);
  ADD(28, 26);
  ADD(26, 30);
  ADD(30, 25);
  ADD(25, 29);
  ADD(29, 27);
  ADD(27, 31);

  output[ 1] = value16 + value24;
  output[17] = value17 + value25;
  output[ 9] = value18 + value26;
  output[25] = value19 + value27;
  output[ 5] = value20 + value28;
  output[21] = value21 + value29;
  output[13] = value22 + value30;
  output[29] = value23 + value31;
  output[ 3] = value24 + value20;
  output[19] = value25 + value21;
  output[11] = value26 + value22;
  output[27] = value27 + value23;
  output[ 7] = value28 + value18;
  output[23] = value29 + value19;
  output[15] = value30 + value17;
  output[31] = value31;
}
