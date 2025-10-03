//
//  picker.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/10/3.
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
import React from "react"

/**
 * A control for selecting from a set of mutually exclusive values.
 */
export function Picker({
  selection,
  widthClassName = "",
  heightClassName = "",
  borderClassName = "",
  paddingClassName = "",
  marginClassName = "",
  fontSizeClassName = "",
  lineHeightClassName = "",
  foregroundStyleClassName = "",
  backgroundStyleClassName = "",
  disabled,
  children
}: {
  /**
   * A binding to a tag that determines the currently-selected option.
   */
  selection: Binding<string>,
  widthClassName?: string,
  heightClassName?: string,
  borderClassName?: string,
  paddingClassName?: string,
  marginClassName?: string,
  fontSizeClassName?: string,
  lineHeightClassName?: string,
  foregroundStyleClassName?: string,
  backgroundStyleClassName?: string,
  disabled?: boolean,
  /**
   * A view that contains the set of options.
   */
  children: React.ReactNode
}) {
  return (
    <select
      className={
        `${heightClassName} ${borderClassName} ${paddingClassName} ` +
          `${marginClassName} appearance-none ${fontSizeClassName} ` +
          `${lineHeightClassName} ${foregroundStyleClassName} ` +
          `${backgroundStyleClassName} ${widthClassName} truncate`
      }
      value={selection.value}
      onChange={event => selection.setValue(event.target.value)}
      disabled={disabled}
    >
      {children}
    </select>
  )
}

export function PickerOption({
  tag,
  disabled = false,
  children
}: {
  tag: string,
  disabled?: boolean,
  children: React.ReactNode
}) {
  return (
    <option
      value={tag}
      disabled={disabled}
    >
      {children}
    </option>
  )
}
