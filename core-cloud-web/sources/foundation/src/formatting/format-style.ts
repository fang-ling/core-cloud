//
//  format-style.ts
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

/**
 * A type that converts a given data type into a representation in another type,
 * such as a string.
 *
 * TODO: Add documentation.
 */
export default interface FormatStyle<FormatInput, FormatOutput> {
  /**
   * Formats a value, using this style.
   *
   * - Parameter value: The value to format.
   *
   * - Returns: A representation of value, in the FormatOutput type, formatted
   *            according to the style's configuration.
   */
  format({ value }: { value: FormatInput }): FormatOutput
}
