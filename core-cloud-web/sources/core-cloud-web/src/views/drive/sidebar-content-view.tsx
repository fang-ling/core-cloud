//
//  sidebar-content-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/15.
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

import SidebarSymbol from './sidebar-symbol'

export default function SidebarContentView({
  sections,
  selectedKey,
  onChange
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
  onChange: (key: string) => void
}) {
  return (
    <>
      {
        sections.map(section => (
          <li key={section.header}>
            <h2
              className={
                'ml-1.5 mb-1.5 text-sm font-semibold text-labelSecondary ' +
                  'leading-4.25'
              }
            >
              {section.header}
            </h2>
            <ul className="mb-3.25">
              {
                section.items.map(item => (
                  <li
                    key={item.key}
                    className={
                      'w-full h-8 pr-2 rounded-[10px] flex items-center ' +
                        'cursor-pointer select-none active:bg-appTint ' +
                        'group ' + (
                          selectedKey === item.key
                            ? 'bg-gray5'
                            : 'hover:bg-fillQuaternary'
                        )
                    }
                    onClick={() => onChange(item.key)}
                  >
                    <SidebarSymbol
                      className={
                        'max-w-5 min-w-5 mx-2.25 fill-appTint ' +
                          'group-active:fill-systemWhite'
                      }
                      symbolName={item.symbolName}
                    />
                    <span
                      className={
                        'text-[15px] leading-4.5 text-labelPrimary ' +
                          'group-active:text-systemWhite'
                      }
                    >
                      {item.title}
                    </span>
                  </li>
                ))
              }
            </ul>
          </li>
        ))
      }
    </>
  )
}
