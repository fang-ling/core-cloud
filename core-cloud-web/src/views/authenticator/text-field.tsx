//
//  text-field.tsx
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

import useTextField from '@/view-models/authenticator/text-field'

export default function TextField({
  text,
  setText,
  isFocused,
  setIsFocused,
  prompt,
  disabled,
  paddingRightClassName = 'pr-10.75',
  required = false,
  onBlur,
  type = 'plain',
  autoComplete = undefined,
  onChange,
  heightClassName = 'h-14',
  transitionClassName = '',
  borderClassName = 'rounded-xl',
  containerOverflowClassName = '',
  containerHeightClassName = '',
  onEnter
}: {
  text: string,
  setText: React.Dispatch<React.SetStateAction<string>>,
  isFocused: boolean,
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>,
  prompt: string,
  disabled?: boolean,
  paddingRightClassName?: string,
  required?: boolean,
  onBlur?: () => void,
  type?: 'plain' | 'secure',
  autoComplete?: 'username' | 'new-password',
  onChange?: (newText: string) => void,
  heightClassName?: string,
  transitionClassName?: string,
  borderClassName?: string,
  containerOverflowClassName?: string,
  containerHeightClassName?: string,
  onEnter?: () => void
}) {
  const viewModel = useTextField({
    setText: setText,
    setIsFocused: setIsFocused,
    onBlur: onBlur,
    onChange: onChange,
    onEnter: onEnter
  })

  return (
    <div
      className={
        `relative w-full ${containerOverflowClassName} ` +
          `${containerHeightClassName}`
      }
    >
      <input
        className={
          `pt-4.5 ${heightClassName} ${paddingRightClassName} ` +
            `text-base leading-9 w-full ${borderClassName} border ` +
            `focus:outline-hidden ${transitionClassName} focus:border-2 ` +
            'focus:border-[#0071e3] pl-4 focus:pl-3.75 text-ellipsis ' + (
              disabled
                ? (
                  'border-[hsla(240,2%,54%,.42)] ' +
                    'dark:border-[hsla(240,2%,54%,.36)] ' +
                    'bg-[rgba(0,0,0,.01)] dark:bg-[hsla(0,0%,100%,.01)] ' +
                    'text-[#6e6e73] dark:text-[#86868b]'
                )
                : 'text-[#494949] dark:text-labelPrimary ' + (
                  required
                    ? (
                      'border-[#e30000] dark:border-[#ff3037] ' +
                        'bg-[#fff2f4] dark:bg-[#300] ' +
                        'focus:bg-[hsla(0,0%,100%,.8)] ' +
                        'focus:dark:bg-[hsla(0,0%,100%,.04)] '
                    )
                    : (
                      'border-[#86868b] dark:border-[#6e6e73] ' +
                        'bg-[hsla(0,0%,100%,.8)] dark:bg-[hsla(0,0%,100%,.04)]'
                    )
                )
            )
        }
        disabled={disabled}
        type={type === 'secure' ? 'password' : undefined}
        required
        spellCheck={false}
        autoComplete={autoComplete}
        autoCorrect="off"
        autoCapitalize="off"
        value={text}
        onChange={event => viewModel.handleOnChange(event.target.value)}
        onFocus={() => viewModel.handleOnFocus()}
        onBlur={() => viewModel.handleOnBlur()}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            viewModel.handleOnEnter()
          }
        }}
      />
      <span
        className={
          'absolute pointer-events-none left-4.25 transition-all ' +
            'duration-125 ease-[ease-in] ' + (
              (isFocused || text.length > 0)
                ? 'text-xs h-4 leading-4 top-2.5 '
                : 'text-base h-5.25 leading-5.25 top-4.5 '
            ) + (
              required
                ? 'text-[#e30000] dark:text-[#ff3037]'
                : 'text-[#6e6e73] dark:text-[#86868b]'
            )
        }
      >
        {prompt}
      </span>
    </div>
  )
}
