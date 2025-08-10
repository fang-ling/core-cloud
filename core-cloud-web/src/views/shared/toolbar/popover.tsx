//
//  popover.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/9.
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

import usePopover from '@/view-models/shared/toolbar/popover'
import { createPortal } from 'react-dom'

export default function Popover({
  onClose,
  right,
  children
}: {
  onClose: () => void,
  right: number,
  children?: React.ReactNode
}) {
  const viewModel = usePopover({
    onClose: onClose
  })

  return createPortal(
    (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-10"
          onClick={() => viewModel.handlePopoverClose()}
        />
        {/* Popover - < md */}
        <div
          className={
            'md:hidden flex px-1.25 py-2.5 fixed h-full mt-6.5 inset-0 ' +
              'bg-backgroundPrimary z-10 rounded-t-[10.5] ' +
   'shadow-[0px_0px_15px_0px_rgba(0,0,0,.15),0px_0px_0px_1px_rgba(0,0,0,.1)] ' +
              'backdrop-blur-[15px] backdrop-saturate-86 flex-col ' + (
                viewModel.isClosing
                  ? 'animate-[slideOut_.35s_cubic-bezier(0,0,0,1)_forwards]'
                  : 'animate-[slideIn_.35s_cubic-bezier(0,0,0,1)_forwards]'
              )
          }
        >
          <button
            className={
              'rounded-lg px-1.5 size-7 ml-2.25 mt-1.25 ' +
                'hover:bg-fillTertiary flex items-center justify-center ' +
                'active:dark:bg-[rgba(0,153,255,.16)] ' +
                'active:bg-[rgba(0,113,227,.3)]'
            }
            onClick={() => viewModel.handlePopoverClose()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 12.731 12.742"
              aria-hidden="true"
              className="size-3.5 fill-labelPrimary"
            >
              <path
                d={
                  'M.287 12.454c.39.383 1.054.375 1.422.008l4.657-4.657 ' +
                    '4.652 4.654c.378.378 1.035.38 1.42-.007.385-.39.387-1.' +
                    '037.01-1.417l-4.653-4.66 4.653-4.652c.377-.377.38-1.' +
                    '03-.01-1.414-.39-.39-1.042-.393-1.42-.01L6.366 4.95 ' +
                    '1.71.296C1.34-.074.672-.089.287.306-.095.696-.088 ' +
                    '1.353.279 1.72l4.658 4.655L.279 11.04c-.367.365-.38 ' +
                    '1.03.008 1.414z'
                }
              />
            </svg>
          </button>

          {children}
        </div>

        {/* Popover - >= md */}
        <div
          className={
            'hidden md:flex fixed rounded-xl origin-top-right ' +
              'bg-backgroundPrimary dark:bg-[rgba(0,0,0,.8)] ' +
              'top-11 z-10 backdrop-blur-[50px] ' +
              'shadow-[0_11px_34px_rgba(0,0,0,.16)] ' +
              'dark:shadow-[0_11px_34px_rgba(0,0,0,.65)] ' + (
                viewModel.isClosing
                  ? 'animate-[fadeOut_.2s_ease_forwards]'
                  : 'animate-[fadeInAndScale_.2s_cubic-bezier(.25,.1,.25,1.3)]'
              )
          }
          style={{
            right: right
          }}
        >
          {children}
        </div>
      </>
    ),
    document.body
  )
}
