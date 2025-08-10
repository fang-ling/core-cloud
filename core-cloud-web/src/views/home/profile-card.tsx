//
//  profile-card.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/5.
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

import useProfileCard from '@/view-models/home/profile-card'
import UIImage from '../ui-image'
import Localizer from '@/localizer'

export default function ProfileCard({
  urls = [],
  firstName,
  lastName,
  username
}: {
  urls?: string[],
  firstName: string,
  lastName: string,
  username: string
}) {
  const viewModel = useProfileCard()

  return (
    <div className="size-78.75 m-3.75 min-w-78.75 min-h-78.75">
      <div
        className={
          'size-full rounded-[11px] backdrop-blur-xl cursor-pointer ' + (
            /* bg gradient */
            'bg-radial-[circle_at_100%_0px] from-[rgba(255,255,255,.85)] ' +
              'to-[rgba(245,245,245,.13)] to-183% ' +
              'dark:bg-radial-[circle_at_97%_3.3%] ' +
              'dark:from-[rgba(0,0,0,.35)] dark:to-[rgba(0,0,0,.6)] ' +
              'dark:to-164% '
          ) +
            'transition-[box-shadow,scale] duration-200 ' +
            'ease-[cubic-bezier(.32,.08,.24,1)] px-7.5 pb-7.5 relative ' + (
              viewModel.isHover
                ? 'shadow-[20px_20px_41px_var(--theme-color-boxShadow)] ' +
                  'scale-[1.019]'
                : 'shadow-[17px_20px_40px_var(--theme-color-boxShadow)] ' +
                  'scale-100'
            )
        }
        onMouseEnter={() => {
          viewModel.handleCardHover(true)
        }}
        onMouseLeave={() => {
          viewModel.handleCardHover(false)
        }}
      >
        {/* Avatar */}
        <div className="w-full h-46.25">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 185 196"
            className="absolute w-46.25 h-49 left-0.25 top-3 dark:hidden"
          >
            <defs>
              <path
                id="0cdfbf55a4f6da8df6561d7ad9023ce8b"
                d="M0 0h185v196H0z"
              />
              <path
                d={
                  'M133.685 175C162.38 175 185 153.618 185 ' +
                    '127.246c0-19.838-11.668-36.944-29.884-45.021C154.997 ' +
                    '40.173 124.636 10 85.823 10c-25.36 0-43.575 ' +
                    '13.305-55.243 29.341-23.336-6.058-48.457 11.285-49.172 ' +
                    '37.776C-40.022 80.917-53 100.28-53 123.327c0 27.796 ' +
                    '24.526 51.554 57.149 51.554l129.536.119z'
                }
                id="0cdfbf55a4f6da8df6561d7ad9023ce8e"
              />
              <linearGradient
                x1="19.823%"
                y1="45.17%"
                x2="-1.128%"
                y2="45.17%"
                id="0cdfbf55a4f6da8df6561d7ad9023ce8a"
              >
                <stop stopColor="#FFF" offset="0%" />
                <stop stopColor="#FFF" stopOpacity="0" offset="100%" />
              </linearGradient>
              <filter
                x="-4.6%"
                y="-6.7%"
                width="109.2%"
                height="113.3%"
                filterUnits="objectBoundingBox"
                id="0cdfbf55a4f6da8df6561d7ad9023ce8d"
              >
                <feGaussianBlur
                  stdDeviation="6.5"
                  in="SourceAlpha"
                  result="shadowBlurInner1"
                />
                <feOffset
                  dy="9"
                  in="shadowBlurInner1"
                  result="shadowOffsetInner1"
                />
                <feComposite
                  in="shadowOffsetInner1"
                  in2="SourceAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                  result="shadowInnerInner1"
                />
                <feColorMatrix
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.133002328 0"
                  in="shadowInnerInner1"
                />
              </filter>
            </defs>
            <g fill="none" fillRule="evenodd">
              <mask
                id="0cdfbf55a4f6da8df6561d7ad9023ce8c"
                fill="url(#0cdfbf55a4f6da8df6561d7ad9023ce8a)"
              >
                <use xlinkHref="#0cdfbf55a4f6da8df6561d7ad9023ce8b" />
              </mask>
              <g
                fillRule="nonzero"
                mask="url(#0cdfbf55a4f6da8df6561d7ad9023ce8c)"
                fill="#000"
              >
                <use
                  filter="url(#0cdfbf55a4f6da8df6561d7ad9023ce8d)"
                  xlinkHref="#0cdfbf55a4f6da8df6561d7ad9023ce8e"
                />
              </g>
            </g>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 185 196"
            className="absolute w-46.25 h-49 left-0.25 top-3 hidden dark:block"
          >
            <defs>
              <path
                id="f918692421c6e9400709c2052f6146bfb"
                d="M0 0h185v196H0z"
              />
              <path
                d={
                  'M133.685 175C162.38 175 185 153.618 185 ' +
                    '127.246c0-19.838-11.668-36.944-29.884-45.021C154.997 ' +
                    '40.173 124.636 10 85.823 10c-25.36 0-43.575 ' +
                    '13.305-55.243 29.341-23.336-6.058-48.457 11.285-49.172 ' +
                    '37.776C-40.022 80.917-53 100.28-53 123.327c0 27.796 ' +
                    '24.526 51.554 57.149 51.554l129.536.119z'
                }
                id="f918692421c6e9400709c2052f6146bfe"
              />
              <linearGradient
                x1="19.823%"
                y1="45.17%"
                x2="-1.128%"
                y2="45.17%"
                id="f918692421c6e9400709c2052f6146bfa"
              >
                <stop stopColor="#FFF" offset="0%" />
                <stop stopColor="#FFF" stopOpacity="0" offset="100%" />
              </linearGradient>
              <filter
                x="-4.6%"
                y="-6.7%"
                width="109.2%"
                height="113.3%"
                filterUnits="objectBoundingBox"
                id="f918692421c6e9400709c2052f6146bfd"
              >
                <feGaussianBlur
                  stdDeviation="6.5"
                  in="SourceAlpha"
                  result="shadowBlurInner1"
                />
                <feOffset
                  dy="9"
                  in="shadowBlurInner1"
                  result="shadowOffsetInner1"
                />
                <feComposite
                  in="shadowOffsetInner1"
                  in2="SourceAlpha"
                  operator="arithmetic"
                  k2="-1"
                  k3="1"
                  result="shadowInnerInner1"
                />
                <feColorMatrix
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.93673514 0"
                  in="shadowInnerInner1"
                />
              </filter>
            </defs>
            <g fill="none" fillRule="evenodd">
              <mask
                id="f918692421c6e9400709c2052f6146bfc"
                fill="url(#f918692421c6e9400709c2052f6146bfa)"
              >
                <use xlinkHref="#f918692421c6e9400709c2052f6146bfb" />
              </mask>
              <g
                fillRule="nonzero"
                mask="url(#f918692421c6e9400709c2052f6146bfc)"
                fill="#000"
              >
                <use
                  filter="url(#f918692421c6e9400709c2052f6146bfd)"
                  xlinkHref="#f918692421c6e9400709c2052f6146bfe"
                />
              </g>
            </g>
          </svg>
          <div
            className={
              'size-28.5 rounded-full absolute top-8.5 left-7.5 ' + (
                urls.length > 0
                  ? 'bg-fillTertiary'
                  : ''

              )
            }
          >
            {
              urls.length > 0
                ? (
                  <UIImage
                    urls={urls}
                    className={
                      'size-28.5 transition-opacity duration-200 ease-[ease] ' +
                        'rounded-full ' + (
                          viewModel.isLoaded ? 'opacity-100' : 'opacity-0'
                        )
                    }
                    onLoad={() => viewModel.handleImageLoad()}
                  />
                )
                : (
                  <svg
                    viewBox="0 0 99.6099853515625 99.6572265625"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    className={
                      'animate-[fadeIn_.2s_ease] size-full fill-labelTertiary'
                    }
                    width="114"
                    height="114"
                  >
                    <g
                      transform="matrix(1 0 0 1 -8.740039062500045 85.05859375)"
                    >
                      <path
                        d={
                          'M58.5449 14.5508C85.791 14.5508 108.35-8.05664 ' +
                            '108.35-35.2539C108.35-62.5 85.7422-85.0586 ' +
                            '58.4961-85.0586C31.2988-85.0586 8.74023-62.5 ' +
                            '8.74023-35.2539C8.74023-8.05664 31.3477 14.5508 ' +
                            '58.5449 ' +
                            '14.5508ZM58.5449-18.6523C43.8477-18.6523 ' +
                            '32.5684-13.3789 27.5879-7.51953C21.0449-14.8926 ' +
                            '17.0898-24.5605 17.0898-35.2539C17.0898-58.3008 ' +
                            '35.4492-76.7578 58.4961-76.7578C81.543-76.7578 ' +
                            '100-58.3008 100.049-35.2539C100.098-24.5605 ' +
                            '96.0938-14.8438 89.502-7.51953C84.5703-13.3789 ' +
                            '73.2422-18.6523 ' +
                            '58.5449-18.6523ZM58.5449-26.9531C67.9688-' +
                            '26.8555 75.293-34.8633 ' +
                            '75.293-45.3613C75.293-55.2246 67.9199-63.3789 ' +
                            '58.5449-63.3789C49.1699-63.3789 41.748-55.2246 ' +
                            '41.7969-45.3613C41.8457-34.8633 49.1699-27.0508 ' +
                            '58.5449-26.9531Z'
                        }
                      />
                    </g>
                  </svg>
                )
            }
          </div>
        </div>

        {/* User info */}
        <div className="mb-3.75">
          <h2
            className={
              'text-[32px] font-semibold leading-9 text-ellipsis ' +
                'whitespace-nowrap text-labelPrimary'
            }
          >
            {
              Localizer.default().nameOrder() === 'firstNameLastName'
                ? `${firstName} ${lastName}`
                : `${lastName} ${firstName}`
            }
          </h2>
          <p
            className={
              'mt-1.25 text-base text-label text-ellipsis ' +
                'whitespace-nowrap leading-5 text-labelSecondary'
            }
          >
            {username}
          </p>
        </div>

        {/* Plan name */}
        <div
          className="text-[16px] font-semibold leading-5.25 text-labelPrimary"
          dangerouslySetInnerHTML={{
            __html: process.env.NEXT_PUBLIC_TITLE ?? ''
          }}
        />
      </div>
    </div>
  )
}
