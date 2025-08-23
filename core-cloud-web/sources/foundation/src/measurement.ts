//
//  measurement.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/20.
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

import { ByteCountFormatStyle } from "./formatting/byte-count-format-style"
import { Unit, UnitInformationStorage } from "./unit"

/**
 * A numeric quantity labeled with a unit of measure, with support for unit
 * conversion and unit-aware calculations.
 *
 * A Measurement object represents a quantity and unit of measure. The
 * Measurement type provides a programmatic interface to converting measurements
 * into different units, as well as calculating the sum or difference between
 * two measurements.
 *
 * Measurement objects are initialized with a Unit object and number value.
 * Measurement objects are immutable, and cannot be changed after being created.
 *
 * Measurements support a large set of operators, including +, -, *, /, and a
 * full set of comparison operators.
 */
export default class Measurement<UnitType extends Unit> {
  /* implements ReferenceConvertible, Comparable, Equatable */

  /**
   * The unit component of the measurement.
   */
  public readonly unit: UnitType

  /**
   * The value component of the measurement.
   */
  public readonly value: number

  /**
   * Create a Measurement given a specified value and unit.
   *
   * - Parameters:
   *   - value: The measurement value.
   *   - unit: The unit of measure.
   */
  public constructor({ value, unit }: { value: number, unit: UnitType }) {
    this.value = value
    this.unit = unit
  }

  /**
   * Generates a locale-aware string representation of a measurement using the
   * default measurement format style.
   *
   * Use the `formatted()` method to apply the default format style to a
   * measurement, such as in the following example:
   *
   * ```typescript
   * const string = new Measurement({
   *   value: 38,
   *   unit: UnitTemperature.celsius
   * }).formatted()
   * // For locale: en_US: 100.4°F
   * ```
   *
   * - Returns: A string, formatted according to the default style.
   */
  public formatted(): string {
    if (this.unit instanceof UnitInformationStorage) {
      const baseValue = this.unit.converter.baseUnitValue({
        value: this.value
      })
      return new ByteCountFormatStyle({ }).format({ value: baseValue })
    } else {
      throw new Error("Not supported.")
    }
  }
}
