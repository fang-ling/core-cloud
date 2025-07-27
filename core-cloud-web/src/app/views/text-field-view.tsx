//
//  text-field-view.tsx
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

import useTextFieldViewModel from '../view-models/text-field-view-model'

export default function TextFieldView({
  text,
  setText,
  isFocused,
  setIsFocused,
  prompt,
  disabled
}: {
  text: string,
  setText: React.Dispatch<React.SetStateAction<string>>,
  isFocused: boolean,
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>,
  prompt: string,
  disabled?: boolean
}) {
  const viewModel = useTextFieldViewModel({
    setText: setText,
    setIsFocused: setIsFocused
  })

  return (
    <div className="relative">
      <input
        className={
          'pr-10.75 pt-4.5 h-14 ' +
            'border rounded-xl text-base leading-9 w-full focus:border-2 ' +
            'focus:outline-hidden ' +
            'focus:border-[#0071e3] pl-4 focus:pl-3.75 text-ellipsis ' + (
              disabled
                ? (
                  'border-[hsla(240,2%,54%,.42)] ' +
                    'dark:border-[hsla(240,2%,54%,.36)] ' +
                    'bg-[rgba(0,0,0,.01)] dark:bg-[hsla(0,0%,100%,.01)] ' +
                    'text-[#6e6e73] dark:text-[#86868b]'
                )
                : (
                  'border-[#86868b] dark:border-[#6e6e73] ' +
                    'bg-[hsla(0,0%,100%,.8)] dark:bg-[hsla(0,0%,100%,.04)] ' +
                    'text-[#494949] dark:text-labelPrimary'
                )
            )
        }
        disabled={disabled}
        required
        autoComplete="username"
        autoCorrect="off"
        autoCapitalize="off"
        value={text}
        onChange={event => viewModel.handleOnChange(event.target.value)}
        onFocus={() => viewModel.handleOnFocus()}
        onBlur={() => viewModel.handleOnBlur()}
      />
      <span
        className={
          'absolute pointer-events-none left-4.25 transition-all ' +
            'text-[#6e6e73] dark:text-[#86868b] duration-125 ' +
            'ease-[ease-in] ' + (
              (isFocused || text.length > 0)
                ? 'text-xs h-4 leading-4 top-2.5'
                : 'text-base h-5.25 leading-5.25 top-4.5'
            )
        }
      >
        {prompt}
      </span>
    </div>
  )
}
