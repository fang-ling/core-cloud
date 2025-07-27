//
//  register-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/7/27.
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

'use client'

import ImageView from '@/ui-elements/views/image-view'
import SFSymbolView from '@/ui-elements/views/sf-symbol-view'
import ReactDOM from 'react-dom'
import TextFieldView from './text-field-view'
import useRegisterViewModel from '../view-models/register-view-model'

export default function RegisterView({
  isPresented,
  setIsPresented
}: {
  isPresented: boolean,
  setIsPresented: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const viewModel = useRegisterViewModel()

  if (!isPresented) {
    return null
  }

  return ReactDOM.createPortal(
    (
      <>
        <div
          className={
            'bg-backdrop fixed inset-0 z-11 ' +
              'animate-[fadeIn_.2s_cubic-bezier(.32,.08,.24,1)_forwards]'
          }
        />
        <div className="fixed inset-0 z-12 flex items-center justify-center">
          <div
            className={
              'w-160 h-4/5 m-5 bg-backgroundPrimary rounded-[11px] ' +
                'dark:shadow-[0_11px_34px_rgba(0,0,0,.65)] ' +
                'shadow-[0_11px_34px_rgba(0,0,0,.16)] ' +
                'animate-[fadeInAndBarelyScale_.2s_cubic-bezier(.32,.08,.24,1)]'
            }
          >
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div
                  className={
                    'max-w-135 w-4/5 mt-7.5 mx-auto flex flex-col items-center'
                  }
                >
                  <div className="h-12.75 mb-1.25 flex items-center">
                    {
                      process.env.NEXT_PUBLIC_AUTHENTICATOR_ICON_URLS
                        ? (
                          <ImageView
                            urls={
                              process.env.NEXT_PUBLIC_AUTHENTICATOR_ICON_URLS
                                .split(',')
                            }
                            className="size-6"
                          />
                        )
                        : (
                          <SFSymbolView
                            systemName="icloud.fill"
                            className="w-6 fill-sk-body-text-color"
                          />
                        )
                    }
                  </div>
                  <h1
                    className={
                      'text-[28px] font-semibold text-body-text-color ' +
                        'leading-8 mb-3.75'
                    }
                  >
                    {'Create Your '}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: process.env.NEXT_PUBLIC_TITLE ?? ''
                      }}
                    />
                    {' Account'}
                  </h1>
                  <p className="text-base leading-6.25 text-body-text-color">
                    {'One '}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: process.env.NEXT_PUBLIC_TITLE ?? ''
                      }}
                    />
                    {' Account is all you need to access all '}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: process.env.NEXT_PUBLIC_TITLE ?? ''
                      }}
                    />
                    {' services.'}
                  </p>
                  <p
                    className={
                      'text-base leading-6.25 text-body-text-color mb-2.5'
                    }
                  >
                    {'Already have a '}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: process.env.NEXT_PUBLIC_TITLE ?? ''
                      }}
                    />
                    {' Account? '}
                    <button
                      className={
                        'pr-[18.7px] text-sk-body-link-color cursor-pointer ' +
                          'text-base relative'
                      }
                    >
                      {'Sign In'}
                      <svg
                        viewBox="0 0 268.0201416015625 158.116943359375"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        className={
                          'absolute h-[20.046875px] top-[3.4px] ' +
                            '-right-[8.5px] fill-sk-body-link-color'
                        }
                      >
                        <g
                          transform={
                            'matrix(1 0 0 1 85.49510009765618 ' +
                              '114.2884521484375)'
                          }
                        >
                          <path
                            d={
                              'M84.5703-17.334L84.5215-66.4551C84.5215-' +
                                '69.2383 82.7148-71.1914 ' +
                                '79.7852-71.1914L30.6641-71.1914C27.9297-' +
                                '71.1914 26.0742-69.0918 26.0742-' +
                                '66.748C26.0742-64.4043 28.1738-62.4023 ' +
                                '30.4688-62.4023L47.4609-62.4023L71.2891-' +
                                '63.1836L62.207-55.2246L13.8184-' +
                                '6.73828C12.9395-5.85938 12.4512-4.73633 ' +
                                '12.4512-3.66211C12.4512-1.31836 14.5508 ' +
                                '0.878906 16.9922 0.878906C18.1152 0.878906 ' +
                                '19.1895 0.488281 20.0684-0.439453L68.5547-' +
                                '48.877L76.6113-58.0078L75.7324-' +
                                '35.2051L75.7324-17.1387C75.7324-14.8438 ' +
                                '77.7344-12.6953 80.127-12.6953C82.4707-' +
                                '12.6953 84.5703-14.6973 84.5703-17.334Z'
                            }
                          />
                        </g>
                      </svg>
                    </button>
                  </p>

                  <div
                    className={
                      'pt-2.5 flex gap-2.5 w-full ' + (
                        (
                          !viewModel.isFirstNameVirginal &&
                            !!!viewModel.firstName
                        ) || (
                          !viewModel.isLastNameVirginal &&
                            !!!viewModel.lastName
                        )
                          ? ''
                          : 'mb-3.5'
                      )
                    }
                  >
                    <div className="w-full">
                      <TextFieldView
                        text={viewModel.firstName}
                        setText={viewModel.setFirstName}
                        isFocused={viewModel.isFirstNameFocused}
                        setIsFocused={viewModel.setIsFirstNameFocused}
                        prompt="First Name"
                        paddingRightClassName="pr-4 focus:pr-3.75"
                        required={
                          !viewModel.isFirstNameVirginal &&
                            !!!viewModel.firstName
                        }
                        onBlur={() => viewModel.handleFirstNameDeflower()}
                      />
                      {
                        (
                          !viewModel.isFirstNameVirginal &&
                            !!!viewModel.firstName
                        ) && (
                          <div
                            className={
                              'mt-2 mb-3 text-[#e30000] dark:text-[#ff3037] ' +
                                'text-sm leading-4 flex'
                            }
                          >
                            <SFSymbolView
                              systemName="exclamationmark.circle"
                              className={
                                'w-4 mr-1 fill-[#e30000] dark:fill-[#ff3037]'
                              }
                            />
                            {'Enter your first name.'}
                          </div>
                        )
                      }
                    </div>
                    <div className="w-full">
                      <TextFieldView
                        text={viewModel.lastName}
                        setText={viewModel.setLastName}
                        isFocused={viewModel.isLastNameFocused}
                        setIsFocused={viewModel.setIsLastNameFocused}
                        prompt="Last Name"
                        paddingRightClassName="pr-4 focus:pr-3.75"
                        required={
                          !viewModel.isLastNameVirginal && !!!viewModel.lastName
                        }
                        onBlur={() => viewModel.handleLastNameDeflower()}
                      />
                      {
                        (
                          !viewModel.isLastNameVirginal &&
                            !!!viewModel.lastName
                        ) && (
                          <div
                            className={
                              'mt-2 mb-3 text-[#e30000] dark:text-[#ff3037] ' +
                                'text-sm leading-4 flex'
                            }
                          >
                            <SFSymbolView
                              systemName="exclamationmark.circle"
                              className={
                                'w-4 mr-1 fill-[#e30000] dark:fill-[#ff3037]'
                              }
                            />
                            {'Enter your last name.'}
                          </div>
                        )
                      }
                    </div>
                  </div>
                  <div className="bg-[purple]">placeholder</div>
                </div>
              </div>

              <div
                className={
                  'px-7.5 py-5 text-center bg-[#fafafc] dark:bg-[#424245] ' +
                    'border-t border-[#d2d2d7] dark:border-[#1d1d1f] h-9 ' +
                    'box-content rounded-b-[11px]'
                }
              >
                <div className="w-full h-full flex justify-between">
                  <button
                    className={
                      'min-w-36 min-h-4.5 rounded-lg cursor-pointer text-sm ' +
                        'bg-transparent border ' +
                        'dark:hover:border-transparent active:text-white ' +
                        'active:bg-sk-button-background-active box-content ' +
                        'active:border-transparent py-2 px-3.75 ' +
                        'border-sk-button-border-color text-sk-button-color ' +
                        'hover:text-white hover:bg-sk-button-background-hover'
                    }
                  >
                    {'Cancel'}
                  </button>
                  <button
                    className={
                      'min-w-36 min-h-4.5 rounded-lg cursor-pointer text-sm ' +
                        'box-content py-2 px-3.75 bg-sk-button-background ' +
                        'text-white active:bg-sk-button-background-active ' +
                        'hover:bg-sk-button-background-hover ' + (
                          false ? 'opacity-42 dark:opacity-36' : ''
                        )
                    }
                  >
                    {'Continue'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    ),
    document.body
  )
}
