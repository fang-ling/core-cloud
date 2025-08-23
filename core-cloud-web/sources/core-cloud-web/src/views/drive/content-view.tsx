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
                  <main
                    className={
                      'absolute top-0 right-0 bottom-0 border-l ' +
                        'border-divider bg-backgroundPrimary flex flex-col ' +
                        'transition-[left,right] duration-250 md:z-6 ' + (
                          viewModel.isSidebarOn
                            ? 'md:left-62.25 left-0'
                            : 'left-0'
                        )
                    }
                  >
                    {/* Toolbar */}
                    <div
                      className="w-full h-10 mb-0.75 flex items-center min-h-10"
                    >
                      {/* Group: start */}
                      <div
                        className={
                          'min-w-1/5 flex items-center justify-start px-2.5'
                        }
                      />

                      {/* Group: middle */}
                      <div
                        className={
                          'flex-1 flex items-center justify-center px-2.5'
                        }
                      >
                        <Button
                          disabled={true}
                        >
                          <svg
                            viewBox="0 0 122.758056640625 109.0341796875"
                            version="1.1" xmlns="http://www.w3.org/2000/svg"
                            width={20.035743}
                            height={17.795824}
                            className="overflow-visible"
                          >
                            <g
                              transform={
                                'matrix(1 0 0 1 -8.735942382812482 ' +
                                  '89.7470703125)'
                              }
                            >
                              <path
                                d={
                                  'M84.7168-13.5742L84.7168-5.71289L107.52-' +
                                    '5.71289C122.51-5.71289 131.494-14.7461 ' +
                                    '131.494-26.5625C131.494-36.4258 ' +
                                    '125.586-44.5312 ' +
                                    '116.064-48.3887C116.162-70.166 ' +
                                    '100.488-85.8887 ' +
                                    '80.5176-85.8887C67.2852-85.8887 ' +
                                    '57.8613-78.8086 ' +
                                    '52.002-70.2637C40.918-73.2422 ' +
                                    '26.9043-64.6484 ' +
                                    '26.6602-50.9277C15.625-49.2188 ' +
                                    '8.74023-40.1855 ' +
                                    '8.74023-28.6621C8.74023-15.9668 ' +
                                    '18.2617-5.71289 ' +
                                    '34.2773-5.71289L55.957-5.71289L55.957-' +
                                    '13.5742L34.2285-13.5742C22.6562-13.5742 ' +
                                    '16.6016-20.2637 ' +
                                    '16.6016-28.6621C16.6016-37.9883 ' +
                                    '22.5098-44.9219 ' +
                                    '32.8613-44.9219C33.5449-44.9219 ' +
                                    '33.7891-45.3125 ' +
                                    '33.7891-45.9473C33.7891-60.9375 ' +
                                    '44.5801-65.0879 ' +
                                    '54.6387-62.1582C55.2246-61.9629 ' +
                                    '55.5664-62.0605 ' +
                                    '55.8594-62.5977C60.5957-71.0449 ' +
                                    '67.8711-78.0273 ' +
                                    '80.5176-78.0273C96.5332-78.0273 ' +
                                    '107.617-65.332 ' +
                                    '108.447-50.7812C108.594-48.584 ' +
                                    '108.447-45.9473 ' +
                                    '108.252-43.6523C108.203-43.0176 ' +
                                    '108.447-42.627 ' +
                                    '109.033-42.5293C117.92-40.5762 ' +
                                    '123.633-35.0098 ' +
                                    '123.633-26.5625C123.633-19.043 ' +
                                    '118.164-13.5742 ' +
                                    '107.471-13.5742ZM70.3613 ' +
                                    '19.2871C72.4609 19.2871 74.2188 ' +
                                    '17.5781 74.2188 ' +
                                    '15.5273L74.2188-30.2734L73.9258-' +
                                    '39.3066L77.1973-35.8398L84.6191-' +
                                    '28.4668C85.3516-27.7344 86.3281-' +
                                    '27.2949 87.2559-27.2949C89.2578-' +
                                    '27.2949 90.8203-28.7109 90.8203-' +
                                    '30.7129C90.8203-31.7383 90.4297-' +
                                    '32.6172 89.6484-33.3008L73.1445-' +
                                    '48.7305C72.1191-49.6582 71.3379-' +
                                    '50 70.3613-50C69.3359-50 68.5547-' +
                                    '49.6582 67.5293-48.7305L51.0254-' +
                                    '33.3008C50.2441-32.6172 49.8535-' +
                                    '31.7383 49.8535-30.7129C49.8535-' +
                                    '28.7109 51.3184-27.2949 53.3691-' +
                                    '27.2949C54.2969-27.2949 55.3223-' +
                                    '27.7344 56.0547-28.4668L63.4766-' +
                                    '35.8398L66.748-39.3066L66.4551-' +
                                    '30.2734L66.4551 15.5273C66.4551 ' +
                                    '17.5781 68.2617 19.2871 70.3613 19.2871Z'
                                }
                              />
                            </g>
                          </svg>
                        </Button>
                      </div>

                      {/* Group: end */}
                      <div
                        className={
                          'min-w-1/5 flex items-center justify-end px-2.5 ' +
                            'gap-1.5'
                        }
                      >
                        <Button
                          disabled={true}
                        >
                          <svg
                            viewBox="0 0 102.97998046875 73.7802734375"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            width={16.807698}
                            height={12.041919}
                            className="ml-1 mr-2"
                          >
                            <g
                              transform={
                                'matrix(1 0 0 1 -10.155039062500009 ' +
                                  '72.1201171875)'
                              }
                            >
                              <path
                                d={
                                  'M19.3359-58.3008C23.0957-58.3008 ' +
                                    '26.1719-61.377 ' +
                                    '26.1719-65.1855C26.1719-68.9453 ' +
                                    '23.0957-72.0215 ' +
                                    '19.3359-72.0215C15.5273-72.0215 ' +
                                    '12.4512-68.9453 ' +
                                    '12.4512-65.1855C12.4512-61.377 ' +
                                    '15.5273-58.3008 ' +
                                    '19.3359-58.3008ZM42.1387-' +
                                    '60.5469L108.496-60.5469C111.084-60.5469 ' +
                                    '113.135-62.5977 ' +
                                    '113.135-65.1855C113.135-67.7734 ' +
                                    '111.084-69.8242 ' +
                                    '108.496-69.8242L42.1387-69.8242C39.5508-' +
                                    '69.8242 37.5-67.7734 ' +
                                    '37.5-65.1855C37.5-62.5977 ' +
                                    '39.5508-60.5469 ' +
                                    '42.1387-60.5469ZM19.3359-' +
                                    '28.3203C23.0957-28.3203 26.1719-' +
                                    '31.3965 26.1719-35.2051C26.1719-' +
                                    '38.9648 23.0957-42.041 ' +
                                    '19.3359-42.041C15.5273-42.041 ' +
                                    '12.4512-38.9648 ' +
                                    '12.4512-35.2051C12.4512-31.3965 ' +
                                    '15.5273-28.3203 ' +
                                    '19.3359-28.3203ZM42.1387-' +
                                    '30.5664L108.496-30.5664C111.084-' +
                                    '30.5664 113.135-32.6172 ' +
                                    '113.135-35.2051C113.135-37.793 ' +
                                    '111.084-39.8438 ' +
                                    '108.496-39.8438L42.1387-' +
                                    '39.8438C39.5508-39.8438 37.5-37.793 ' +
                                    '37.5-35.2051C37.5-32.6172 ' +
                                    '39.5508-30.5664 ' +
                                    '42.1387-30.5664ZM19.3359 ' +
                                    '1.66016C23.0957 1.66016 26.1719-1.41602 ' +
                                    '26.1719-5.22461C26.1719-8.98438 ' +
                                    '23.0957-12.0605 ' +
                                    '19.3359-12.0605C15.5273-12.0605 ' +
                                    '12.4512-8.98438 ' +
                                    '12.4512-5.22461C12.4512-1.41602 15.5273 ' +
                                    '1.66016 19.3359 ' +
                                    '1.66016ZM42.1387-0.585938L108.496-' +
                                    '0.585938C111.084-0.585938 ' +
                                    '113.135-2.63672 ' +
                                    '113.135-5.22461C113.135-7.8125 ' +
                                    '111.084-9.86328 ' +
                                    '108.496-9.86328L42.1387-9.86328C39.' +
                                    '5508-9.86328 37.5-7.8125 ' +
                                    '37.5-5.22461C37.5-2.63672 ' +
                                    '39.5508-0.585938 42.1387-0.585938Z'
                                }
                              />
                            </g>
                          </svg>
                          <svg
                            className="m1r-1.25"
                            width={9}
                            height={14}
                            viewBox="0 0 18 28"
                          >
                            <path
                              d={
                                'M9.004 26.979c.537-.007.958-.202 ' +
                                  '1.4-.637l6.126-6.273c.32-.32.47-.689.47-' +
                                  '1.141 0-.923-.753-1.679-1.657-1.679a1.67 ' +
                                  '1.67 0 00-1.228.546l-5.388 5.597h.578l-' +
                                  '5.414-5.597c-.35-.35-.773-.546-1.234-' +
                                  '.546-.91 0-1.657.756-1.657 1.679 0 ' +
                                  '.445.157.814.463 1.142l6.139 ' +
                                  '6.272c.446.448.87.637 1.402.637zM1.463 ' +
                                  '7.937A1.587 1.587 0 001 9.081c0 .916.747 ' +
                                  '1.677 1.657 1.677.46 0 .886-.193 ' +
                                  '1.234-.546l5.414-5.596h-.578l5.388 ' +
                                  '5.596c.344.359.775.546 1.228.546.904 0 ' +
                                  '1.657-.761 1.657-1.677 0-.455-.15-.832-' +
                                  '.47-1.144l-6.125-6.27c-.443-.442-.864-' +
                                  '.633-1.4-.646-.534 0-.958.198-' +
                                  '1.403.645L1.463 7.937z'
                              }
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>

                    <DetailView
                      key={viewModel.selectedSidebarItemKey}
                      currentSidebarKey={viewModel.selectedSidebarItemKey}
                      title={
                        viewModel.sections
                          .flatMap(s => s.items)
                          .find(i => {
                            return i.key === viewModel.selectedSidebarItemKey
                          })!
                          .title
                      }
                      symbolName={
                        viewModel.sections
                          .flatMap(s => s.items)
                          .find(i => {
                            return i.key === viewModel.selectedSidebarItemKey
                          })
                          ?.symbolName
                      }
                      emptyMessage={
                        (
                          viewModel.selectedSidebarItemKey === 'recents' ||
                            viewModel.selectedSidebarItemKey === 'shared' ||
                            viewModel.selectedSidebarItemKey ===
                              'recently-deleted'
                        )
                          ? Localizer.default().localize('No items')
                          : Localizer.default().localize(
                            'This folder is empty.'
                          )
                      }
                      emptyDescription={
                        viewModel.selectedSidebarItemKey === 'recents'
                          ? Localizer.default().localize(
                            'Files which you\'ve opened recently will ' +
                              'appear here.'
                          )
                          : viewModel.selectedSidebarItemKey === 'shared'
                            ? Localizer.default().localize(
                              'Shared files will appear here.'
                            )
                            : undefined
                      }
                    />
                  </main>
                </div>
              )
              : (
                <>
                  <SharedBodyguard
                    onPass={() => viewModel.handleCheckPointPass()}
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
            onAdd={({ id, name }) => {
              viewModel.handleNewLocationAdd({ id, name })
            }}
          />
        )
      }
    </>
  )
}
