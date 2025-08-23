//
//  unit.ts
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

/**
 * An abstract class representing a unit of measure.
 *
 * Each instance of an Unit subclass consists of a symbol, which can be used to
 * create string representations of Measurement objects.
 *
 * The Dimension subclass is an abstract class that represents a dimensional
 * unit, which can be converted into different units of the same type. The
 * Foundation framework provides several concrete Dimension subclasses to
 * represent the most common physical quantities, including mass, length,
 * duration, and speed.
 *
 * ## Subclassing Notes
 * Unit is intended for subclassing. For dimensional units, you should use one
 * of the Foundation provided Dimension subclasses, or create a custom subclass
 * of Dimension. You can create a direct subclass of Unit to represent a custom
 * dimensionless unit, such as a count, score, or ratio.
 */
export abstract class Unit {
  public readonly symbol: string

  public constructor({ symbol }: { symbol: string }) {
    this.symbol = symbol
  }
}

/**
 * An abstract class representing a dimensional unit of measure.
 *
 * The Foundation framework provides concrete subclasses for many of the most
 * common types of physical units.
 *
 * Table 1: Dimension subclasses.
 *
 * Dimension subclass     | Description                       | Base unit
 * -----------------------+-----------------------------------+----------
 * UnitInformationStorage | Unit of measure for quantities of | bytes (b)
 *                        | information                       |
 *
 * Each instance of a Dimension subclass has a converter, which represents the
 * unit in terms of the dimension’s `baseUnit()`. For example, the UnitLength
 * class uses meters as its base unit. The system defines the predefined miles
 * unit by a UnitConverterLinear with a coefficient of 1609.34, which
 * corresponds to the conversion ratio of miles to meters (1 mi = 1609.34 m);
 * the system defines the predefined meters unit by a UnitConverterLinear with a
 * coefficient of 1.0 because it’s the base unit.
 *
 * You typically use an Dimension subclass in conjunction with the Measurement
 * class to represent specific quantities of a particular unit.
 *
 * ## Working with Custom Units
 *
 * In addition to the framework-provided units, you can define custom units.
 * You can initialize custom units from a symbol and converter of an existing
 * type. You can also define your own Dimension subclass to represent an
 * entirely new unit dimension.
 *
 * ### Initializing a Custom Unit with a Specified Symbol and Definition
 *
 * The simplest way to define a custom unit is to create a new instance of an
 * existing Dimension subclass using the `constructor({ symbol:converter: })`
 * method.
 *
 * For example, the _smoot_ is a nonstandard unit of length
 * (1 smoot = 1.70180 m). You can create a new instance of UnitLength as
 * follows:
 *
 * ```typescript
 * const smoots = new UnitLength({
 *   symbol: "smoot",
 *   converter: new UnitConverterLinear({ coefficient: 1.70180 })
 * })
 * ```
 *
 * ### Creating a Custom Dimension Subclass
 *
 * You can create a new subclass of Dimension to describe a new unit dimension.
 *
 * For example, the Foundation framework doesn't define any units for
 * radioactivity. Radioactivity is the process by which the nucleus of an atom
 * emits radiation. The SI unit of measure for radioactivity is the
 * becquerel (Bq), which is the quantity of radioactive material in which one
 * nucleus decays per second (1 Bq = 1 s-1). Radioactivity is also commonly
 * described in terms of curies (Ci), a unit defined relative to the decay of
 * one gram of the radium-226 isotope (1 Ci = 3.7 × 1010 Bq). You can implement
 * a CustomUnitRadioactivity class that defines both units of radioactivity as
 * follows:
 *
 * ```typescript
 * class CustomRadioactivityUnit extends Dimension {
 *   static readonly becquerel = new CustomRadioactivityUnit({
 *     symbol: "Bq",
 *     converter: new UnitConverterLinear({ coefficient: 1.0 })
 *   })
 *   static readonly curie = new CustomRadioactivityUnit({
 *     symbol: "Ci",
 *     converter: new UnitConverterLinear({ coefficient: 3.7e10 })
 *   })
 *
 *   static readonly baseUnit = this.becquerel
 * }
 * ```
 *
 * ## Subclassing Notes
 *
 * The system provides Dimension for subclassing. Although the subclasses listed
 * in Table 1 above are suitable for most purposes, you may want to define a
 * custom unit type. For instance, you may need a custom unit type to represent
 * a derived unit, such as magnetic flux (measured as the product of electric
 * potential difference and time).
 *
 * To represent dimensionless units, subclass Unit directly.
 *
 * ### Methods to Override
 *
 * All subclasses must fully implement the `baseUnit()` method designating the
 * base unit, relative to which you define any additional units.
 *
 * You must also implement a class method named for the base unit itself, to use
 * interchangeably. For example, the UnitIlluminance class defines its
 * `baseUnit()` in terms of the lux (lx) and provides a corresponding `lux`
 * class method.
 *
 * ### Alternatives to Subclassing
 *
 * As described in Working with Custom Units, you need to create a custom
 * subclass of Dimension only if you or the system haven't defined a unit of the
 * desired dimension. You can define a custom unit for an existing Dimension
 * subclass by calling the `constructor({ symbol:converter: })` method.
 */
