//
//  text-field.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/9/13.
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

import { Binding } from "../binding"
import InternalTextField from "./internal-text-field"
import React from "react"

/**
 * A control that displays an editable text interface.
 */
export default function TextField({
  text,
  onChange,
  marginClassName = "",
  widthClassName = "",
  heightClassName = "",
  paddingClassName = "",
  borderClassName = "",
  foregroundStyleClassName = "",
  backgroundStyleClassName = "",
  fontSizeClassName = "",
  lineHeightClassName = "",
  tintClassName = "",
  disabled
}: {
  /**
   * A binding to the text that the field displays and edits.
   */
  text: Binding<string>,
  /**
   * An action to perform when the text value changes.
   */
  onChange?: () => void,
  marginClassName?: string,
  widthClassName?: string,
  heightClassName?: string,
  paddingClassName?: string,
  borderClassName?: string,
  foregroundStyleClassName?: string,
  backgroundStyleClassName?: string,
  fontSizeClassName?: string,
  lineHeightClassName?: string,
  tintClassName?: string,
  disabled?: boolean
}) {
  return (
    <InternalTextField
      text={text}
      type="text"
      onChange={onChange}
      marginClassName={marginClassName}
      widthClassName={widthClassName}
      heightClassName={heightClassName}
      paddingClassName={paddingClassName}
      borderClassName={borderClassName}
      foregroundStyleClassName={foregroundStyleClassName}
      backgroundStyleClassName={backgroundStyleClassName}
      fontSizeClassName={fontSizeClassName}
      lineHeightClassName={lineHeightClassName}
      tintClassName={tintClassName}
      disabled={disabled}
    />
  )
}
