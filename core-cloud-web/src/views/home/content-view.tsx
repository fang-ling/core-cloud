//
//  content-view.tsx
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

import useContentView from '@/view-models/home/content-view'
import SharedToolbar from '../shared-toolbar'
import Background from './background'
import ProfileCard from './profile-card'
import AppCard from './app-card'
import SharedFooter from '../shared-footer'

export default function ContentView() {
  const viewModel = useContentView({ })

  return (
    <>
      <div className="relative h-screen">
        {
          !viewModel.isCustomizationPresented && (
            <SharedToolbar
              source="home"
              apps={viewModel.apps}
              onCustomize={() => viewModel.handleCustomizeButtonClick()}
            />
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
          <div
            className={
              'w-full mx-7.5 md:mx-0 md:w-172.5 lg:w-258.75 flex items-center'
            }
          >
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
              <p className="hidden md:block">
                {'Select Background Color'}
              </p>
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

        <Background color="blue" />

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
                  'transition-[width] duration-250 ease-[ease-in-out] ' +
                  'md:flex-row'
              }
            >
              <ProfileCard
                username="j.appleseed@example.com"
                firstName="John"
                lastName="Appleseed"
              />
              <AppCard apps={viewModel.apps} />
            </div>
          </div>
          <div className="mt-auto">
            <SharedFooter />
          </div>
        </main>
      </div>
    </>
  )
}
