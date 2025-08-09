//
//  notice-popover.tsx
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

import useNoticePopover from '@/view-models/shared/toolbar/notice-popover'
import { createPortal } from 'react-dom'

export default function NoticePopover({
  onClose,
  right,
  children
}: {
  onClose: () => void,
  right: number,
  children?: React.ReactNode
}) {
  const viewModel = useNoticePopover({
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
            'flex md:hidden w-4/5 fixed py-5 pl-1.25 pr-4 rounded-xl ' +
              'border-[.2px] border-fillQuaternary origin-top-right left-1/2 ' +
              'bg-[rgba(248,248,252,.85)] dark:bg-[rgba(56,56,61,.6)] ' +
              'top-11 z-10 backdrop-blur-[15px] backdrop-saturate-86 ' +
              'shadow-[0_11px_34px_rgba(0,0,0,.16)] -translate-x-1/2 ' + (
                viewModel.isClosing
                  ? 'animate-[fadeOut_.2s_ease_forwards]'
                  : 'animate-[fadeInAndScale_.2s_cubic-bezier(.25,.1,.25,1.3)]'
              )
          }
        >
          {children}
        </div>
        {/* Popover - >= md */}
        <div
          className={
            'hidden md:flex md:w-160 fixed py-5 pl-1.25 pr-4 rounded-xl ' +
              'border-[.2px] border-fillQuaternary origin-top-right ' +
              'bg-[rgba(248,248,252,.85)] dark:bg-[rgba(56,56,61,.6)] ' +
              'top-11 z-10 backdrop-blur-[15px] backdrop-saturate-86 ' +
              'shadow-[0_11px_34px_rgba(0,0,0,.16)] ' + (
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
