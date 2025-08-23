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
import React from "react"
import useSheet from "../view-models/sheet"

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
  children
}: {
  isPresented: BoolBinding
  onDismiss?: () => void,
  children: React.ReactNode
}) {
  const viewModel = useSheet({
    isPresented: isPresented,
    onDismiss: onDismiss
  })

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
                    "active:bg-appTint/16 group"
                }
                onClick={() => viewModel.closeButtonDidClick()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 12.731 12.742"
                  className={
                    "fill-labelPrimary size-3.5 " +
                      "group-active:fill-labelQuaternary"
                  }
                >
                  <path
                    d={
                      "M.287 12.454c.39.383 1.054.375 1.422.008l4.657-4.657 " +
                        "4.652 4.654c.378.378 1.035.38 " +
                        "1.42-.007.385-.39.387-1.037.01-1.417l-4.653-4.66 " +
                        "4.653-4.652c.377-.377.38-1.03-.01-1.414-.39-.39-" +
                        "1.042-.393-1.42-.01L6.366 4.95 1.71.296C1.34-.074" +
                        ".672-.089.287.306-.095.696-.088 1.353.279 " +
                        "1.72l4.658 4.655L.279 11.04c-.367.365-.38 1.03.008 " +
                        "1.414z"
                    }
                  />
                </svg>
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
