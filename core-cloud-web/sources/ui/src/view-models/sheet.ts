//
//  sheet.ts
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

import { useState } from "react"
import { BoolBinding } from "../binding"

export default function useSheet({
  isPresented,
  onDismiss,
  primaryButtonAction
}: {
  isPresented: BoolBinding,
  onDismiss?: () => void,
  primaryButtonAction?: () => Promise<boolean>
}) {
  const [isClosing, setIsClosing] = useState(false)

  /* MARK: - Event handlers */
  function viewDidAppear() {
    isPresented.setValue(true)
    document.body.style.setProperty("overflow", "hidden")
  }

  async function closeButtonDidClick() {
    await dismissCleanup()
  }

  async function primaryButtonDidClick() {
    let needClose = await primaryButtonAction?.()
    if (needClose) {
      dismissCleanup()
    }
  }

  /* MARK: - Utilities */
  async function dismissCleanup() {
    setIsClosing(true)
    onDismiss?.()
    await new Promise(resolve => setTimeout(resolve, 200))
    document.body.style.removeProperty("overflow")
    isPresented.setValue(false)
  }

  return {
    isClosing,
    viewDidAppear,
    closeButtonDidClick,
    primaryButtonDidClick
  }
}
