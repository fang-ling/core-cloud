//
//  authenticator-login-view.tsx
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

'use client'

import {
  useAuthenticatorLoginViewModel
} from '@/view-models/authenticator-login-view-model'
import UIImageView from './ui-image-view'
import UISFSymbolView from './ui-sf-symbol-view'
import AuthenticatorTextFieldView from './authenticator-text-field-view'
import UIProgressView from './ui-progress-view'
import AuthenticatorRegisterView from './authenticator-register-view'

export default function AuthenticatorLoginView() {
  const viewModel = useAuthenticatorLoginViewModel()

  return (
    <div className="flex flex-col items-center mb-48">
      <div
        className={
          'mt-11 w-160 shadow-[0_11px_34px_0_var(--color-fillSecondary)] ' +
            'dark:shadow-[0_11px_34px_0_var(--color-boxShadow)] h-152.5 ' +
            'rounded-[34px] bg-backgroundPrimary'
        }
      >
        <div className="mx-20 mt-10 flex flex-col items-center">
          <div className="relative">
            <svg
              viewBox="0 0 160 160"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              className="w-40"
            >
              <defs>
                <linearGradient
                  x1="100%"
                  y1="100%"
                  x2="50%"
                  y2="50%"
                  id="f2f15fa97739d6b8762a5540d983611bb"
                >
                  <stop stopColor="#8700FF" offset="0%" />
                  <stop stopColor="#EE00E1" stopOpacity="0" offset="100%" />
                </linearGradient>
                <linearGradient
                  x1="0%"
                  y1="100%"
                  x2="50%"
                  y2="50%"
                  id="f2f15fa97739d6b8762a5540d983611bc"
                >
                  <stop stopColor="#E00" offset="0%" />
                  <stop stopColor="#EE00E1" stopOpacity="0" offset="100%" />
                </linearGradient>
                <linearGradient
                  x1="100%"
                  y1="0%"
                  x2="50%"
                  y2="50%"
                  id="f2f15fa97739d6b8762a5540d983611bd"
                >
                  <stop stopColor="#00B1EE" offset="0%" />
                  <stop stopColor="#00B1EE" stopOpacity="0" offset="100%" />
                </linearGradient>
                <linearGradient
                  x1="-17.876%"
                  y1="21.021%"
                  x2="48.935%"
                  y2="50%"
                  id="f2f15fa97739d6b8762a5540d983611be"
                >
                  <stop stopColor="#FFA456" offset="0%" />
                  <stop stopColor="#FFA456" stopOpacity="0" offset="100%" />
                </linearGradient>
                <path
                  d={
                    'M89.905 152.381a3.81 3.81 0 110 7.619 3.81 3.81 0 ' +
                      '010-7.619zm-23.737 2.79a3.81 3.81 0 117.36 1.973 3.81 ' +
                      '3.81 0 01-7.36-1.972zm46.799-5.126a3.81 3.81 0 ' +
                      '11-7.36 1.972 3.81 3.81 0 ' +
                      '017.36-1.972zm-60.58-2.409a3.81 3.81 0 11-3.81 6.598 ' +
                      '3.81 3.81 0 013.81-6.598zm28.777-4.373a3.302 3.302 ' +
                      '0 11-.804 6.554 3.302 3.302 0 ' +
                      '01.804-6.554zm-16.684-1.899a3.338 3.338 0 11-2.5 6.19 ' +
                      '3.338 3.338 0 012.5-6.19zm36.901 2.383a3.338 3.338 0 ' +
                      '11-6.61.93 3.338 3.338 0 ' +
                      '016.61-.93zm28.591-4.621a3.81 3.81 0 11-6.598 3.81 ' +
                      '3.81 3.81 0 016.598-3.81zm-94.15-.941a3.81 3.81 0 ' +
                      '11-5.387 5.387 3.81 3.81 0 ' +
                      '015.388-5.387zm52.547-.486a3.023 3.023 0 110 6.047 ' +
                      '3.023 3.023 0 010-6.047zm-15.136.077a3.023 3.023 0 ' +
                      '11-1.565 5.841 3.023 3.023 0 ' +
                      '011.565-5.84zm-24.278-2.592a3.338 3.338 0 11-4.017 ' +
                      '5.331 3.338 3.338 0 014.017-5.331zm68.381.883a3.338 ' +
                      '3.338 0 11-6.145 2.609 3.338 3.338 0 ' +
                      '016.145-2.609zm-10.664-.222a3.023 3.023 0 ' +
                      '11-5.841 1.565 3.023 3.023 0 ' +
                      '015.84-1.565zm-48.079-1.912a3.023 3.023 0 11-3.023 ' +
                      '5.237 3.023 3.023 0 013.023-5.237zm22.334-3.47a2.62 ' +
                      '2.62 0 11-.639 5.201 2.62 2.62 0 ' +
                      '01.639-5.202zm-13.241-1.507a2.65 2.65 0 11-1.985 ' +
                      '4.912 ' +
                      '2.65 2.65 0 011.985-4.912zm29.286 1.891a2.65 2.65 0 ' +
                      '11-5.246.737 2.65 2.65 0 ' +
                      '015.246-.737zm23.196-3.668a3.023 3.023 0 11-5.236 ' +
                      '3.024 ' +
                      '3.023 3.023 0 015.236-3.024zm-74.721-.747a3.023 3.023 ' +
                      '0 11-4.276 4.276 3.023 3.023 0 ' +
                      '014.276-4.276zm98.125-2.255a3.81 3.81 0 11-5.387 ' +
                      '5.388 ' +
                      '3.81 3.81 0 015.387-5.388zM35.56 125.196a3.338 3.338 ' +
                      '0 11-5.26 4.11 3.338 3.338 0 ' +
                      '015.26-4.11zm-13.29-.428a3.81 3.81 0 11-6.599 3.81 ' +
                      '3.81 ' +
                      '3.81 0 016.599-3.81zm108.491-.249a3.338 3.338 0 ' +
                      '11-5.26 ' +
                      '4.11 3.338 3.338 0 015.26-4.11zm-75.396-.468a2.65 ' +
                      '2.65 ' +
                      '0 11-3.188 4.231 2.65 2.65 0 ' +
                      '013.188-4.231zm54.271.7a2.65 2.65 0 11-4.877 2.071 ' +
                      '2.65 ' +
                      '2.65 0 014.877-2.07zm21.327-9.436a3.023 3.023 0 ' +
                      '11-4.276 4.276 3.023 3.023 0 ' +
                      '014.276-4.276zm-86.23.808a2.65 2.65 0 11-4.175 3.262 ' +
                      '2.65 2.65 0 014.175-3.262zm-10.043-.339a3.023 3.023 0 ' +
                      '11-5.236 3.024 3.023 3.023 0 ' +
                      '015.236-3.024zm85.6-.197a2.65 2.65 0 11-4.175 3.262 ' +
                      '2.65 2.65 0 014.175-3.262zm-95.085-3.507a3.338 3.338 ' +
                      '0 11-6.145 2.609 3.338 3.338 0 ' +
                      '016.145-2.609zm115.534-2.19a3.338 3.338 0 11-4.018 ' +
                      '5.332 3.338 3.338 0 014.018-5.331zm12.102-3.672a3.81 ' +
                      '3.81 0 11-3.81 6.599 3.81 3.81 0 013.81-6.599zM12.65 ' +
                      '108.301a3.81 3.81 0 11-7.36 1.972 3.81 3.81 0 ' +
                      '017.36-1.972zm23.865-2.586a2.65 2.65 0 11-4.877 2.07 ' +
                      '2.65 2.65 0 014.877-2.07zm91.693-1.738a2.65 2.65 0 ' +
                      '11-3.188 4.231 2.65 2.65 0 ' +
                      '013.188-4.231zm10.11-2.915a3.023 3.023 0 11-3.023 ' +
                      '5.237 ' +
                      '3.023 3.023 0 013.023-5.237zm-111.262 1.653a3.023 ' +
                      '3.023 0 11-5.841 1.565 3.023 3.023 0 ' +
                      '015.84-1.565zm-8.458-5.983a3.338 3.338 0 11-6.611.93 ' +
                      '3.338 3.338 0 016.61-.93zm127.992-3.554a3.338 3.338 0 ' +
                      '11-2.5 6.19 3.338 3.338 0 ' +
                      '012.5-6.19zm-115.319.356a2.65 2.65 0 11-5.246.737 ' +
                      '2.65 2.65 0 ' +
                      '015.246-.737zm101.581-2.821a2.65 2.65 0 11-1.984 ' +
                      '4.912 ' +
                      '2.65 2.65 0 011.984-4.912zm19.627-1.547a3.81 3.81 0 ' +
                      '117.36 1.972 3.81 3.81 0 01-7.36-1.972zM3.81 ' +
                      '86.096a3.81 3.81 0 110 7.618 3.81 3.81 0 ' +
                      '010-7.619zm137.923-.705a3.023 3.023 0 11-1.565 5.84 ' +
                      '3.023 3.023 0 011.565-5.84zm-121.694-.3a3.023 3.023 0 ' +
                      '110 6.047 3.023 3.023 0 010-6.047zm-6.938-8.368a3.302 ' +
                      '3.302 0 11-.805 6.554 3.302 3.302 0 ' +
                      '01.805-6.554zm13.807.93a2.62 2.62 0 11-.638 5.202 ' +
                      '2.62 ' +
                      '2.62 0 01.638-5.202zm120.796-1.946a3.302 3.302 0 ' +
                      '11-.805 6.554 3.302 3.302 0 01.805-6.554zm-13.968 ' +
                      '1.14a2.62 2.62 0 11-.638 5.201 2.62 2.62 0 ' +
                      '01.638-5.201zm7.24-7.477a3.023 3.023 0 110 6.046 ' +
                      '3.023 ' +
                      '3.023 0 010-6.046zm-120.128-.094a3.023 3.023 0 ' +
                      '11-1.565 ' +
                      '5.841 3.023 3.023 0 011.565-5.84zm135.342-2.99a3.81 ' +
                      '3.81 0 110 7.619 3.81 3.81 0 010-7.62zM.162 ' +
                      '68.862a3.81 ' +
                      '3.81 0 117.36 1.972 3.81 3.81 0 ' +
                      '01-7.36-1.972zm29.28-5.072a2.65 2.65 0 11-1.984 4.913 ' +
                      '2.65 2.65 0 011.985-4.913zm104.844 1.355a2.65 2.65 0 ' +
                      '11-5.247.737 2.65 2.65 0 ' +
                      '015.247-.737zm-117.992-5.89a3.338 3.338 0 11-2.5 6.19 ' +
                      '3.338 3.338 0 012.5-6.19zm132.102 1.708a3.338 3.338 0 ' +
                      '11-6.61.929 3.338 3.338 0 ' +
                      '016.61-.93zm-8.594-4.735a3.023 3.023 0 11-5.84 1.565 ' +
                      '3.023 3.023 0 015.84-1.565zm-114.08-2.019a3.023 3.023 ' +
                      '0 11-3.024 5.237 3.023 3.023 0 ' +
                      '013.024-5.237zm9.569-3.001a2.65 2.65 0 11-3.189 4.23 ' +
                      '2.65 2.65 0 013.189-4.23zm93.381.423a2.65 2.65 0 ' +
                      '11-4.877 2.07 2.65 2.65 0 ' +
                      '014.877-2.07zm26.039-1.904a3.81 3.81 0 11-7.36 1.972 ' +
                      '3.81 3.81 0 017.36-1.972zM10.969 47.183a3.81 3.81 0 ' +
                      '11-3.809 6.599 3.81 3.81 0 ' +
                      '013.81-6.599zm12.693-3.781a3.338 3.338 0 11-4.017 ' +
                      '5.331 3.338 3.338 0 ' +
                      '014.017-5.331zm117.661.533a3.338 3.338 0 11-6.145 ' +
                      '2.608 3.338 3.338 0 016.145-2.608zm-9.76-2.235a3.023 ' +
                      '3.023 0 11-5.237 3.024 3.023 3.023 0 ' +
                      '015.237-3.024zm-97.233-.783a3.023 3.023 0 11-4.276 ' +
                      '4.276 3.023 3.023 0 014.276-4.276zm9.866-.35a2.65 ' +
                      '2.65 0 11-4.175 3.262 2.65 2.65 0 ' +
                      '014.175-3.262zm75.556-.537a2.65 2.65 0 11-4.175 3.262 ' +
                      '2.65 2.65 0 014.175-3.262zm24.578-8.608a3.81 3.81 0 ' +
                      '11-6.599 3.81 3.81 3.81 0 ' +
                      '016.599-3.81zm-122.515-.987a3.81 3.81 0 11-5.387 ' +
                      '5.388 ' +
                      '3.81 3.81 0 015.387-5.388zm33.736 2.159a2.65 2.65 0 ' +
                      '11-4.877 2.07 2.65 2.65 0 ' +
                      '014.877-2.07zm52.583-1.46a2.65 2.65 0 11-3.189 4.231 ' +
                      '2.65 2.65 0 013.189-4.231zm-73.251-1.14a3.338 3.338 0 ' +
                      '11-5.26 4.11 3.338 3.338 0 ' +
                      '015.26-4.11zm84.962-.194a3.023 3.023 0 11-4.276 4.276 ' +
                      '3.023 3.023 0 014.276-4.276zm-73.76.505a3.023 3.023 0 ' +
                      '11-5.238 3.024 3.023 3.023 0 ' +
                      '015.237-3.024zm83.999-.987a3.338 3.338 0 11-5.26 4.11 ' +
                      '3.338 3.338 0 015.26-4.11zm-61.5-1.487a2.65 2.65 0 ' +
                      '11-5.247.738 2.65 2.65 0 ' +
                      '015.247-.738zm26.024-2.284a2.65 2.65 0 11-1.984 ' +
                      '4.913 2.65 2.65 0 011.984-4.913zm-14.487-1.912a2.62 ' +
                      '2.62 0 11-.639 5.201 2.62 2.62 0 ' +
                      '01.639-5.201zm25.325-2.297a3.023 3.023 0 11-3.023 ' +
                      '5.237 ' +
                      '3.023 3.023 0 013.023-5.237zm-45.261 1.76a3.023 3.023 ' +
                      '0 11-5.841 1.565 3.023 3.023 0 ' +
                      '015.84-1.565zm-10.994-3.15a3.338 3.338 0 11-6.145 ' +
                      '2.609 ' +
                      '3.338 3.338 0 016.145-2.609zm66.254-1.84a3.338 3.338 ' +
                      '0 11-4.018 5.332 3.338 3.338 0 ' +
                      '014.018-5.331zm14.12-1.68a3.81 3.81 0 11-5.388 5.387 ' +
                      '3.81 3.81 0 015.388-5.387zm-40.217.463a3.023 3.023 0 ' +
                      '11-1.565 5.84 3.023 3.023 0 ' +
                      '011.565-5.84zm-16.701-.13a3.023 3.023 0 110 6.048 ' +
                      '3.023 ' +
                      '3.023 0 010-6.047zm-36.02.304a3.81 3.81 0 11-6.6 3.81 ' +
                      '3.81 3.81 0 016.6-3.81zm28.985-3.118a3.338 3.338 0 ' +
                      '11-6.611.93 3.338 3.338 0 ' +
                      '016.61-.93zm32.79-2.877a3.338 ' +
                      '3.338 0 11-2.5 6.19 3.338 3.338 0 012.5-6.19zM80.149 ' +
                      '8.66a3.302 3.302 0 11-.804 6.553 3.302 3.302 0 ' +
                      '01.804-6.553zm31.274-2.894a3.81 3.81 0 11-3.81 6.598 ' +
                      '3.81 3.81 0 013.81-6.598zm-57.03 2.217a3.81 3.81 0 ' +
                      '11-7.359 1.972 3.81 3.81 0 ' +
                      '017.36-1.972zM91.139.163a3.81 3.81 0 11-1.972 7.359 ' +
                      '3.81 3.81 0 011.972-7.36zM70.095 0a3.81 3.81 0 110 ' +
                      '7.619 3.81 3.81 0 010-7.619z'
                  }
                  id="f2f15fa97739d6b8762a5540d983611ba"
                />
              </defs>
              <use
                fill="#FFF"
                xlinkHref="#f2f15fa97739d6b8762a5540d983611ba"
              />
              <use
                fill="url(#f2f15fa97739d6b8762a5540d983611bb)"
                xlinkHref="#f2f15fa97739d6b8762a5540d983611ba"
              />
              <use
                fill="url(#f2f15fa97739d6b8762a5540d983611bc)"
                xlinkHref="#f2f15fa97739d6b8762a5540d983611ba"
              />
              <use
                fill="url(#f2f15fa97739d6b8762a5540d983611bd)"
                xlinkHref="#f2f15fa97739d6b8762a5540d983611ba"
              />
              <use
                fill="url(#f2f15fa97739d6b8762a5540d983611be)"
                xlinkHref="#f2f15fa97739d6b8762a5540d983611ba"
              />
            </svg>
            {
              process.env.NEXT_PUBLIC_AUTHENTICATOR_ICON_URLS
                ? (
                  <UIImageView
                    urls={
                      process.env.NEXT_PUBLIC_AUTHENTICATOR_ICON_URLS.split(',')
                    }
                    className="w-7.5 absolute top-1/2 left-1/2 -translate-1/2"
                  />
                )
                : (
                  <UISFSymbolView
                    systemName="icloud"
                    className={
                      'w-7.5 absolute top-1/2 left-1/2 -translate-1/2 ' +
                        'fill-systemBlack'
                    }
                  />
                )
            }
          </div>
          <div
            className={
              'mt-5 text-3xl select-none text-labelPrimary font-semibold ' +
                'leading-9'
            }
          >
            {'Sign in with '}
            <span
              dangerouslySetInnerHTML={{
                __html: process.env.NEXT_PUBLIC_TITLE ?? ''
              }}
            />
            {' Account'}
          </div>
        </div>
        <div className="w-144 h-120 mx-auto flex items-center relative -top-18">
          <div className="relative max-w-120 mx-auto h-67">
            <div className="min-h-45.5 max-w-120 w-120 relative">
              <AuthenticatorTextFieldView
                text={viewModel.username}
                setText={viewModel.setUsername}
                isFocused={viewModel.isUsernameFocused}
                setIsFocused={viewModel.setIsUsernameFocused}
                prompt="Email or Phone Number"
                disabled={viewModel.isLoading}
                onChange={() => viewModel.handleUsernameChange()}
                borderClassName={
                  !viewModel.isPasswordPresented
                    ? 'rounded-xl'
                    : 'rounded-t-xl'
                }
                required={viewModel.errorMessage.length > 0}
                onEnter={
                  (
                    viewModel.username.length <= 0 ||
                      viewModel.errorMessage.length > 0
                  )
                    ? undefined
                    : () => viewModel.handleContinueButtonClick()
                }
              />
              <AuthenticatorTextFieldView
                text={viewModel.password}
                setText={viewModel.setPassword}
                isFocused={viewModel.isPasswordFocused}
                setIsFocused={viewModel.setIsPasswordFocused}
                prompt="Password"
                disabled={viewModel.isLoading}
                required={viewModel.errorMessage.length > 0}
                onChange={() => viewModel.handlePasswordChange()}
                transitionClassName={
                  'transition-[height] duration-200 delay-200 ease-[linear]'
                }
                heightClassName={
                  viewModel.stage === 'username'
                    ? 'h-0'
                    : 'h-14'
                }
                containerHeightClassName={
                  viewModel.stage === 'username'
                    ? 'h-0'
                    : 'h-14'
                }
                containerOverflowClassName={
                  viewModel.isPasswordPresented
                    ? ''
                    : 'overflow-hidden'
                }
                borderClassName="rounded-b-xl"
                onEnter={
                  (
                    viewModel.username.length <= 0 ||
                      viewModel.errorMessage.length > 0
                  )
                    ? undefined
                    : () => viewModel.handleContinueButtonClick()
                }
                type="secure"
              />
            </div>
            {
              (!viewModel.isLoading && !viewModel.isRegisterFormPresented) && (
                <button
                  className={
                    'absolute right-2.5 border border-transparent pr-0.25 ' +
                      'pl-0.5 z-100 animate-[fade-in_.5s_ease-in-out] ' +
                      'transition-all duration-125 ease-[ease-in] ' + (
                        (
                          viewModel.username.length <= 0 ||
                            viewModel.errorMessage.length > 0
                        )
                          ? 'pointer-events-none opacity-60 '
                          : 'cursor-pointer '
                      ) + (
                        viewModel.stage === 'username'
                          ? (
                            viewModel.isUsernameFocused ||
                              viewModel.username.length > 0
                          )
                            ? 'top-5.75 '
                            : 'top-3.75 '
                          : (
                            viewModel.isPasswordFocused ||
                              viewModel.password.length > 0
                          )
                            ? 'top-19.75 '
                            : 'top-18.25 '
                      )
                  }
                  onClick={() => viewModel.handleContinueButtonClick()}
                >
                  <UISFSymbolView
                    className="fill-[#494949] dark:fill-[#666] size-7 p-0.25"
                    systemName="arrowshape.right.circle"
                    variant="thin"
                  />
                </button>
              )
            }
            <div
              className={
                'absolute right-6.5 pointer-events-none z-10 ' + (
                  viewModel.stage === 'username'
                    ? 'top-7.25'
                    : 'top-21.25'
                )
              }
              style={{ visibility: viewModel.isLoading ? 'visible' : 'hidden' }}
            >
              <UIProgressView
                widthClassName="w-[7.25px]"
                heightClassName="h-[2.25px]"
                translateX={6.25}
              />
            </div>

            <div className="flex justify-center items-center -mt-1.75">
              <div
                className="relative flex items-center justify-center"
                onClick={() => {
                  viewModel.handleIsRememberMeChange(!viewModel.isRememberMe)
                }}
              >
                <div className="relative flex items-center justify-center">
                  <input
                    className={
                      'appearance-none size-4 checked:bg-[#0071e3] ' +
                        'checked:border-[#0071e3] rounded-[3px] ' +
                        'bg-[hsla(0,0%,100%,.8)] border-[#86868b] ' +
                        'dark:bg-[hsla(0,0%,100%,.04)] dark:border-[#6e6e73] ' +
                        'border-1'
                    }
                    checked={viewModel.isRememberMe}
                    readOnly={true}
                    type="checkbox"
                  />
                  {
                    viewModel.isRememberMe && (
                      <div
                        className={
                          'absolute left-[3.5px] top-[3.5px] ' +
                            'pointer-events-none'
                        }
                      >
                        <UISFSymbolView
                          className="size-2.25 fill-white"
                          systemName="checkmark"
                          variant="semibold"
                        />
                      </div>
                    )
                  }
                </div>
                <p
                  className={
                    'text-base leading-6.25 pl-2.5 text-[#494949] ' +
                      'dark:text-white'
                  }
                >
                  {'Keep me signed in'}
                </p>
              </div>
            </div>

            {
              viewModel.errorMessage.length > 0 && (
                <div
                  className={
                    'relative -top-20 max-w-76.25 w-full mx-auto ' +
                      'animate-[fade-in_.2s_ease-in-out]'
                  }
                >
                  <div
                    className={
                      'absolute -ml-[50%] left-1/2 w-full bg-[#fae9a3] ' +
                        'rounded-[5px] border border-[rgba(185,149,1,.47)] ' +
                        'shadow-[0_5px_10px_2px_rgba(0,0,0,.1)] mt-1.25 ' +
                        'p-2.75 text-sm leading-5 text-[#503e30] ' +
                        'font-semibold before:size-3.75 before:bg-[#fae9a3] ' +
                        'before:absolute before:left-[47.2%] ' +
                        'before:rotate-135 before:skew-5 before:-top-2 ' +
                        'before:border-l before:border-[rgba(185,149,1,.47)] ' +
                        'before:border-b ' +
                      'before:shadow-[-1px_1px_2px_-1px_rgba(185,149,1,.47)] ' +
                        'text-center'
                    }
                  >
                    {viewModel.errorMessage}
                  </div>
                </div>
              )
            }
          </div>
        </div>

        <div className="flex flex-col items-center relative -top-51.5">
          <button
            className={ /* TODO */
              'text-systemBlue cursor-not-allowed mb-0.5 flex ' +
                'text-sm leading-5 relative hover:underline items-baseline'
            }
          >
            {'Forgot password?'}
            <UISFSymbolView
              className="fill-systemBlue w-2 ml-[4.2px]"
              systemName="arrow.up.right"
            />
          </button>
          <button
            className="cursor-pointer text-sm leading-4.5 text-systemBlue"
            onClick={() => viewModel.handleRegisterButtonClick()}
          >
            {'Create '}
            <span
              dangerouslySetInnerHTML={{
                __html: process.env.NEXT_PUBLIC_TITLE ?? ''
              }}
            />
            {' Account'}
          </button>
        </div>

        {
          /* We need conditional rendering to reset the state variables. */
          viewModel.isRegisterFormPresented && (
            <AuthenticatorRegisterView
              setIsPresented={viewModel.setIsRegisterFormPresented}
            />
          )
        }
      </div>
    </div>
  )
}
