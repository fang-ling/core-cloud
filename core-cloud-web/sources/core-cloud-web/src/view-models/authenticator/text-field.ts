//
//  text-field.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/7/26.
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

export default function useTextField({
  setText,
  setIsFocused,
  onBlur,
  onChange,
  onEnter
}: {
  setText: React.Dispatch<React.SetStateAction<string>>,
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>,
  onBlur?: () => void,
  onChange?: (newText: string) => void,
  onEnter?: () => void
}) {
  /* MARK: - Event handlers */
  function handleOnChange(newText: string) {
    setText(newText)
    onChange?.(newText)
  }

  function handleOnFocus() {
    setIsFocused(true)
  }

  function handleOnBlur() {
    setIsFocused(false)
    onBlur?.()
  }

  function handleOnEnter() {
    onEnter?.()
  }

  return {
    handleOnChange,
    handleOnFocus,
    handleOnBlur,
    handleOnEnter
  }
}
