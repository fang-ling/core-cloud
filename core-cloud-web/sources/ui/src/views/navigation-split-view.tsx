//
//  navigation-split-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/24.
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

import React from "react"
import useNavigationSplitView from "../view-models/navigation-split-view"
import Image from "./image"

/**
 * A view that presents views in two or three columns, where selections in
 * leading columns control presentations in subsequent columns.
 */
export default function NavigationSplitView({
  sidebar,
  content = null,
  detail,
  selectedSidebarItemKey,
  onSelectedSidebarItemKeyChange,
  toggleForegroundStyleClassName = "",
  toggleBackgroundStyleClassName = ""
}: {
  /**
   * The view to show in the leading column.
   */
  sidebar: (
    {
      isOpen,
      selectedItemKey,
      onChange
    }: {
      isOpen: boolean,
      selectedItemKey: string,
      onChange: (newSelectedItemKey: string) => void
    }
  ) => React.JSX.Element,
  /**
   * The view to show in the middle column. (Not supported yet.)
   */
  content?: React.ReactNode,
  /**
   * The view to show in the detail area.
   */
  detail: () => React.JSX.Element,
  selectedSidebarItemKey: string,
  onSelectedSidebarItemKeyChange: (newSelectedSidebarItemKey: string) => void,
  toggleForegroundStyleClassName?: string,
  toggleBackgroundStyleClassName?: string
}) {
  const viewModel = useNavigationSplitView({
    onSelectedSidebarItemKeyChange: onSelectedSidebarItemKeyChange
  })

  return (
    <div className="relative w-full h-full">
      <>
        {/* Backdrop, < md */}
        {
          <div
            className={
              "md:hidden bg-backdrop absolute inset-0 overflow-hidden " + (
                !viewModel.isSidebarOpen
                  ? "z-6 "
                  : "-z-1 "
              ) + (
                viewModel.isClosing
                  ? "animate-[fadeOut_.2s_cubic-bezier(.32,.08,.24.1)_forwards]"
                  : "animate-[fadeIn_.2s_cubic-bezier(.32,.08,.24,1)_forwards]"
              )
            }
            onClick={() => viewModel.viewWillDisappear()}
          />
        }

        {/* Sidebar, < md */}
        <ul
          className={
            "md:hidden absolute top-0 bottom-0 w-62.5 pt-13.25 pl-2.5 " +
              "bg-sidebar border-r border-divider flex flex-col z-7 pr-2.25 " +
              "transition-[left] duration-250 " + (
                viewModel.isSidebarOpen
                  ? "-left-full"
                  : "left-0"
              )
          }
        >
          <div className="h-full overflow-y-auto flex flex-col">
            {
              sidebar({
                isOpen: viewModel.isSidebarOpen,
                selectedItemKey: selectedSidebarItemKey,
                onChange: (newSelectedItemKey) => {
                  viewModel.mobileSelectedSidebarItemKeyDidChange(
                    newSelectedItemKey
                  )
                }
              })
            }
          </div>
        </ul>

        {/* Sidebar, >= md */}
        <ul
          className={
            "hidden absolute top-0 bottom-0 w-62.5 pt-13.25 pl-2.5 pr-2.25 " +
              "bg-sidebar border-r border-divider md:flex flex-col " +
              "transition-[left] duration-250 left-0"
          }
        >
          <div className="h-full overflow-y-auto flex flex-col">
            {
              sidebar({
                isOpen: viewModel.isSidebarOpen,
                selectedItemKey: selectedSidebarItemKey,
                onChange: (newSelectedItemKey) => {
                  onSelectedSidebarItemKeyChange(newSelectedItemKey)
                }
              })
            }
          </div>
        </ul>
      </>

      {/* Sidebar toggle */}
      <button
        className={
          "absolute top-1.5 left-2.5 z-10 h-7 min-w-7 px-1.5 rounded-lg flex " +
            `items-center justify-center ${toggleForegroundStyleClassName} ` +
            `cursor-pointer ${toggleBackgroundStyleClassName}`
        }
        onClick={() => viewModel.sidebarToggleDidClick()}
      >
        <Image
          systemName="sidebar.left"
          widthClassName="w-4.75"
        />
      </button>

      {content}

      {/* Detail */}
      <main
        className={
          "absolute top-0 right-0 bottom-0 border-l " +
            "border-divider bg-backgroundPrimary flex flex-col " +
            "transition-[left,right] duration-250 md:z-6 " + (
              viewModel.isSidebarOpen
                ? "md:left-62.25 left-0"
                : "left-0"
            )
        }
      >
        {detail()}
      </main>
    </div>
  )
}
