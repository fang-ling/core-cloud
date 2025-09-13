//
//  internal-text-field.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/9/6.
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
import NewLocalizer from "../localizer"

export default function InternalTextField({
  text,
  prompt,
  type,
  marginClassName = "",
  paddingClassName = "",
  borderClassName = "",
  fontSizeClassName = "",
  lineHeightClassName = "",
  foregroundStyleClassName = "",
  backgroundStyleClassName = "",
  promptMultilineTextAlignmentClassName = "",
  widthClassName = "",
  heightClassName= "",
  tintClassName = "",
  autocorrectionDisabled = false,
  autocompletionDisabled = false,
  autocapitalizationDisabled = false,
  disabled,
  onSumbit,
  onChange
}: {
  text: Binding<string>,
  prompt?: string,
  type: "password" | "text",
  marginClassName?: string,
  paddingClassName?: string,
  borderClassName?: string,
  fontSizeClassName?: string,
  lineHeightClassName?: string,
  foregroundStyleClassName?: string,
  backgroundStyleClassName?: string,
  promptMultilineTextAlignmentClassName?: string,
  widthClassName?: string,
  heightClassName?: string,
  tintClassName?: string,
  autocorrectionDisabled?: boolean,
  autocompletionDisabled?: boolean,
  autocapitalizationDisabled?: boolean,
  disabled?: boolean,
  onSumbit?: () => void,
  onChange?: () => void
}) {
  return (
    <input
      className={
        `${marginClassName} ${paddingClassName} ${borderClassName} ` +
          `${fontSizeClassName} ${foregroundStyleClassName} ` +
          `${promptMultilineTextAlignmentClassName} ${widthClassName} ` +
          `${heightClassName} text-ellipsis ${tintClassName} ` +
          `${backgroundStyleClassName} ${lineHeightClassName}`
      }
      type={type}
      placeholder={prompt ? NewLocalizer.default.localize(prompt) : undefined}
      value={text.value}
      autoComplete={autocompletionDisabled ? "off" : undefined}
      autoCapitalize={autocapitalizationDisabled ? "off" : undefined}
      autoCorrect={autocorrectionDisabled ? "off" : undefined}
      onChange={(event) => {
        text.setValue(event.target.value)
        onChange?.()
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onSumbit?.()
        }
      }}
      disabled={disabled}
    />
  )
}
