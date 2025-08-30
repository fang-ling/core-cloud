//
//  navigation-split-view.ts
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

import { useState } from "react"

export default function useNavigationSplitView({
  onSelectedSidebarItemKeyChange
}: {
  onSelectedSidebarItemKeyChange: (newSelectedSidebarItemKey: string) => void
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  /* MARK: - Event handlers */
  async function viewWillDisappear() {
    await dismiss()
  }

  async function mobileSelectedSidebarItemKeyDidChange(
    newSelectedSidebarItemKey: string
  ) {
    onSelectedSidebarItemKeyChange(newSelectedSidebarItemKey)
    await dismiss()
  }

  function sidebarToggleDidClick() {
    setIsSidebarOpen(!isSidebarOpen)
  }

  /* MARK: - Utilities */
  async function dismiss() {
    setIsClosing(true)
    await new Promise(resolve => setTimeout(resolve, 200))
    /* Use !false, this function is called when < md. */
    setIsSidebarOpen(!false)
    /* Resetting */
    await new Promise(resolve => setTimeout(resolve, 200))
    setIsClosing(false)
  }

  return {
    isSidebarOpen,
    isClosing,
    viewWillDisappear,
    mobileSelectedSidebarItemKeyDidChange,
    sidebarToggleDidClick
  }
}
