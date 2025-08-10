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
import Popover from './popover'
import Localizer from '@/localizer'
import { useEffect } from 'react'
import CoreCloudWeb from '@/core-cloud-web'

export default function ContentView() {
  const viewModel = useContentView({ })

  useEffect(() => {
    viewModel.handleViewAppear1()
    viewModel.handleViewAppear2()
  }, [])

  return (
    <>
      <div className="relative h-screen">
        {
          !viewModel.isCustomizationPresented && (
            <SharedToolbar
              source="home"
              apps={CoreCloudWeb.APPS}
              onCustomize={() => viewModel.handleCustomizeButtonClick()}
              username={viewModel.username}
              firstName={viewModel.firstName}
              lastName={viewModel.lastName}
              urls={viewModel.avatarURLs}
            />
          )
        }

        {/* Customization header */}
        <div
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
              {Localizer.default().localize('Done')}
            </button>

            <button
              className={
                'ml-auto rounded-[18px] px-2.5 py-1.75 ' +
                  'text-base h-10 leading-5.25 cursor-pointer ' +
                  'hover:bg-fillSecondary active:bg-fillPrimary ' +
                  'active:text-labelQuaternary flex gap-1.25 items-center ' + (
                    viewModel.radioMode === 1
                      ? 'bg-[rgba(199,199,204,.5)] dark:bg-gray3 ' +
                        'text-backgroundPrimary'
                      : 'text-labelPrimary'
                  )
              }
              onClick={(event) => viewModel.handleModalOpen(event, 1)}
            >
              <p className="hidden md:block">
                {Localizer.default().localize('Select Background Color')}
              </p>
              <div
                className={
                  'size-6.5 ml-0.5 rounded-full flex items-center ' +
                    'justify-center bg-systemWhite'
                }
              >
                <div
                  className="size-5 rounded-full"
                  style={{
                    backgroundColor: (
                      'var(--theme-color-system' +
                        viewModel.backgroundColor?.charAt(0).toUpperCase() +
                        viewModel.backgroundColor?.slice(1) +
                        ')'
                    )
                  }}
                />
              </div>
            </button>
          </div>
        </div>

        {
          viewModel.backgroundColor && (
            <Background color={viewModel.backgroundColor} />
          )
        }

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
                username={viewModel.username}
                firstName={viewModel.firstName}
                lastName={viewModel.lastName}
                urls={viewModel.avatarURLs}
              />
              <AppCard apps={CoreCloudWeb.APPS} />
            </div>
          </div>
          <div className="mt-auto">
            <SharedFooter />
          </div>
        </main>
      </div>

      {
        viewModel.radioMode === 1 && (
          <Popover
            onClose={() => viewModel.handleModalClose()}
            right={viewModel.modalRight}
          >
            <div className="flex gap-2 md:gap-0.5">
              {
                ['Blue', 'Purple', 'Green', 'Red', 'Orange', 'Yellow']
                  .map(color => (
                    <button
                      key={color}
                      className={
                        'size-8 p-0.25 flex items-center justify-center ' +
                          'hover:bg-fillSecondary rounded-full group ' +
                          'cursor-pointer active:bg-transparent ' + (
                            (
                              viewModel.backgroundColor ===
                                color.toLocaleLowerCase()
                            )
                              ? 'border-[1.5px] border-gray1'
                              : ''
                          )
                      }
                      onClick={() => {
                        viewModel.handleBackgroundColorChange(
                          color.toLocaleLowerCase()
                        )
                      }}
                    >
                      <div
                        className={
                          'size-6 bg-systemBlue rounded-full ' +
                            'group-active:opacity-30'
                        }
                        style={{
                          backgroundColor: `var(--theme-color-system${color})`
                        }}
                      />
                    </button>
                  ))
              }
            </div>
          </Popover>
        )
      }
    </>
  )
}
