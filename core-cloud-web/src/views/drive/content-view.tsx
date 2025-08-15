//
//  content-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/10.
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

import SharedToolbar from '../shared-toolbar'
import useContentView from '@/view-models/drive/content-view'
import { useEffect } from 'react'
import SharedFooter from '../shared-footer'
import UILoading from '../ui-loading'
import SharedBodyguard from '../shared-bodyguard'
import Button from './button'
import Sidebar from './sidebar'
import DetailView from './detail-view'
import Localizer from '@/localizer'
import LocationDialog from './location-dialog'

export default function ContentView() {
  const viewModel = useContentView({ })

  useEffect(() => {
    viewModel.handleViewAppear1()
    viewModel.handleViewAppear2()
  }, [])

  return (
    <>
      <div className="flex flex-col h-dvh">
        <SharedToolbar
          source="drive"
          variant={
            (!viewModel.isLoading && viewModel.isPassed)
              ? 'app'
              : 'thinMaterial'
          }
          firstName={viewModel.firstName}
          lastName={viewModel.lastName}
          username={viewModel.username}
          urls={viewModel.avatarURLs}
        />

        {
          viewModel.isLoading
            ? (
              <>
                <div
                  className={
                    'w-full h-full flex items-center justify-center flex-col'
                  }
                >
                  <UILoading />
                </div>
                <SharedFooter />
              </>
            )
            : viewModel.isPassed
              ? (
                <div className="relative h-full">
                  <Sidebar
                    sections={viewModel.sections}
                    selectedKey={viewModel.selectedSidebarItemKey}
                    onChange={(key) => {
                      viewModel.handleSelectedSidebarItemChange(key)
                    }}
                    isOn={viewModel.isSidebarOn}
                    setIsOn={viewModel.setIsSidebarOn}
                  >
                    <div className="mt-auto pb-2.5">
                      <button
                        className={
                          'cursor-pointer rounded-lg text-appTint ' +
                            'text-[15px] font-semibold leading-4.5 px-2.5 ' +
                            'flex items-center h-7.5 hover:bg-fillTertiary ' +
                            'active:bg-appTint/16 active:text-appTint/30'
                        }
                        onClick={() => viewModel.handleNewLocationButtonClick()}
                      >
                        <svg
                          viewBox="0 0 99.6099853515625 99.6572265625"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1 size-3.75 fill-current"
                        >
                          <g
                            transform={
                              'matrix(1 0 0 1 -8.740039062500045 85.05859375)'
                            }
                          >
                            <path
                              d={
                                'M58.5449 14.5508C85.791 14.5508 ' +
                                  '108.35-8.05664 108.35-35.2539C108.35-62.5 ' +
                                  '85.7422-85.0586 ' +
                                  '58.4961-85.0586C31.2988-85.0586 ' +
                                  '8.74023-62.5 ' +
                                  '8.74023-35.2539C8.74023-8.05664 31.3477 ' +
                                  '14.5508 58.5449 14.5508ZM58.5449 ' +
                                  '6.25C35.498 6.25 17.0898-12.207 ' +
                                  '17.0898-35.2539C17.0898-58.3008 ' +
                                  '35.4492-76.7578 ' +
                                  '58.4961-76.7578C81.543-76.7578 ' +
                                  '100-58.3008 ' +
                                  '100.049-35.2539C100.098-12.207 81.5918 ' +
                                  '6.25 58.5449 ' +
                                  '6.25ZM36.9629-35.2051C36.9629-32.8125 ' +
                                  '38.6719-31.2012 ' +
                                  '41.1621-31.2012L54.3945-31.2012L54.3945-' +
                                  '17.8711C54.3945-15.4297 56.0547-13.7695 ' +
                                  '58.4473-13.7695C60.8887-13.7695 ' +
                                  '62.5977-15.4297 62.5977-17.8711L62.5977-' +
                                  '31.2012L75.8789-31.2012C78.3203-31.2012 ' +
                                  '80.0293-32.8125 ' +
                                  '80.0293-35.2051C80.0293-37.6465 ' +
                                  '78.3203-39.3555 ' +
                                  '75.8789-39.3555L62.5977-39.3555L62.5977-' +
                                  '52.5879C62.5977-55.127 60.8887-56.7871 ' +
                                  '58.4473-56.7871C56.0547-56.7871 ' +
                                  '54.3945-55.0781 ' +
                                  '54.3945-52.5879L54.3945-39.3555L41.1621-' +
                                  '39.3555C38.6719-39.3555 36.9629-37.6465 ' +
                                  '36.9629-35.2051Z'
                              }
                            />
                          </g>
                        </svg>
                        {Localizer.default().localize('New Location')}
                      </button>
                    </div>
                  </Sidebar>
                  {/* Sidebar toggle */}
                  <Button
                    className="absolute top-1.5 left-2.5 z-10"
                    onClick={() => viewModel.handleSidebarToggle()}
                  >
                    <svg
                      viewBox="0 0 115.1376953125 89.9912109375"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      height={14.687759}
                      width={18.791999}
                      className="overflow-visible"
                    >
                      <g
                        transform={
                          'matrix(1 0 0 1 -12.451118164062564 80.2255859375)'
                        }
                      >
                        <path
                          d={
                            'M27.7832 9.76562L112.256 9.76562C122.51 ' +
                              '9.76562 127.588 4.6875 ' +
                              '127.588-5.37109L127.588-64.9902C127.588-' +
                              '75.0488 122.51-80.127 112.256-80.127L27.' +
                              '7832-80.127C17.5781-80.127 12.4512-75.0977 ' +
                              '12.4512-64.9902L12.4512-5.37109C12.4512 ' +
                              '4.73633 17.5781 9.76562 27.7832 ' +
                              '9.76562ZM27.8809 1.9043C22.998 1.9043 ' +
                              '20.3125-0.683594 ' +
                              '20.3125-5.76172L20.3125-64.5996C20.3125-' +
                              '69.6777 22.998-72.2656 ' +
                              '27.8809-72.2656L49.6582-72.2656L49.6582 ' +
                              '1.9043ZM112.158-72.2656C116.992-72.2656 ' +
                              '119.727-69.6777 ' +
                              '119.727-64.5996L119.727-5.76172C119.727-' +
                              '0.683594 116.992 1.9043 112.158 ' +
                              '1.9043L57.3242 ' +
                              '1.9043L57.3242-72.2656ZM40.2832-54.1504C41.' +
                              '748-54.1504 43.0664-55.4688 ' +
                              '43.0664-56.8848C43.0664-58.3496 ' +
                              '41.748-59.6191 ' +
                              '40.2832-59.6191L29.7852-59.6191C28.3203-' +
                              '59.6191 27.0508-58.3496 ' +
                              '27.0508-56.8848C27.0508-55.4688 ' +
                              '28.3203-54.1504 29.7852-54.1504ZM40.2832-' +
                              '41.5039C41.748-41.5039 43.0664-42.8223 ' +
                              '43.0664-44.2871C43.0664-45.752 ' +
                              '41.748-46.9727 ' +
                              '40.2832-46.9727L29.7852-46.9727C28.3203-' +
                              '46.9727 27.0508-45.752 ' +
                              '27.0508-44.2871C27.0508-42.8223 ' +
                              '28.3203-41.5039 ' +
                              '29.7852-41.5039ZM40.2832-28.9062C41.748-' +
                              '28.9062 43.0664-30.127 ' +
                              '43.0664-31.5918C43.0664-33.0566 ' +
                              '41.748-34.3262 ' +
                              '40.2832-34.3262L29.7852-34.3262C28.3203-' +
                              '34.3262 27.0508-33.0566 ' +
                              '27.0508-31.5918C27.0508-30.127 ' +
                              '28.3203-28.9062 29.7852-28.9062Z'
                          }
                        />
                      </g>
                    </svg>
                  </Button>

                  {/* App detail view */}
                  {
                    (() => {
                      switch (viewModel.selectedSidebarItemKey) {
                        case 'recents': return null
                        case 'shared': return null
                        case 'recently-deleted': return null
                        default: return (
                          <DetailView
                            leftClassName={
                              viewModel.isSidebarOn
                                ? 'md:left-62.25 left-0'
                                : 'left-0'
                            }
                          />
                        )
                      }
                    })()
                  }
                </div>
              )
              : (
                <>
                  <SharedBodyguard
                    onPass={() => viewModel.setIsPassed(true)}
                    inputClassName="focus:border-systemBlue"
                  />
                  <SharedFooter />
                </>
              )
        }
      </div>

      {
        viewModel.isLocationDialogPresented && (
          <LocationDialog
            setIsPresented={viewModel.setIsLocationDialogPresented}
            onAdd={(newLocation) => viewModel.handleNewLocationAdd(newLocation)}
          />
        )
      }
    </>
  )
}