export abstract class Dimension extends Unit {
  public readonly converter: UnitConverter

  /**
   * Initializes a dimensional unit with the symbol and unit converter you
   * specify.
   *
   * This is the designated initializer.
   *
   * - Parameters:
   *   - symbol: The symbol used to represent the unit.
   *   - converter: The unit converter used to represent the unit in terms of
   *                the dimension's base unit.
   */
  public constructor({
    symbol,
    converter
  }: {
    symbol: string,
    converter: UnitConverter
  }) {
    super({ symbol })
    this.converter = converter
  }

  /**
   * Returns the base unit.
   *
   * You must override `baseUnit()` in your class to define its base unit.
   *
   * - Returns: An Dimension subclass object from which all other units provided
   *            by the subclass are defined.
   */
  public baseUnit(): Dimension {
    throw new Error(
      "You must override baseUnit in your class to define its base unit."
    )
  }
}

/**
 * An abstract class that provides a description of how to convert a unit to and
 * from the base unit of its dimension.
 *
 * For units that can be converted by a scale factor or linear equation, use the
 * concrete subclass UnitConverterLinear.
 *
 * ## Subclassing Notes
 *
 * UnitConverter is an abstract class that is intended for subclassing. You can
 * implement your own subclass of UnitConverter to convert between units
 * according to any desired mapping function. For example, units may be
 * converted using a logarithmic, exponential, or quantile scale.
 *
 * ### Methods to Override
 *
 * All subclasses must fully implement the following methods:
 *
 * - `baseUnitValue({ value: })`
 * - `value({ baseUnitValue: })`
 *
 * ### Alternatives to Subclassing
 *
 * As stated above, most physical units can be converted using a linear
 * equation with UnitConverterLinear. You should only create a custom subclass
 * of UnitConverter for units that cannot be converted in this way.
 */
export abstract class UnitConverter {
  /**
   * For a given unit, returns the specified value of that unit in terms of the
   * base unit of its dimension.
   *
   * This method takes a value in a particular unit and returns the result of
   * converting it into the base unit of that unit's dimension. For example, a
   * converter for the miles unit calling this method, passing 1.0 to the value
   * parameter, results in 1609.34 (1 mi = 1609.34 m).
   *
   * - Parameter value: The value in terms of a given unit.
   *
   * - Returns: The value in terms of the base unit.
   */
  public baseUnitValue({ value }: { value: number }): number {
    return value
  }

  /**
   * For a given unit, returns the specified value of the base unit in terms of
   * that unit.
   *
   * This method takes a value in the base unit of a unit's dimension and
   * returns the result of converting it into that unit. For example, a
   * converter for the pounds unit calling this method, passing 2.20462 to the
   * baseUnitValue parameter, results in 1.0 (2.20462 lbs = 1 kg).
   *
   * - Parameter baseUnitValue: The value in terms of the base unit.
   *
   * - Returns: The value in terms of a given unit.
   */
  public value({ baseUnitValue }: { baseUnitValue: number}): number {
    return baseUnitValue
  }
}

