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
                              'mt-2 text-[#e30000] dark:text-[#ff3037] ' +
                                'text-xs leading-4 flex'
                            }
                          >
                            <SFSymbolView
                              systemName="exclamationmark.circle"
                              className={
                                'w-4 py-[1.5px] pr-0.75 fill-[#e30000] ' +
                                  'dark:fill-[#ff3037]'
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
                              /* Add mb-3 if the next is not a line. */
                              'mt-2 text-[#e30000] dark:text-[#ff3037] ' +
                                'text-xs leading-4 flex'
                            }
                          >
                            <SFSymbolView
                              systemName="exclamationmark.circle"
                              className={
                                'w-4 py-[1.5px] pr-0.75 fill-[#e30000] ' +
                                  'dark:fill-[#ff3037]'
                              }
                            />
                            {'Enter your last name.'}
                          </div>
                        )
                      }
                    </div>
                  </div>
                  <hr
                    className={
                      'my-[21.25px] border-t border-[#e8e8ed] ' +
                        'dark:border-[#424245] w-full'
                    }
                  />
                  <div
                    className={
                      'w-full mt-2.5 ' + (
                        (
                          !viewModel.isUsernameVirginal &&
                            !!viewModel.usernameMessage
                        )
                          ? ''
                          : 'mb-3.5'
                      )
                    }
                  >
                    <TextFieldView
                      text={viewModel.username}
                      setText={viewModel.setUsername}
                      isFocused={viewModel.isUsernameFocused}
                      setIsFocused={viewModel.setIsUsernameFocused}
                      prompt="name@example.com"
                      autoComplete="username"
                      paddingRightClassName="pr-4 focus:pr-3.75"
                      required={
                        !viewModel.isUsernameVirginal &&
                          !!viewModel.usernameMessage
                      }
                      onBlur={() => viewModel.handleUsernameBlur()}
                    />
                    {
                      (
                        !viewModel.isUsernameVirginal &&
                          !!viewModel.usernameMessage
                      ) && (
                        <div
                          className={
                            'mt-2 mb-3 text-[#e30000] dark:text-[#ff3037] ' +
                              'text-xs leading-4 flex'
                          }
                        >
                          <SFSymbolView
                            systemName="exclamationmark.circle"
                            className={
                              'w-4 py-[1.5px] pr-0.75 fill-[#e30000] ' +
                                'dark:fill-[#ff3037]'
                            }
                          />
                          {viewModel.usernameMessage}
                        </div>
                      )
                    }
                  </div>
                  <p
                    className={
                      'text-sm leading-5 mb-2.5 text-[#424245] ' +
                        'dark:text-[#d2d2d7] w-full'
                    }
                  >
                    {'This will be your new '}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: process.env.NEXT_PUBLIC_TITLE ?? ''
                      }}
                    />
                    {' Account.'}
                  </p>

                  <div
                    className={
                      'w-full relative ' + (
                        (
                          !viewModel.isPasswordVirginal &&
                            !!viewModel.passwordMessage
                        )
                          ? ''
                          : 'mb-3.5'
                      )
                    }
                  >
                    <TextFieldView
                      text={viewModel.password}
                      setText={viewModel.setPassword}
                      isFocused={viewModel.isPasswordFocused}
                      setIsFocused={viewModel.setIsPasswordFocused}
                      prompt="Password"
                      autoComplete="new-password"
                      paddingRightClassName="pr-4 focus:pr-3.75"
                      required={
                        !viewModel.isPasswordVirginal &&
                          !!viewModel.passwordMessage
                      }
                      onBlur={() => viewModel.handlePasswordBlur()}
                      onChange={newPassword => {
                        viewModel.handlePasswordChange(newPassword)
                      }}
                      type="secure"
                    />
                    {
                      (
                        !viewModel.isPasswordVirginal &&
                          !!viewModel.passwordMessage
                      ) && (
                        <div
                          className={
                            'mt-2 mb-3 text-[#e30000] dark:text-[#ff3037] ' +
                              'text-xs leading-4 flex'
                          }
                        >
                          <SFSymbolView
                            systemName="exclamationmark.circle"
                            className={
                              'w-4 py-[1.5px] pr-0.75 fill-[#e30000] ' +
                                'dark:fill-[#ff3037]'
                            }
                          />
                          {viewModel.passwordMessage}
                        </div>
                      )
                    }
                    {
                      viewModel.isPasswordFocused && (
                        <div
                          className={
                            'absolute max-w-87.5 bg-[#e8e8ed] ' +
                              'dark:bg-[#333336] rounded-xl px-4 py-3 ' +
                              'after:absolute after:size-3.75 ' +
                              'after:rounded-xs after:bg-[#e8e8ed] ' +
                              'after:dark:bg-[#333336] after:-bottom-1 ' +
                              'after:left-4 after:rotate-45 text-[#1d1d1f] ' +
                              'dark:text-[#f5f5f7] text-sm leading-4 ' + (
                                (
                                  !viewModel.isPasswordVirginal &&
                                    !!viewModel.passwordMessage
                                )
                                  ? 'bottom-25.5'
                                  : 'bottom-16.5'
                              )
                          }
                        >
                          <p className="mt-[11.19px]">
                            {`Strength: ${viewModel.passwordStrength}%`}
                          </p>
                          {/* Progress */}
                          <div
                            className={
                              'mt-[11.19px] bg-[#d2d2d7] rounded-[3px] ' +
                                'mb-1.75 h-1.25'
                            }
                          >
                            <div
                              className={
                                'rounded-[3px] mb-2.5 h-1.25 ' + (
                                  viewModel.passwordStrength <= 30
                                    ? 'bg-[#e30000]'
                                    : viewModel.passwordStrength <= 60
                                      ? 'bg-[#f56300]'
                                      : 'bg-[#008009]' /* >= 90 */
                                )
                              }
                              style={{
                                width: `${viewModel.passwordStrength}%`
                              }}
                            />
                          </div>
                          <p className="mt-[11.19px] leading-4.5">
                            {'Password Requirements'}
                          </p>
                          <ul
                            className={
                              'mt-1.25 text-[#6e6e73] dark:text-[#86868b] ' +
                                'leading-4.5'
                            }
                          >
                            {
                              [
                                'At least 8 characters.',
                                'At least 1 number.',
                                'At least 1 uppercase letter.',
                                'At least 1 lowercase letter.',
                                'At least one special character.'
                              ].map((text, index) => (
                                <li
                                  key={index}
                                  className={
                                    'flex items-center ' + (
                                      ((viewModel.mask >> index) & 1) === 1
                                        ? 'text-[#008009] dark:text-[#03a10e]'
                                        : ''
                                    )
                                  }
                                >
                                  {
                                    ((viewModel.mask >> index) & 1) === 1 && (
                                      <SFSymbolView
                                        className={
                                          'fill-[#008009] dark:fill-[#03a10e] ' +
                                            'w-2.75 mr-1.75'
                                        }
                                        systemName="checkmark"
                                        variant="semibold"
                                      />
                                    )
                                  }
                                  {text}
                                </li>
                              ))
                            }
                          </ul>
                          <p className="mt-[11.19px] leading-5">
                            {
                              'Avoid using a password that you use with ' +
                                'other websites or that might be easy for ' +
                                'someone else to guess.'
                            }
                          </p>
                        </div>
                      )
                    }
                  </div>

                  <div
                    className={
                      'w-full relative ' + (
                        (
                          !viewModel.isConfirmPasswordVirginal &&
                            !!viewModel.confirmPasswordMessage
                        )
                          ? ''
                          : 'mb-3.5'
                      )
                    }
                  >
                    <TextFieldView
                      text={viewModel.confirmPassword}
                      setText={viewModel.setConfirmPassword}
                      isFocused={viewModel.isConfirmPasswordFocused}
                      setIsFocused={viewModel.setIsConfirmPasswordFocused}
                      prompt="Confirm Password"
                      paddingRightClassName="pr-4 focus:pr-3.75"
                      required={
                        !viewModel.isConfirmPasswordVirginal &&
                          !!viewModel.confirmPasswordMessage
                      }
                      onBlur={() => viewModel.handleConfirmPasswordBlur()}
                      type="secure"
                    />
                    {
                      (
                        !viewModel.isConfirmPasswordVirginal &&
                          !!viewModel.confirmPasswordMessage
                      ) && (
                        <div
                          className={
                            'mt-2 mb-3 text-[#e30000] dark:text-[#ff3037] ' +
                              'text-xs leading-4 flex'
                          }
                        >
                          <SFSymbolView
                            systemName="exclamationmark.circle"
                            className={
                              'w-4 py-[1.5px] pr-0.75 fill-[#e30000] ' +
                                'dark:fill-[#ff3037]'
                            }
                          />
                          {viewModel.confirmPasswordMessage}
                        </div>
                      )
                    }
                  </div>

                  <hr
                    className={
                      'my-[21.25px] border-t border-[#e8e8ed] ' +
                        'dark:border-[#424245] w-full'
                    }
                  />

                  <div
                    className={
                      'w-full relative mt-2.5 ' + (
                        (
                          !viewModel.isMasterPasswordVirginal &&
                            !!viewModel.masterPasswordMessage
                        )
                          ? ''
                          : 'mb-3.5'
                      )
                    }
                  >
                    <TextFieldView
                      text={viewModel.masterPassword}
                      setText={viewModel.setMasterPassword}
                      isFocused={viewModel.isMasterPasswordFocused}
                      setIsFocused={viewModel.setIsMasterPasswordFocused}
                      prompt="Master Password"
                      paddingRightClassName="pr-12.25 focus:pr-12"
                      required={
                        !viewModel.isMasterPasswordVirginal &&
                          !!viewModel.masterPasswordMessage
                      }
                      onBlur={() => viewModel.handleMasterPasswordBlur()}
                      type="secure"
                    />
                    <button
                      className="absolute top-4 right-3 cursor-pointer"
                      onMouseEnter={() => {
                        viewModel.handleMasterPasswordQuestionHover(true)
                      }}
                      onMouseLeave={() => {
                        viewModel.handleMasterPasswordQuestionHover(false)
                      }}
                    >
                      <SFSymbolView
                        className="w-6.25 p-0.75 fill-[#6e6e73]"
                        systemName="questionmark.circle.fill"
                    />
                    </button>
                    {
                      viewModel.isMasterPasswordQuestionPresented && (
                        <div
                          className={
                            'absolute max-w-60 bg-[#e8e8ed] right-0 ' +
                              'dark:bg-[#333336] rounded-xl px-4 py-3 ' +
                              'after:absolute after:size-3.75 ' +
                              'after:rounded-xs after:bg-[#e8e8ed] ' +
                              'after:dark:bg-[#333336] after:-bottom-1 ' +
                              'after:right-5 after:rotate-45 text-[#1d1d1f] ' +
                              'dark:text-[#f5f5f7] text-sm leading-4.5 ' + (
                                (
                                  !viewModel.isMasterPasswordVirginal &&
                                    !!viewModel.masterPasswordMessage
                                )
                                  ? 'bottom-20.5'
                                  : 'bottom-11.5'
                              )
                          }
                        >
                          {
                            'This password will be used to derive the ' +
                              'encryption keys for the majority of your '
                          }
                          <span
                            dangerouslySetInnerHTML={{
                              __html: process.env.NEXT_PUBLIC_TITLE ?? ''
                            }}
                          />
                          {
                            ' data, thereby protecting it using end-to-end ' +
                              'encryption.'
                          }
                        </div>
                      )
                    }
                    {
                      (
                        !viewModel.isMasterPasswordVirginal &&
                          !!viewModel.masterPasswordMessage
                      ) && (
                        <div
                          className={
                            'mt-2 mb-3 text-[#e30000] dark:text-[#ff3037] ' +
                              'text-xs leading-4 flex'
                          }
                        >
                          <SFSymbolView
                            systemName="exclamationmark.circle"
                            className={
                              'w-4 py-[1.5px] pr-0.75 fill-[#e30000] ' +
                                'dark:fill-[#ff3037]'
                            }
                          />
                          {viewModel.masterPasswordMessage}
                        </div>
                      )
                    }
                  </div>
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
