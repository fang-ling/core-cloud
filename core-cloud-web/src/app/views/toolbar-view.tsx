//
//  toolbar-view.tsx
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

import SFSymbolView from '@/ui-elements/views/sf-symbol-view'

export default function ToolbarView({
  source,
  children
}: {
  /*
   * When source is not 'app', we also need the overlay style class.
   */
  source: 'login' | 'homepage' | 'app',
  children?: React.ReactNode
}) {
  return (
    <header
      className={
        'top-0 height-11 min-h-11 pl-4 pr-1.5 flex sticky items-center ' +
          'select-none ' + (
            source === 'login'
              ? (
                'before:absolute before:inset-0 before:backdrop-blur-[10px] ' +
                  'before:-z-1 z-3 border-b border-b-[rgba(251,251,253,.5)] ' +
                  'bg-[rgba(251,251,253,.5)] ' +
                  'dark:border-b-[rgba(28,28,30,0.5)] ' +
                  'dark:bg-[rgba(28,28,30,0.5)]'
              )
              : ''
          )
      }
    >
      <SFSymbolView
        systemName="icloud.fill"
        className="fill-systemBlack h-[14px] mr-0.5"
      />
      <span className="font-semibold text-[21px] text-systemBlack">
        {process.env.NEXT_PUBLIC_TITLE}
      </span>
    </header>
  )
}
