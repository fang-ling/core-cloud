//
//  location-dialog.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/13.
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

import useLocationDialog from '@/view-models/drive/location-dialog'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import UIProgress from '../ui-progress'
import UIImage from '../ui-image'
import CoreCloudWeb from '@/core-cloud-web'
import Localizer from '@/localizer'

export default function LocationDialog({
  setIsPresented,
  onAdd
}: {
  setIsPresented: React.Dispatch<React.SetStateAction<boolean>>,
  onAdd: (newLocation: { key: string, title: string }) => void
}) {
  const viewModel = useLocationDialog({
    setIsPresented: setIsPresented,
    onAdd: onAdd
  })

  useEffect(() => {
    viewModel.handleContentAppear()
  }, [])

  return createPortal(
    (
      <>
        {/* Backdrop */}
        <div
          className={
            'bg-backdrop fixed inset-0 z-10 overflow-hidden ' + (
              viewModel.isClosing
                ? 'animate-[fadeOut_.2s_cubic-bezier(.32,.08,.24.1)_forwards]'
                : 'animate-[fadeIn_.2s_cubic-bezier(.32,.08,.24,1)_forwards]'
            )
          }
        />
        {/* Dialog */}
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <div
            className={
              'w-full max-w-100 md:w-100 bg-backgroundPrimary rounded-[11px] ' +
                'm-5 flex flex-col max-h-4/5 overflow-y-auto ' +
                'dark:shadow-[0_11px_34px_rgba(0,0,0,.65)] ' +
                'shadow-[0_11px_34px_rgba(0,0,0,.16)] ' + (
                  viewModel.isClosing
                    ? 'animate-[fadeOut_.2s_ease_forwards]'
                    :
                'animate-[fadeInAndBarelyScale_.2s_cubic-bezier(.32,.08,.24,1)]'
                )
            }
          >
            <div className="flex">
              <button
                className={
                  'cursor-pointer px-1.5 mt-3 ml-2.5 rounded-lg h-7 min-w-7 ' +
                    'flex items-center justify-center hover:bg-fillTertiary ' +
                    'active:bg-appTint/16 group'
                }
                onClick={() => viewModel.handleCloseButtonClick()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 12.731 12.742"
                  className={
                    'fill-labelPrimary size-3.5 ' +
                      'group-active:fill-labelQuaternary'
                  }
                >
                  <path
                    d={
                      'M.287 12.454c.39.383 1.054.375 1.422.008l4.657-4.657 ' +
                        '4.652 4.654c.378.378 1.035.38 ' +
                        '1.42-.007.385-.39.387-1.037.01-1.417l-4.653-4.66 ' +
                        '4.653-4.652c.377-.377.38-1.03-.01-1.414-.39-.39-' +
                        '1.042-.393-1.42-.01L6.366 4.95 1.71.296C1.34-.074' +
                        '.672-.089.287.306-.095.696-.088 1.353.279 ' +
                        '1.72l4.658 4.655L.279 11.04c-.367.365-.38 1.03.008 ' +
                        '1.414z'
                    }
                  />
                </svg>
              </button>
            </div>
            <div className="flex relative items-center p-2.5 flex-col">
              <UIImage
                className="size-9 mb-3.5"
                urls={
                  CoreCloudWeb.APPS.find(a => a.href === '/drive')?.urls ?? []
                }
              />
              <h1
                className={
                  'text-labelPrimary text-[19px] font-semibold leading-5.5 ' +
                    'mb-3.5'
                }
              >
                {Localizer.default().localize('New Location')}
              </h1>
              <div className="px-2.5 pb-2.5 w-full">
                <label
                  className={
                    'text-labelPrimary text-left w-full text-sm ' +
                      'leading-4.25 mb-1.25 block'
                  }
                >
                  {Localizer.default().localize('Location Name')}
                </label>
                <input
                  className={
                    'w-full h-9 px-2.5 rounded-lg border border-gray3 ' +
                      'caret-appTint mb-3.75 hover:bg-fillQuaternary ' +
                      'text-sm leading-4.5 text-labelPrimary focus:outline-3 ' +
                      'focus:outline-appTint/70 focus:-outline-offset-2 ' +
                      'text-ellipsis'
                  }
                  value={viewModel.name}
                  onChange={(event) => {
                    viewModel.handleNameChange(event.target.value)
                  }}
                />

                <label
                  className={
                    'text-labelPrimary text-left w-full text-sm ' +
                      'leading-4.25 mb-1.25 block'
                  }
                >
                  {Localizer.default().localize('Choose a Disk')}
                </label>
                <div className="w-full max-h-42.25 overflow-y-auto mb-7.5">
                  {
                    viewModel.disks.map((disk, index) => (
                      <div
                        key={disk.path}
                        className={
                          'border border-gray3 py-2 pl-3 pr-10 relative ' +
                            'cursor-pointer hover:bg-fillQuaternary ' +
                            'active:bg-fillTertiary ' + (
                              index === viewModel.disks.length - 1
                                ? 'rounded-b-lg '
                                : 'border-b-[0.5px] '
                            ) + (
                              index === 0
                                ? 'rounded-t-lg '
                                : 'border-t-[0.5px] '
                            )
                        }
                        onClick={() => viewModel.handleDiskChange(index)}
                      >
                        <label
                          className={
                            'text-labelPrimary font-mono text-sm leading-6'
                          }
                        >
                          {disk.path}
                        </label>

                        {
                          viewModel.selectedDiskIndex === index && (
                            <svg
                              viewBox="0 0 103.466796875 103.4677734375"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              className={
                                'size-4.5 absolute fill-appTint top-1/2 ' +
                                  'right-3 -translate-y-1/2'
                              }
                            >
                              <g
                                transform={
                                  'matrix(1 0 0 1 -8.740234375 86.9638671875)'
                                }
                              >
                                <path
                                  d={
                                    'M 60.498 16.5039 C 88.8672 16.5039 ' +
                                      '112.207 -6.83594 112.207 -35.2051 C ' +
                                      '112.207 -63.623 88.8672 -86.9629 ' +
                                      '60.4492 -86.9629 C 32.0312 -86.9629 ' +
                                      '8.74023 -63.623 8.74023 -35.2051 C ' +
                                      '8.74023 -6.83594 32.0801 16.5039 ' +
                                      '60.498 16.5039 Z M 55.0781 -10.6445 C ' +
                                      '52.8809 -10.6445 51.0742 -11.6699 ' +
                                      '49.5605 -13.5742 L 38.1348 -27.1484 C ' +
                                      '36.9629 -28.5156 36.5234 -29.7852 ' +
                                      '36.5234 -31.25 C 36.5234 -34.3262 ' +
                                      '39.0137 -36.7676 42.0898 -36.7676 C ' +
                                      '43.8477 -36.7676 45.2148 -36.0352 ' +
                                      '46.5332 -34.4727 L 54.9805 -24.2188 L ' +
                                      '73.877 -54.1992 C 75.1953 -56.2988 ' +
                                      '76.8066 -57.373 78.7598 -57.373 C ' +
                                      '81.7871 -57.373 84.5215 -55.127 ' +
                                      '84.5215 -52.0508 C 84.5215 -50.8301 ' +
                                      '84.0332 -49.4629 83.1543 -48.1934 L ' +
                                      '60.4492 -13.6719 C 59.1797 -11.7676 ' +
                                      '57.2266 -10.6445 55.0781 -10.6445 Z'
                                  }
                                />
                              </g>
                            </svg>
                          )
                        }
                      </div>
                    ))
                  }
                </div>

                {
                  viewModel.isError && (
                    <p
                      className={
                        'text-[#e30000] dark:text-[#ff3037] text-sm ' +
                          'leading-5 mb-2.5 text-center'
                      }
                    >
                      {
                        Localizer
                          .default()
                          .localize(
                            'Unable to create location. Try again later.'
                          )
                      }
                    </p>
                  )
                }
                <div className="w-full flex justify-center">
                  <button
                    className={
                      'min-w-1/2 bg-appTint text-systemWhite h-9 flex ' +
                        'items-center justify-center rounded-lg ' +
                        'hover:bg-[rgb(0,93,186)] ' +
                        'dark:hover:bg-[rgb(41,169,255)] ' +
                        'dark:active:bg-[rgb(82,186,255)] ' +
                        'active:bg-[rgb(0,73,145)] ' +
                        'active:text-systemWhite/30 ' + (
                          viewModel.name.length <= 0
                            ? 'opacity-30 dark:opacity-40 pointer-events-none'
                            : 'cursor-pointer'
                        )
                    }
                    onClick={() => viewModel.handleCreateButtonClick()}
                  >
                    {Localizer.default().localize('Create')}
                  </button>
                </div>
              </div>

              {/* Loading */}
              <div
                className={
                  'bg-backgroundPrimary absolute inset-0 flex items-center ' +
                    'justify-center rounded-b-[11px] ' + (
                      viewModel.isLoading ? 'visible' : 'invisible'
                    )
                }
              >
                <UIProgress variant="8" />
              </div>
            </div>
          </div>
        </div>
      </>
    ),
    document.body
  )
}
