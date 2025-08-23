//
//  byte-count-format-style.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/22.
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

import FormatStyle from "./format-style"

/**
 * A format style that provides string representations of byte counts.
 */
export class ByteCountFormatStyle implements FormatStyle<number, string> {
  public readonly style: ByteCountFormatStyle.Style

  /**
   * Initializes a byte count format style.
   *
   * - Parameter style: The style of byte count to express, such as memory or
   *                    file system storage.
   */
  public constructor({
    style = ByteCountFormatStyle.Style.file
  }: {
    style?: ByteCountFormatStyle.Style
  }) {
    this.style = style
  }

  public format({ value }: { value: number }): string {
    value /= 8
    let base: number
    switch (this.style) {
      case ByteCountFormatStyle.Style.file:
        base = 1000
        break

      default:
        base = 0
        break
    }

    if (value < base) {
      return `${value} byte${value !== 1 ? "s" : ""}`
    } else if (value < base * base) {
      const y = Math.round(value / base)
      if (y >= base) {
        return "1 MB"
      }
      return `${y} KB`
    } else if (value < base * base * base) {
      const y = Math.round((value / (base * base)) * 10) / 10
      if (y >= base) {
        return "1 GB"
      }
      return `${y.toFixed(1)} MB`
    } else if (value < base * base * base * base) {
      const y = Math.round((value / (base * base * base)) * 100) / 100
      if (y >= base) {
        return "1 TB"
      }
      return `${y.toFixed(2)} GB`
    }
    return "NaN"
  }
}

export namespace ByteCountFormatStyle {
  /**
   * The semantic style to use when formatting a byte count value.
   */
  export enum Style {
    /**
     * A style for representing file system storage.
     */
    file
  }
}