/**
 * A description of how to convert between units using a linear equation.
 *
 * A linear equation for unit conversion takes the form y = mx + b, such that
 * the following is true:
 *
 * - y is the value in terms of the base unit of the dimension.
 * - m is the known coefficient to use for this unit's conversion.
 * - x is the value in terms of the unit on which you call this method.
 * - b is the known constant to use for this unit’s conversion.
 *
 * The `baseUnitValue({ value: })` method performs the conversion in the
 * form of y = mx + b, where x represents the value passed in and y represents
 * the value returned. The `value({ baseUnitValue: })` method performs the
 * inverse conversion in the form of x = (y - b) / m, where y represents the
 * value passed in and x represents the value returned.
 *
 * For example, consider the fahrenheit unit that UnitTemperature defines. The
 * `baseUnitValue({ value: })` method calculates the value in the base unit,
 * kelvin, using the formula K = (0.55555555555556) × °F + 255.37222222222427.
 * The `value({ baseUnitValue: })` method calculates the value in fahrenheit
 * using the formula °F = (K — 255.37222222222427) / (0.55555555555556), where
 * the coefficient is (0.55555555555556) and the constant is 255.37222222222427.
 *
 * ```typescript
 * const kelvinToFahrenheit = new UnitConverterLinear({
 *   coefficient: 0.55555555555556,
 *   constant: 255.37222222222427
 * })
 * ```
 *
 * Units that perform conversion using only a scale factor have a coefficient
 * equal to the scale factor and a constant equal to 0. For example, consider
 * the kilometers unit UnitLength defines. The `baseUnitValue({ value: })`
 * method calculates the value in meters using the formula
 * valueInMeters = 1000 * valueInKilometers + 0. The `value({ baseUnitValue: })`
 * calculates the value in kilometers using the formula
 * valueInKilometers = (valueInMeters - 0) / 1000, where the coefficient is 1000
 * and the constant is 0.
 *
 * ```typescript
 * const kilometersToMeters = new UnitConverterLinear({
 *   coefficient: 1000.0,
 *   constant: 0.0
 * })
 * ```
 */
export class UnitConverterLinear extends UnitConverter {
  /**
   * The coefficient to use in the linear unit conversion calculation.
   */
  public coefficient: number

  /**
   * The constant to use in the linear unit conversion calculation.
   */
  public constant: number

  /**
   * Creates a unit converter with the coefficient and constant you specify.
   *
   * - Parameters:
   *   - coefficient: The coefficient used in the linear unit conversion
   *                  calculation.
   *   - constant: The constant used in the linear unit conversion calculation.
   */
  public constructor({
    coefficient,
    constant
  }: {
    coefficient: number,
    constant: number
  }) {
    super()
    this.coefficient = coefficient
    this.constant = constant
  }

  override baseUnitValue({ value }: { value: number }): number {
    return value * this.coefficient + this.constant
  }

  override value({ baseUnitValue }: { baseUnitValue: number }): number {
    return (baseUnitValue - this.constant) / this.coefficient
  }
}

/**
 * A unit of measure for quantities of information.
 *
 * Use instances of UnitInformationStorage to represent quantities of
 * information using the Measurement class. The base unit of measure for
 * information is the bit, with a nibble representing four bits and a byte
 * representing eight bits.
 *
 * Larger units of information expand on bits and bytes by orders of magnitude
 * in both decimal and binary forms.
 *
 * ## Information Transfer
 *
 * Units of bits commonly represent the amount of transferred information.
 *
 * Decimal Bits | Coefficient | Binary Bits | Coefficient
 * -------------+-------------+-------------+------------
 *
 * ## Information Storage
 *
 * Units of bytes commonly represent the amount of stored information.
 *
 * Decimal Bytes | Coefficient | Binary Bytes | Coefficient
 * --------------+-------------+--------------+------------
 * kilobytes     | 1000        | kibibytes    | 1024
 * --------------+-------------+--------------+------------
 * megabytes     | 1000e2      | mebibytes    | 1024e2
 * --------------+-------------+--------------+------------
 * gigabytes     | 1000e3      | gibibytes    | 1024e3
 */
