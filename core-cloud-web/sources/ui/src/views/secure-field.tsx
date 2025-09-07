//
//  secure-field.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/9/7.
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

export default function SecureField({
  text,
  prompt,
  onSubmit,
  onChange,
  marginClassName = "",
  widthClassName = "",
  heightClassName = "",
  paddingClassName = "",
  borderClassName = "",
  foregroundStyleClassName = "",
  fontSizeClassName = "",
  promptMultilineTextAlignmentClassName = "",
  tintClassName = "",
  autocorrectionDisabled = false,
  autocompletionDisabled = false,
  autocapitalizationDisabled = false
}: {
  /**
   * A binding to the text that the field displays and edits.
   */
  text: Binding<string>,
  /**
   * A text that represents the secure field's prompt. The prompt provides
   * guidance on what people should type into the secure field.
   */
  prompt?: string,
  /**
   * An action to perform when the user submits a value.
   */
  onSubmit?: () => void,
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
  fontSizeClassName?: string,
  promptMultilineTextAlignmentClassName?: string,
  tintClassName?: string,
  autocorrectionDisabled?: boolean,
  autocompletionDisabled?: boolean,
  autocapitalizationDisabled?: boolean
}) {
  return (
    <InternalTextField
      text={text}
      type="password"
      prompt={prompt}
      onSumbit={onSubmit}
      onChange={onChange}
      marginClassName={marginClassName}
      widthClassName={widthClassName}
      heightClassName={heightClassName}
      paddingClassName={paddingClassName}
      borderClassName={borderClassName}
      foregroundStyleClassName={foregroundStyleClassName}
      fontSizeClassName={fontSizeClassName}
      promptMultilineTextAlignmentClassName={
        promptMultilineTextAlignmentClassName
      }
      tintClassName={tintClassName}
      autocorrectionDisabled={autocorrectionDisabled}
      autocompletionDisabled={autocompletionDisabled}
      autocapitalizationDisabled={autocapitalizationDisabled}
    />
  )
}
