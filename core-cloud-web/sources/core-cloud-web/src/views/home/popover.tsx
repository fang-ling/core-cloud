//
//  popover.tsx
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

import usePopover from '@/view-models/home/popover'
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
        {/* Popover */}
        <div
          className={
            'flex rounded-xl bg-backgroundPrimary ' +
              'fixed origin-[top_center] flex px-6 items-center ' +
              'shadow-[0_11px_34px_rgba(0,0,0,.16)] h-17.5 ' +
              'dark:shadow-[0_11px_34px_rgba(0,0,0,.65)] ' +
              'top-16 z-10 ' + (
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
