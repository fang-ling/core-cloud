//
//  alignment.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/28.
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
 * An alignment in both axes.
 */
export default class Alignment {
  public readonly className: string

  private constructor(className: string) {
    this.className = className
  }

  /**
   * A guide that marks the center of the view.
   */
  public static readonly center = new Alignment("items-center justify-center")

  /**
   * A guide that marks the top edge of the view.
   */
  public static readonly top = new Alignment("items-start justify-center")
}
