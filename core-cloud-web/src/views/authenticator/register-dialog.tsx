//
//  register-dialog.tsx
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

import useRegisterDialog from '@/view-models/authenticator/register-dialog'
import { createPortal } from 'react-dom'
import UIImage from '../ui-image'
import UISFSymbol from '../ui-sf-symbol'
import TextField from './text-field'
import UIProgress from '../ui-progress'

export default function RegisterDialog({
  setIsPresented
}: {
  setIsPresented: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const viewModel = useRegisterDialog({
    setIsPresented: setIsPresented
  })

  return createPortal(
    (
      <>
        <div
          className={
            'bg-backdrop fixed inset-0 z-11 ' + (
              viewModel.isClosing
                ? 'animate-[fadeOut_.2s_cubic-bezier(.32,.08,.24.1)_forwards]'
                : 'animate-[fadeIn_.2s_cubic-bezier(.32,.08,.24,1)_forwards]'
            )
          }
        />
        <div className="fixed inset-0 z-12 flex items-center justify-center">
          <div
            className={
              'w-160 h-4/5 m-5 bg-backgroundPrimary rounded-[11px] ' +
                'dark:shadow-[0_11px_34px_rgba(0,0,0,.65)] ' +
                'shadow-[0_11px_34px_rgba(0,0,0,.16)] ' + (
                  viewModel.isClosing
                    ? 'animate-[fadeOut_.2s_ease_forwards]'
                    :
                'animate-[fadeInAndBarelyScale_.2s_cubic-bezier(.32,.08,.24,1)]'
                )
            }
          >
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div
                  className={
                    'max-w-135 w-4/5 my-7.5 mx-auto flex flex-col items-center'
                  }
                >
                  <div className="h-12.75 mb-1.25 flex items-center">
                    {
                      process.env.NEXT_PUBLIC_AUTHENTICATOR_ICON_URLS
                        ? (
                          <UIImage
                            urls={
                              process.env.NEXT_PUBLIC_AUTHENTICATOR_ICON_URLS
                                .split(',')
                            }
                            className="size-6"
                          />
                        )
                        : (
                          <UISFSymbol
                            systemName="icloud"
                            className="w-6 fill-sk-body-text-color"
                          />
                        )
                    }
                  </div>
                  <h1
                    className={
                      'text-[28px] font-semibold text-sk-body-text-color ' +
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
                  <p className="text-base leading-6.25 text-sk-body-text-color">
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
                      'text-base leading-6.25 text-sk-body-text-color mb-2.5'
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
                          'text-base relative hover:underline'
                      }
                      onClick={() => viewModel.handleViewDisappear()}
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
                      <TextField
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
                        onChange={() => viewModel.handleFirstNameChange()}
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
                            <UISFSymbol
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
                      <TextField
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
                        onChange={() => viewModel.handleLastNameChange()}
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
                            <UISFSymbol
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
                    <TextField
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
                      onChange={() => viewModel.handleUsernameChange()}
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
                          <UISFSymbol
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
                    <TextField
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
                          <UISFSymbol
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
                                      <UISFSymbol
                                        className={
                                          'fill-[#008009] ' +
                                            'dark:fill-[#03a10e] w-2.75 mr-1.75'
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
                    <TextField
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
                      onChange={() => viewModel.handleConfirmPasswordChange()}
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
                          <UISFSymbol
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
                    <TextField
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
                      onChange={() => viewModel.handleMasterPasswordChange()}
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
                      <UISFSymbol
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
                          <UISFSymbol
                            systemName="exclamationmark.circle"
                            className={
                              'w-4 py-[1.5px] pr-0.75 fill-[#e30000] ' +
                                'dark:fill-[#ff3037]'
                            }
                          />
                          {
                            viewModel.masterPasswordMessage === '___'
                              ? (
                                <p>
                                  {'The master password cannot be the same ' +
                                    'as the '}
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: process.env.NEXT_PUBLIC_TITLE
                                        ? process.env.NEXT_PUBLIC_TITLE
                                        : ''
                                    }}
                                  />
                                  {' Account password.'}
                                </p>
                              )
                              : viewModel.masterPasswordMessage
                          }
                        </div>
                      )
                    }
                  </div>

                  <div
                    className={
                      'w-full relative mt-2.5 ' + (
                        (
                          !viewModel.isConfirmMasterPasswordVirginal &&
                            !!viewModel.confirmMasterPasswordMessage
                        )
                          ? ''
                          : 'mb-3.5'
                      )
                    }
                  >
                    <TextField
                      text={viewModel.confirmMasterPassword}
                      setText={viewModel.setConfirmMasterPassword}
                      isFocused={viewModel.isConfirmMasterPasswordFocused}
                      setIsFocused={viewModel.setIsConfirmMasterPasswordFocused}
                      prompt="Confirm Master Password"
                      paddingRightClassName="pr-4 focus:pr-3.75"
                      required={
                        !viewModel.isConfirmMasterPasswordVirginal &&
                          !!viewModel.confirmMasterPasswordMessage
                      }
                      onBlur={() => viewModel.handleConfirmMasterPasswordBlur()}
                      onChange={() => {
                        viewModel.handleConfirmMasterPasswordChange()
                      }}
                      type="secure"
                    />
                    {
                      (
                        !viewModel.isConfirmMasterPasswordVirginal &&
                          !!viewModel.confirmMasterPasswordMessage
                      ) && (
                        <div
                          className={
                            'mt-2 mb-3 text-[#e30000] dark:text-[#ff3037] ' +
                              'text-xs leading-4 flex'
                          }
                        >
                          <UISFSymbol
                            systemName="exclamationmark.circle"
                            className={
                              'w-4 py-[1.5px] pr-0.75 fill-[#e30000] ' +
                                'dark:fill-[#ff3037]'
                            }
                          />
                          {viewModel.confirmMasterPasswordMessage}
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

                  <picture>
                    <img
                      className="my-2.5 w-8.75"
                      src={
                        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHwA' +
                          'AAB2CAYAAAAKhffYAAAACXBIWXMAAAsTAAALEwEAmpwYAAA4' +
                          'W2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0' +
                          'IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRj' +
                          'emtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpu' +
                          'czptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42' +
                          'LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAx' +
                          'ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0' +
                          'dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRh' +
                          'eC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjph' +
                          'Ym91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6' +
                          'Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAg' +
                          'IHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVu' +
                          'dHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9w' +
                          'PSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAv' +
                          'IgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25z' +
                          'LmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAg' +
                          'eG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFw' +
                          'LzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAg' +
                          'ICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90' +
                          'aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0' +
                          'dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAg' +
                          'ICAgPHhtcDpDcmVhdGVEYXRlPjIwMTktMDMtMDdUMTY6MTc6' +
                          'NDUtMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8' +
                          'eG1wOk1vZGlmeURhdGU+MjAxOS0wMy0xMVQxNjozNzozMS0w' +
                          'NzowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6' +
                          'TWV0YWRhdGFEYXRlPjIwMTktMDMtMTFUMTY6Mzc6MzEtMDc6' +
                          'MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDx4bXA6' +
                          'Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTcg' +
                          'KE1hY2ludG9zaCk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAg' +
                          'ICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4K' +
                          'ICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhv' +
                          'dG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHhtcE1NOklu' +
                          'c3RhbmNlSUQ+eG1wLmlpZDpjYjQyOTY4Ni05NmVmLTQ1Mzct' +
                          'YmJkNC1hMDhlNzhiMjAzNWI8L3htcE1NOkluc3RhbmNlSUQ+' +
                          'CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6' +
                          'Y2I0Mjk2ODYtOTZlZi00NTM3LWJiZDQtYTA4ZTc4YjIwMzVi' +
                          'PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06' +
                          'T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6Y2I0Mjk2ODYt' +
                          'OTZlZi00NTM3LWJiZDQtYTA4ZTc4YjIwMzViPC94bXBNTTpP' +
                          'cmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpI' +
                          'aXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAg' +
                          'ICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNv' +
                          'dXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rp' +
                          'b24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAg' +
                          'ICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDpjYjQy' +
                          'OTY4Ni05NmVmLTQ1MzctYmJkNC1hMDhlNzhiMjAzNWI8L3N0' +
                          'RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxz' +
                          'dEV2dDp3aGVuPjIwMTktMDMtMTFUMTY6Mzc6MzEtMDc6MDA8' +
                          'L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2' +
                          'dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAy' +
                          'MDE3IChNYWNpbnRvc2gpPC9zdEV2dDpzb2Z0d2FyZUFnZW50' +
                          'PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4v' +
                          'PC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3Jk' +
                          'ZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAg' +
                          'ICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDx0aWZmOk9y' +
                          'aWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAg' +
                          'ICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwv' +
                          'dGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJl' +
                          'c29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0' +
                          'aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4y' +
                          'PC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhp' +
                          'ZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+' +
                          'CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xMjQ8' +
                          'L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhp' +
                          'ZjpQaXhlbFlEaW1lbnNpb24+MTE4PC9leGlmOlBpeGVsWURp' +
                          'bWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAg' +
                          'IDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAog' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAK' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'IAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAog' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAK' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'IAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAog' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAK' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'IAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAg' +
                          'ICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz5L8wdY' +
                          'AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqY' +
                          'AAAXb5JfxUYAAAslSURBVHja7J19kFZVHcc/93nZXVl2gV2I' +
                          't2VhWVrUBXlxBckIFEVATXOopIkkcEoyiyhnsCabMUKGXvC1' +
                          'tJeppknTcJrMEtKRfEnJACuGkqIiQjJgYY19YVl2b3/8zuM+' +
                          'rPvs83bPvec+z/nO3BkGeO793fO955zf+Z3f73sc13WxKB5E' +
                          'bBNYwi0s4RaWcAtLuIUl3MISbmEJt7CEW1jCLSzhFpZwC0u4' +
                          'hSXcEm5hCbewhFtYwi0s4Rbmwrng9nYdH9Fk4F3AbKABeAcQ' +
                          'BVygGTgA7AKeA/YBrX687PFWuK7J4X1NEY63+trOI4ALgHnA' +
                          'FKAWqFD/1gkcBv4CPK/a5aAOI5bOKiGm4b5j1MtNBc4HJgHD' +
                          'kwg/DpwDnAbeBE4Bewu8YzWoNmkEzgNqgMFJhFcCDtCi2uMo' +
                          '0KHDEC8JnwR8CrgaqEs1ogDV6poBrFCkPwU8qHp8IeFG4AZg' +
                          '0QD/pxQYr66F6u9eAbYA3/J69PNiDo8DXwR2ALcOQHYqDFGN' +
                          'sg34LjC6AIieAzwD/CAN2akwC9gE/AFYZhLh44GtwJ2q1+aD' +
                          'UmCVmsfmhpjsTwPbgQUe3KseeFj19LKgCZ8NvABc5nGDTVK9' +
                          '40MhJPvrwN3q4/USNwNPKl8oEMIbgZ8D4zQ1XAnwYzXUhwWb' +
                          'gbUa779AtUnEb8IrgZ8AI31oxIeAaSEgezWwxofnLAS+5zfh' +
                          '96u1pB+oBH4ElBtMdqMayv3CCuBjfhG+GFjuc4NOBT5rMOH3' +
                          'qriCn1iPBLO0Eh4B7gioUT+T6wtqxlUanNZMMEKtBrQSfqXy' +
                          'zIPAUOWpmoYgR56VufhR2RC+FImUBYVrNSx38sEUZL8gKIwC' +
                          'rtBFeBXBB0OmIfFoU7DIgA9QG+GTgXcG/HJRw5ZoMw2w4d3Z' +
                          'rmAyJXy8IY18niF2lJL9noEOTFAOnOeEjzOkoccaYsewbBta' +
                          'EyLIVqvnhFcY0tAVATuOCZTTu59twsfnOeGOIS/nGGKLY1ib' +
                          'eE54qyEv1wr0GGBHB9BmSJu8qYPw1w15ucOG2HEMOGKAHT3A' +
                          'IR2EHzCkoV8zxI5O4F8G2HEI+K8OwvcZQLoL7DFoHf5HA2zY' +
                          'ke10mynhR4EXA365PcBugwjfhmTeBomtuazjMsWWgF/uV2hK' +
                          '3c0RuwL+AJuBp3US/kvgTwF6xQ9iHu4J8NmPZOuwZUv4GSQ7' +
                          'NQjcZ4iT1BePAi8F8NwW4Ku5/DDbjJfHkeRFP/FP4C7MhEsw' +
                          'e+LrybEcKZectk/4uB7uQlKqWjAXO4Av+Pi8J4Fv5PrjXAg/' +
                          'jCQjnPDh5W4Bfov52AB836ePa5kaWXwjHGAnUijwP40vtxb4' +
                          'DuHBSvJMIU6D3wPvJ88wdz5J7VuB+RoCEMfUCLKZ8OEm4Msa' +
                          '7vs4kjF8KN8b5Vtb9qoifTPQ7cGLbUEK8Z4gvLgDSfjc6cG9' +
                          'jqhpbaladxM04YklwlrgYuAxst9UaAd+A1yjhqz9hB+/RtKP' +
                          '1uQYu/g78DWkpPqbXhrmZX34TuCDSDHge4ELgemI2kFyskCn' +
                          'Gpr2IpGqbcoZKTR0IoGZe1R7zFft0YCURCd3tmZF8m7Vjj/V' +
                          '5R/pUIDYn7RsqEZSgSqQOvJuZB+5GfgPxYMn1BVF0rSqkPJf' +
                          'B4nHtyC7XtrzDmKa79/s1dxTIOhWAZODQRlgVZyKDJbwIoOu' +
                          'IX0wvUpNJzEjD81U1CGFkmWqA7pqLj+iY+j3ivBSYAlwEVKh' +
                          'Mh6p7W6nV5ftb4hEyMuWY8YAH0bKt2bTf47768prf0ktd/9h' +
                          'AuGj1Rp8CaLJlg4diCTVA2rpUWxwgHVIJWxtmv87Vl3XIKXB' +
                          'P0N2Df8d1Bx+GxJp+1yGZKOG+Xnqi30Ecwoc/MAoRI9uQwZk' +
                          '9/fb1aqzLPOb8Fpl+Cby03m5AXiWLCsnQopaRI7sSg8+mofJ' +
                          'Iz8gW8JnKJIWedQQTYgYXyGjHNn88LL6dh0iNaKV8Bo179Z7' +
                          '3CDXI6HHQsV69WF7jVsRBUwthA9DxPLqNTXKqgIluwnRn9WF' +
                          'O5GtZM8JvxsRBdCFOZhTCuwl1qE/uPUAWcieZmLMdcBHNBs9' +
                          'As2KChEHOrugrROi/sQXz/XAScsEYxGVK08ILwc2+tQbtClE' +
                          'OUBLO4ypgosmOpz0p5zhEvyrIf8kGap0pCN8ueahPBmXoinU' +
                          '29UNIyrhlsujNIxyaOv0jXC/MESRnhfhZeQo/paHg1Oj48Yd' +
                          'XXB9U4TJo+F4my9DegX+C/atIgPxwkiauftcHw0uQaPuWWIO' +
                          '90m2oRH/hZCGIScw5Ez4xwPwahfqunGPm0cyd/YIQo4zMQXn' +
                          'RPh0JAfLb1yCpEKFHQsCeu75yF5F1oTfGJDBEwhWztILVCEK' +
                          '0EEgSpqoZSTFjxYFZHAswOHQy+E8SA23BcCgbAifS7Aym5eh' +
                          'P7lSJ+YH/PwBNWkjKb6QaIAGzyYcx170h8GGjFALMiW8RAVA' +
                          'gkQ8xMP6pZihB7swU8IbkLy0oLE8pMP6akPsaCJFckqkn/G/' +
                          'xACDp+pck2ucuxcbYssgUoR2+xJu0pJobcgI/4qBq4UBCY8C' +
                          '7zFsPpwfErJXGhg/mJmO8Dr8jZ2nQwT4EuaoFqdCHTkqKmlG' +
                          'Lf1spiQTPsNAR2k+oqpgMr6NRNdMwxjFaUrCpxvaoBsNG3mS' +
                          'cS9wuaG2OfRzgmQYCK9CpEBGGmbX55HMUZMxORXhMWTjwlQ0' +
                          'IqqH1YbYc7uBXnl/qKdP1DRB+ATMOLRlIMxD5EFmBWhDDDm8' +
                          'fUNIVg8NSLXK2wifZFDvGQgXIjLed+F/Xdo0RHzoZsKDGuW8' +
                          'vY3wOsIjDhBH8r1fRSStdHvIQ5DCyefxNzHRK4ztj/DxIXyR' +
                          'euQs85cReayJHt9/KPBRpKZ9E1LvTkjb6aw5ib7dPmRoQIQB' +
                          'b0P00bYgKpG5CgXOBj6AFBE0En5M6kt4JOSEJwcaViBVMgeA' +
                          '7cAvgD8DbyDSIwmUIrXqlWpKmKKG67lqehtE4aBercndBOFV' +
                          'aMoHDwgRNbxPpLdIcbfjcFD1+hJF9HDkiM1KCht16gM/lUz4' +
                          '6AJ/6ZkRx4jTgIPAKCQT51SiN1QUwVdezDgnecqOWLILHtHk' +
                          'VViMDOqRwg4XiEehLC7lRgCOA909UmhYBKhJOG5FQXjEgbZO' +
                          '2k+0cfrkKYk9uC7EohCPMpjCV6QcqYb29hhmhlT3I7XpnjiT' +
                          'g0rg6T1uxwv7etq6e2QzofMMjKvi2NUzorWDShjmUU9vRqpu' +
                          'yw103MoThJsom/U75GSBh/BgvznqwJGTbnVPD9WJ/JlTUkka' +
                          '7+qW8uE8CXeR7dJXEOEj0wgfrXo4EUMJr0KkJhcjAvNuvmzE' +
                          'o1Aah9JY7xWP4jr5D+fPIPlsG4G/JhrWMFSrpRkRZHPAxOBJ' +
                          'FDkNcQ1wFRLT1uHB5kr4c4i44BX0nugwHF+rkjOf1VQnIoJ/' +
                          'OiTZdspkPIWk3d6Eh0dKuxB1syPcReL1S5U9j6ax2xSUJ5xz' +
                          'UwnvD2eQc8HmIGerbAeO53nPTDNi9wM/VM9egigrhkkSvDzh' +
                          'nMcMdDDSoQ0R530M2c26FimtuTgbr96R/jjUTd0nd6nrRUTJ' +
                          'uJXwogwVYIshgfWwYq+6QNK0JiKlzo3qzzXqyx7G2bld3Y5D' +
                          'c1cPh3tcWhyHTuCochRfQ4Tp94Wc5JSExwvkpQ6o69mkTlyG' +
                          '7I7FFeFu0tXV7XLadTmNN4fsmU74kELo4ekcrA515TWBFwCi' +
                          'iR4eKWDCLc7GW4THbFsUF+GubYuiwFuhVYviQJklvEgJNzHY' +
                          'H1ZHMoK5Ga9ViWXZG/QeKpdYqXQgocxIn2VOaR7r9h7120zI' +
                          'PBFSwtuQLdJK5FRGUzAcdYD9/wcAQp/qMnrbfTgAAAAASUVO' +
                          'RK5CYII='
                      }
                    />
                  </picture>

                  <p
                    className={
                      'text-xs leading-4 text-[#6e6e73] dark:text-[#86868b] ' +
                        'text-center'
                    }
                  >
                    {'Your '}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: process.env.NEXT_PUBLIC_TITLE ?? ''
                      }}
                    />
                    {
                      ' Account information is used to allow you to sign in ' +
                        'securely and access your data. '
                    }
                    <span
                      dangerouslySetInnerHTML={{
                        __html: process.env.NEXT_PUBLIC_TITLE ?? ''
                      }}
                    />
                    {
                      ' records certain data for security, support and ' +
                        'reporting purposes. The majority of your '
                    }
                    <span
                      dangerouslySetInnerHTML={{
                        __html: process.env.NEXT_PUBLIC_TITLE ?? ''
                      }}
                    />
                    {
                      ' data is protected using end-to-end encryption. No ' +
                        'one else can access your end-to-end encrypted data, ' +
                        'not even '
                    }
                    <span
                      dangerouslySetInnerHTML={{
                        __html: process.env.NEXT_PUBLIC_TITLE ?? ''
                      }}
                    />
                    {
                      ', and this data remains secure even in the case of ' +
                        'a data breach in the cloud.'
                    }
                  </p>

                  {
                    viewModel.isError && (
                      <p
                        className={
                          'text-sm leading-5 mt-2.5 text-[#e30000] ' +
                            'dark:text-[#ff3037]'
                        }
                      >
                        {'Your account cannot be created at this time.'}
                      </p>
                    )
                  }
                </div>
              </div>

              <div
                className={
                  'px-7.5 py-5 text-center bg-[#fafafc] dark:bg-[#424245] ' +
                    'border-t border-[#d2d2d7] dark:border-[#1d1d1f] h-9 ' +
                    'box-content rounded-b-[11px]'
                }
              >
                {
                  !viewModel.isLoading
                    ? (
                      <div className="w-full h-full flex justify-between">
                        <button
                          className={
                            'min-w-36 min-h-4.5 rounded-lg cursor-pointer ' +
                              'bg-transparent border text-sm ' +
                              'dark:hover:border-transparent ' +
                              'active:text-white box-content ' +
                              'active:bg-sk-button-background-active ' +
                              'active:border-transparent py-2 px-3.75 ' +
                              'border-sk-button-border-color ' +
                              'text-sk-button-color hover:text-white ' +
                              'hover:bg-sk-button-background-hover'
                          }
                          onClick={() => viewModel.handleViewDisappear()}
                        >
                          {'Cancel'}
                        </button>
                        <button
                          className={
                            'min-w-36 min-h-4.5 rounded-lg text-sm px-3.75 ' +
                              'py-2 text-white ' +
                              'box-content bg-sk-button-background ' +
                              'active:bg-sk-button-background-active ' +
                              'hover:bg-sk-button-background-hover ' + (
                                /* Just OR every 'required'. */
                                (
                                  !viewModel.isFirstNameVirginal &&
                                    !!!viewModel.firstName
                                ) || (
                                  !viewModel.isLastNameVirginal &&
                                    !!!viewModel.lastName
                                ) || (
                                  !viewModel.isUsernameVirginal &&
                                    !!viewModel.usernameMessage
                                ) || (
                                  !viewModel.isPasswordVirginal &&
                                    !!viewModel.passwordMessage
                                ) || (
                                  !viewModel.isConfirmPasswordVirginal &&
                                    !!viewModel.confirmPasswordMessage
                                ) || (
                                  !viewModel.isMasterPasswordVirginal &&
                                    !!viewModel.masterPasswordMessage
                                ) || (
                                  !viewModel.isConfirmMasterPasswordVirginal &&
                                    !!viewModel.confirmMasterPasswordMessage
                                ) || (
                                  viewModel.isError
                                )
                                  ? 'opacity-42 dark:opacity-36 ' +
                                    'pointer-events-none select-none'
                                  : 'cursor-pointer'
                              )
                          }
                          onClick={() => viewModel.handleContinueButtonClick()}
                        >
                          {'Continue'}
                        </button>
                      </div>
                    )
                    : (
                      <div className="flex items-center justify-center h-full">
                        <UIProgress
                          marginClassName="mx-3 scale-50"
                          variant="8"
                        />
                        <span
                          className={
                            'mx-1.25 text-sk-body-text-color text-[19px] ' +
                              'font-semibold leading-5.75'
                          }
                        >
                          {'Loading…'}
                        </span>
                      </div>
                    )
                }
              </div>
            </div>
          </div>
        </div>
      </>
    ),
    document.body
  )
}