export class UnitInformationStorage extends Dimension {
  private constructor({
    symbol,
    coefficient
  }: {
    symbol: string,
    coefficient: number
  }) {
    super({
      symbol: symbol,
      converter: new UnitConverterLinear({
        coefficient: coefficient,
        constant: 0
      })
    })
  }

  override baseUnit(): UnitInformationStorage {
    return UnitInformationStorage.bits
  }

  /**
   * The bits unit of information.
   */
  public static bits = new UnitInformationStorage({
    symbol: "bit",
    coefficient: 1.0
  })

  /**
   * The bytes unit of information.
   */
  public static bytes = new UnitInformationStorage({
    symbol: "B",
    coefficient: 8.0
  })
}

export namespace UnitInformationStorage {
  export namespace Symbol {
    export const nibbles      = "nibble"
    export const yottabytes   = "YB"
    export const zettabytes   = "ZB"
    export const exabytes     = "EB"
    export const petabytes    = "PB"
    export const terabytes    = "TB"
    export const gigabytes    = "GB"
    export const megabytes    = "MB"
    export const kilobytes    = "kB"

    export const yottabits    = "Yb"
    export const zettabits    = "Zb"
    export const exabits      = "Eb"
    export const petabits     = "Pb"
    export const terabits     = "Tb"
    export const gigabits     = "Gb"
    export const megabits     = "Mb"
    export const kilobits     = "kb"

    export const yobibytes    = "YiB"
    export const zebibytes    = "ZiB"
    export const exbibytes    = "EiB"
    export const pebibytes    = "PiB"
    export const tebibytes    = "TiB"
    export const gibibytes    = "GiB"
    export const mebibytes    = "MiB"
    export const kibibytes    = "KiB"

    export const yobibits     = "Yib"
    export const zebibits     = "Zib"
    export const exbibits     = "Eib"
    export const pebibits     = "Pib"
    export const tebibits     = "Tib"
    export const gibibits     = "Gib"
    export const mebibits     = "Mib"
    export const kibibits     = "Kib"
  }

  export namespace Coefficient {
    export const nibbles      = 4.0
    export const yottabytes   = 8.0*Math.pow(1000.0, 8.0)
    export const zettabytes   = 8.0*Math.pow(1000.0, 7.0)
    export const exabytes     = 8.0*Math.pow(1000.0, 6.0)
    export const petabytes    = 8.0*Math.pow(1000.0, 5.0)
    export const terabytes    = 8.0*Math.pow(1000.0, 4.0)
    export const gigabytes    = 8.0*Math.pow(1000.0, 3.0)
    export const megabytes    = 8.0*Math.pow(1000.0, 2.0)
    export const kilobytes    = 8.0*1000

    export const yottabits    = Math.pow(1000.0, 8.0)
    export const zettabits    = Math.pow(1000.0, 7.0)
    export const exabits      = Math.pow(1000.0, 6.0)
    export const petabits     = Math.pow(1000.0, 5.0)
    export const terabits     = Math.pow(1000.0, 4.0)
    export const gigabits     = Math.pow(1000.0, 3.0)
    export const megabits     = Math.pow(1000.0, 2.0)
    export const kilobits     = 1000.0

    export const yobibytes    = 8*Math.pow(1024.0, 8.0)
    export const zebibytes    = 8*Math.pow(1024.0, 7.0)
    export const exbibytes    = 8*Math.pow(1024.0, 6.0)
    export const pebibytes    = 8*Math.pow(1024.0, 5.0)
    export const tebibytes    = 8*Math.pow(1024.0, 4.0)
    export const gibibytes    = 8*Math.pow(1024.0, 3.0)
    export const mebibytes    = 8*Math.pow(1024.0, 2.0)
    export const kibibytes    = 8*1024.0

    export const yobibits     = Math.pow(1024.0, 8.0)
    export const zebibits     = Math.pow(1024.0, 7.0)
    export const exbibits     = Math.pow(1024.0, 6.0)
    export const pebibits     = Math.pow(1024.0, 5.0)
    export const tebibits     = Math.pow(1024.0, 4.0)
    export const gibibits     = Math.pow(1024.0, 3.0)
    export const mebibits     = Math.pow(1024.0, 2.0)
    export const kibibits     = 1024.0
  }
}
