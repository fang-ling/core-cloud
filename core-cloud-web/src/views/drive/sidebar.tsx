//
//  sidebar.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/12.
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

import useSidebar from '@/view-models/drive/sidebar'
import SidebarContentView from './sidebar-content-view'

export default function Sidebar({
  sections,
  selectedKey,
  onChange,
  children,
  isOn,
  setIsOn
}: {
  sections: {
    header: string,
    items: {
      key: string,
      symbolName: string,
      title: string
    }[]
  }[],
  selectedKey: string,
  onChange: (key: string) => void,
  children?: React.ReactNode,
  isOn: boolean
  setIsOn: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const viewModel = useSidebar({
    setIsOn: setIsOn,
    onChange: onChange
  })

  return (
    <>
      {/* Backdrop, < md */}
      {
        <div
          className={
            'md:hidden bg-backdrop absolute inset-0 overflow-hidden ' + (
              !isOn
                ? 'z-6 '
                : '-z-1 '
            ) + (
              viewModel.isClosing
                ? 'animate-[fadeOut_.2s_cubic-bezier(.32,.08,.24.1)_forwards]'
                : 'animate-[fadeIn_.2s_cubic-bezier(.32,.08,.24,1)_forwards]'
            )
          }
          onClick={() => viewModel.handleOnClose()}
        />
      }

      {/* Sidebar, < md */}
      <ul
        className={
          'md:hidden absolute top-0 bottom-0 w-62.5 pt-13.25 pl-2.5 pr-2.25 ' +
            'bg-sidebar border-r border-divider flex flex-col z-7 ' +
            'transition-[left] duration-250 ' + (
              isOn
                ? '-left-full'
                : 'left-0'
            )
        }
      >
        <div className="h-full overflow-y-auto flex flex-col">
          <SidebarContentView
            sections={sections}
            selectedKey={selectedKey}
            onChange={(key) => {
              viewModel.handleMobileSidebarKeyChange(key)
            }}
          />
          {children}
        </div>
      </ul>

      {/* Sidebar, >= md */}
      <ul
        className={
          'hidden absolute top-0 bottom-0 w-62.5 pt-13.25 pl-2.5 pr-2.25 ' +
            'bg-sidebar border-r border-divider md:flex flex-col ' +
            'transition-[left] duration-250 left-0'
        }
      >
        <div className="h-full overflow-y-auto flex flex-col">
          <SidebarContentView
            sections={sections}
            selectedKey={selectedKey}
            onChange={(key) => onChange(key)}
          />
          {children}
        </div>
      </ul>
    </>
  )
}
