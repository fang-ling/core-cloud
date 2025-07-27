//
//  register-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/7/26.
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

import ReactDOM from 'react-dom'

export default function RegisterView({
  isPresented,
  setIsPresented
}: {
  isPresented: boolean,
  setIsPresented: React.Dispatch<React.SetStateAction<boolean>>
}) {
  if (!isPresented) {
    return null
  }

  return ReactDOM.createPortal(
    (
      <>
        <div
          className={
            'bg-backdrop fixed inset-0 z-11 ' +
              'animate-[fadeIn_.2s_cubic-bezier(.32,.08,.24,1)_forwards]'
          }
        />
        <div className="fixed inset-0 z-12 flex items-center justify-center">
          <div
            className={
              'w-160 h-4/5 m-5 bg-backgroundPrimary rounded-[11px] ' +
                'dark:shadow-[0_11px_34px_rgba(0,0,0,.65)] ' +
                'shadow-[0_11px_34px_rgba(0,0,0,.16)] ' +
                'animate-[fadeInAndBarelyScale_.2s_cubic-bezier(.32,.08,.24,1)]'
            }
          >
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="h-256">placeholder</div>
              </div>

              <div
                className={
                  'px-7.5 py-5 text-center bg-[#fafafc] dark:bg-[#424245] ' +
                    'border-t border-[#d2d2d7] dark:border-[#1d1d1f] h-9 ' +
                    'box-content rounded-b-[11px]'
                }
              >
                <div className="w-full h-full flex justify-between">
                  <button
                    className={
                      'min-w-36 min-h-4.5 rounded-lg cursor-pointer text-sm ' +
                        'bg-transparent border ' +
                        'dark:hover:border-transparent active:text-white ' +
                        'active:bg-sk-button-background-active box-content ' +
                        'active:border-transparent py-2 px-3.75 ' +
                        'border-sk-button-border-color text-sk-button-color ' +
                        'hover:text-white hover:bg-sk-button-background-hover'
                    }
                  >
                    {'Cancel'}
                  </button>
                  <button
                    className={
                      'min-w-36 min-h-4.5 rounded-lg cursor-pointer text-sm ' +
                        'box-content py-2 px-3.75 bg-sk-button-background ' +
                        'text-white active:bg-sk-button-background-active ' +
                        'hover:bg-sk-button-background-hover ' + (
                          false ? 'opacity-42 dark:opacity-36' : ''
                        )
                    }
                  >
                    {'Continue'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    ),
    document.body
  )
}
