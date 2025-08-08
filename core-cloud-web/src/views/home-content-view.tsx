//
//  home-content-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/7/25.
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

import { useHomeContentViewModel } from '@/view-models/home-content-view-model'
import HomeAppCardView from './home-app-card-view'
import HomeBackgroundView from './home-background-view'
import HomeProfileCardView from './home-profile-card-view'
import SharedFooterView from './shared-footer-view'
import SharedToolbarView from './shared-toolbar-view'

export default function HomeContentView() {
  const viewModel = useHomeContentViewModel({ })

  return (
    <div className="relative h-screen">
      {
        !viewModel.isCustomizationPresented && (
          <SharedToolbarView source="home" />
        )
      }

      {/* Customization header */}
      {/*<div
        className={
          'fixed h-20 w-full transition-[top] duration-250 ease-[ease-out] ' +
            'bg-[rgba(248,248,252,0.4)] dark:bg-[rgba(56,56,61,0.6)] ' +
            'backdrop-blur-[15px] z-10 flex items-center justify-center ' + (
              viewModel.isCustomizationPresented
                ? 'top-0'
                : '-top-20.25'
            )
        }
      >
        <div className="w-258.75 flex items-center">
          <button
            className={
              'bg-appTint text-systemWhite h-8.5 px-4 text-base ' +
                'font-semibold leading-5.25 rounded-[18px] ' +
                'dark:hover:bg-[rgb(41,169,255)] cursor-pointer ' +
                'dark:active:bg-[rgb(82,186,255)] ' +
                'active:text-[rgba(255,255,255,.3)] ' +
                'hover:bg-[rgb(0,93,186)] active:bg-[rgb(0,73,145)]'
            }
            onClick={() => viewModel.handleCustomizeDoneButtonClick()}
          >
            {'Done'}
          </button>

          <button
            className={
              'ml-auto rounded-[18px] px-2.5 py-1.75 text-labelPrimary ' +
                'text-base h-10 leading-5.25 cursor-pointer ' +
                'hover:bg-fillSecondary active:bg-fillPrimary ' +
                'active:text-labelQuaternary flex gap-1.25 items-center'
            }
          >
            {'Select Background Color'}
            <div
              className={
                'size-6.5 ml-0.5 rounded-full flex items-center ' +
                  'justify-center bg-systemWhite'
              }
            >
              <div
                className={
                  'size-5 rounded-full ' + (
                    viewModel.backgroundColor === 'blue'
                      ? 'bg-systemBlue'
                      : 'TODO'
                  )
                }
              />
            </div>
          </button>
        </div>
        </div>*/}

      <HomeBackgroundView color="blue" />

      <main
        className={
          'o1verflow-hidden overflow1-y-auto absolute top-0 inset-0 h-full ' +
            'w-full flex flex-col'
        }
      >
        <div className="flex flex-col items-center w-full pt-11">
          <div
            className={
              'pt-10 pb-23.75 w-86.25 md:w-172.5 lg:w-258.75 flex flex-col ' +
                'transition-[width] duration-250 ease-[ease-in-out] md:flex-row'
            }
          >
            <HomeProfileCardView
              username="j.appleseed@example.com"
              firstName="John"
              lastName="Appleseed"
            />
            <HomeAppCardView
              apps={[]}
            />
          </div>

          {/* Customize button */}
          {/*<div className="flex w-full justify-center mb-32.5">
            <button
              className={
                'h-10 w-fit px-4 min-w-51.75 rounded-[22px] ' +
                  'text-labelPrimary backdrop-blur-[15px] text-base ' +
                  'leading-5.25 dark:bg-[rgba(56,56,61,.6)] ' +
                  'bg-[rgba(248,248,252,.4)] cursor-pointer flex ' +
                  'items-center justify-center ' +
                  'hover:dark:bg-[rgba(56,56,61,.8)] ' +
                  'hover:bg-[rgba(248,248,252,.6)] ' +
                  'active:bg-[rgba(248,248,252,.5)] ' +
                  'active:text-labelQuaternary ' +
                  'dark:active:bg-[rgba(56,56,61,.7)] group'
              }
              onClick={() => viewModel.handleCustomizeButtonClick()}
            >
              <svg
                viewBox="0 0 113.696044921875 102.9775390625"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                className={
                  'h-3.25 mr-2 fill-labelPrimary ' +
                    'group-active:fill-labelQuaternary'
                }
              >
                <g transform="matrix(1 0 0 1 -5.042011718750018 86.71875)">
                  <path
                    d={
                      'M50.4883-61.3281C51.2695-61.3281 51.709-61.8164 ' +
                        '51.8555-62.5488C53.4668-70.8496 53.3203-70.9961 ' +
                        '61.9629-72.7051C62.7441-72.8516 63.2324-73.291 ' +
                        '63.2324-74.0234C63.2324-74.7559 62.7441-75.1953 ' +
                        '62.0117-75.3418C53.2715-77.1484 53.2715-77.2949 ' +
                        '51.8555-85.498C51.709-86.2305 51.2695-86.7188 ' +
                        '50.4883-86.7188C49.7559-86.7188 49.3164-86.2305 ' +
                        '49.1699-85.498C47.5586-77.1484 47.7051-76.8555 ' +
                        '39.0137-75.3418C38.2812-75.2441 37.793-74.7559 ' +
                        '37.793-74.0234C37.793-73.291 38.2812-72.8516 ' +
                        '39.0137-72.7051C47.7051-70.8984 47.7051-70.752 ' +
                        '49.1699-62.5C49.3164-61.8164 49.7559-61.3281 ' +
                        '50.4883-61.3281ZM93.2129-43.8477C94.043-43.8477 ' +
                        '94.5801-44.4336 94.7754-45.2637C96.5332-54.834 ' +
                        '96.3867-55.3223 106.494-57.0312C107.373-57.1777 ' +
                        '107.959-57.7148 107.959-58.5449C107.959-59.4238 ' +
                        '107.373-59.9609 106.543-60.1074C96.3867-61.9629 ' +
                        '96.2402-62.3535 94.7754-71.875C94.6289-72.7051 ' +
                        '94.043-73.291 93.2129-73.291C92.334-73.291 ' +
                        '91.7969-72.7051 91.6504-71.875C89.9902-62.207 ' +
                        '90.0391-61.6211 79.8828-60.1074C79.0527-60.0098 ' +
                        '78.418-59.4238 78.4668-58.5449C78.4668-57.7148 ' +
                        '79.0039-57.1777 79.8828-57.0312C90.0391-55.2246 ' +
                        '90.1855-54.7852 91.6504-45.2637C91.7969-44.4336 ' +
                        '92.334-43.8477 ' +
                        '93.2129-43.8477ZM23.4863-28.8086C24.3164-28.8086 ' +
                        '24.9023-29.3945 25-30.2246C26.5137-39.8438 ' +
                        '26.709-40.2832 36.7676-41.9922C37.6465-42.1387 ' +
                        '38.2324-42.6758 38.2324-43.5059C38.2324-44.3848 ' +
                        '37.6465-44.9219 36.8164-45.0684C26.6602-46.9238 ' +
                        '26.6113-47.3145 25-56.7871C24.9023-57.666 ' +
                        '24.3164-58.252 23.4863-58.252C22.6562-58.252 ' +
                        '22.0703-57.666 21.9727-56.8359C20.459-47.1191 ' +
                        '20.3125-46.7285 10.1562-45.0684C9.32617-44.9219 ' +
                        '8.74023-44.3848 8.74023-43.5059C8.74023-42.6758 ' +
                        '9.32617-42.1387 10.1562-41.9922C20.3125-40.1367 ' +
                        '20.2637-39.6973 21.9727-30.1758C22.0703-29.3945 ' +
                        '22.6562-28.8086 23.4863-28.8086ZM107.227 ' +
                        '13.1348C109.814 15.7715 114.258 15.7715 116.797 ' +
                        '13.1348C119.385 10.4492 119.385 6.20117 116.797 ' +
                        '3.51562L70.4102-43.1152C67.8223-45.752 ' +
                        '63.3789-45.752 60.8398-43.1152C58.252-40.4297 ' +
                        '58.252-36.1328 60.8398-33.4961ZM47.2168 ' +
                        '14.6973C48.3398 14.6973 49.1699 13.916 49.2676 ' +
                        '12.7441C50.8301-0.488281 51.4648-0.976562 ' +
                        '64.9902-3.02734C66.3086-3.22266 67.0898-3.95508 ' +
                        '67.0898-5.07812C67.0898-6.20117 66.3086-6.93359 ' +
                        '65.2344-7.17773C51.4648-9.81445 50.8301-9.7168 ' +
                        '49.2676-22.9004C49.1699-24.1211 48.3398-24.9023 ' +
                        '47.2168-24.9023C46.0938-24.9023 45.2637-24.1211 ' +
                        '45.166-22.998C43.5059-9.47266 43.0176-9.0332 ' +
                        '29.1992-7.17773C28.1738-7.03125 27.3438-6.20117 ' +
                        '27.3438-5.07812C27.3438-4.00391 28.125-3.22266 ' +
                        '29.1992-3.02734C43.0664-0.341797 43.457-0.341797 ' +
                        '45.166 12.8418C45.2637 13.916 46.1426 14.6973 ' +
                        '47.2168 14.6973ZM109.814 ' +
                        '8.88672L83.7891-17.2363L86.7676-20.2637L112.891 ' +
                        '5.85938C113.965 6.93359 114.307 8.25195 113.281 ' +
                        '9.32617C112.256 10.2539 110.938 10.0098 109.814 ' +
                        '8.88672Z'
                    }
                  />
                </g>
              </svg>
              {'Customize'}
              </button>
              </div>*/}
        </div>
        <div className="mt-auto">
          <SharedFooterView />
        </div>
      </main>
    </div>
  )
}
