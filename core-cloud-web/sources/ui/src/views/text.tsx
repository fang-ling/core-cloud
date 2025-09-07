//
//  text.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/24.
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

import React from "react"
import NewLocalizer from "../localizer"

/**
 * A view that displays one or more lines of read-only text.
 */
export default function Text({
  textKey,
  verbatimContent,
  marginClassName = "",
  fontSizeClassName = "",
  fontWeightClassName = "",
  foregroundStyleClassName = "",
  lineHeightClassName = "",
  multilineTextAlignmentClassName = "",
  truncationClassName = ""
}: {
  /**
   * The key for the localized text.
   */
  textKey?: string,
  /**
   * A string to display without localization.
   */
  verbatimContent?: string
  /**
   * Class name for controlling the text's margin.
   */
  marginClassName?: string,
  /**
   * Class name for controlling the font size of the text.
   */
  fontSizeClassName?: string,
  /**
   * Class name for controlling the font weight of the text.
   */
  fontWeightClassName?: string,
  /**
   * Class name for controlling the style of the text displayed by this view.
   */
  foregroundStyleClassName?: string,
  /**
   * Class name for controlling the line height of text.
   */
  lineHeightClassName?: string,
  multilineTextAlignmentClassName?: string,
  truncationClassName?: string
}) {
  return (
    <p
      className={
        `${marginClassName} ${fontSizeClassName} ${fontWeightClassName} ` +
          `${foregroundStyleClassName} ${lineHeightClassName} select-none ` +
          `${truncationClassName} w-full ${multilineTextAlignmentClassName}`
      }
      dangerouslySetInnerHTML={
        verbatimContent ? { __html: verbatimContent } : undefined
      }
    >
      {textKey && NewLocalizer.default.localize(textKey)}
    </p>
  )
}
