//
//  content-view.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/7.
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

import { useState } from 'react'

export default function useContentView({

}: {

}) {
  const [isCustomizationPresented, setIsCustomizationPresented] = useState(
    false
  )
  const [
    backgroundColor,
    setBackgroundColor
  ] = useState<string | undefined>(/*undefined*/'blue')
  const apps: any[] /* TODO */ = []
  /*
   * 0: off
   * 1: select background color
   */
  const [radioMode, setRadioMode] = useState(0)
  const [modalRight, setModalRight] = useState(0)

  /* MARK: - Event handlers */
  function handleCustomizeButtonClick() {
    setIsCustomizationPresented(true)
  }

  function handleCustomizeDoneButtonClick() {
    setIsCustomizationPresented(false)
  }

  function handleModalOpen(
    event: React.MouseEvent<HTMLButtonElement>,
    newRadioMode: 0 | 1
  ) {
    document.body.style.setProperty('overflow', 'hidden')
    const right = event.currentTarget.getBoundingClientRect().right
    setModalRight(window.innerWidth - right)
    setRadioMode(newRadioMode)
  }

  function handleModalClose() {
    document.body.style.removeProperty('overflow')
    setRadioMode(0)
  }

  function handleBackgroundColorChange(newBackgroundColor: string) {
    setBackgroundColor(newBackgroundColor)
  }

  return {
    isCustomizationPresented,
    backgroundColor,
    apps,
    radioMode,
    modalRight,
    handleCustomizeButtonClick,
    handleCustomizeDoneButtonClick,
    handleModalOpen,
    handleModalClose,
    handleBackgroundColorChange
  }
}
