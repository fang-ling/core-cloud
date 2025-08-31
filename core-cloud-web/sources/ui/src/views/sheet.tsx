//
//  sheet.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/23.
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

import { BoolBinding } from "../binding"
import { createPortal } from "react-dom"
import React, { useEffect } from "react"
import useSheet from "../view-models/sheet"
import Image from "./image"

/**
 * A view that presents a sheet when a binding to a Boolean value that you
 * provide is true.
 *
 * - Parameters:
 *   - isPresented: A binding to a Boolean value that determines whether to
 *                  present the sheet.
 *   - onDismiss: The closure to execute when dismissing the sheet.
 *   - children: The content of the sheet.
 */
export default function Sheet({
  isPresented,
  onDismiss,
  closeButtonActiveBackgroundStyleClassName = "active:bg-appTint/16",
  children
}: {
  isPresented: BoolBinding
  onDismiss?: () => void,
  closeButtonActiveBackgroundStyleClassName?: string,
  children: React.ReactNode
}) {
  const viewModel = useSheet({
    isPresented: isPresented,
    onDismiss: onDismiss
  })

  useEffect(() => {
    viewModel.viewDidAppear()

    return () => {
      viewModel.viewDidDisappear()
    }
  }, [])

  return createPortal(
    (
      <>
        {/* Backdrop */}
        <div
          className={
            "bg-backdrop fixed inset-0 z-10 overflow-hidden " + (
              viewModel.isClosing
                ? "animate-[fadeOut_.2s_cubic-bezier(.32,.08,.24.1)_forwards]"
                : "animate-[fadeIn_.2s_cubic-bezier(.32,.08,.24,1)_forwards]"
            )
          }
        />
        {/* Dialog */}
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <div
            className={
              "w-full max-w-100 md:w-100 bg-backgroundPrimary rounded-[11px] " +
                "m-5 flex flex-col max-h-4/5 overflow-y-auto " +
                "dark:shadow-[0_11px_34px_rgba(0,0,0,.65)] " +
                "shadow-[0_11px_34px_rgba(0,0,0,.16)] " + (
                  viewModel.isClosing
                    ? "animate-[fadeOut_.2s_ease_forwards]"
                    :
                "animate-[fadeInAndBarelyScale_.2s_cubic-bezier(.32,.08,.24,1)]"
                )
            }
          >
            <div className="flex">
              <button
                className={
                  "cursor-pointer px-1.5 mt-3 ml-2.5 rounded-lg h-7 min-w-7 " +
                    "flex items-center justify-center hover:bg-fillTertiary " +
                    "fill-labelPrimary active:fill-labelQuaternary " +
                    closeButtonActiveBackgroundStyleClassName
                }
                onClick={() => viewModel.closeButtonDidClick()}
              >
                <Image
                  systemName="xmark"
                  widthClassName="w-3.5"
                  weight="semibold"
                />
              </button>
            </div>
            <div className="flex relative items-center p-2.5 flex-col">
              {children}
            </div>
          </div>
        </div>
      </>
    ),
    document.body
  )
}
