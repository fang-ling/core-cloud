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

import SettingService from '@/services/setting-service'
import UserService from '@/services/user-service'
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
  ] = useState<string | undefined>(undefined)
  const apps: any[] /* TODO */ = []
  /*
   * 0: off
   * 1: select background color
   */
  const [radioMode, setRadioMode] = useState(0)
  const [modalRight, setModalRight] = useState(0)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [avatarURLs, setAvatarURLs] = useState<string[]>([])

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

  async function handleBackgroundColorChange(newBackgroundColor: string) {
    const oldBackgroundColor = backgroundColor
    if (oldBackgroundColor === newBackgroundColor) {
      return
    }

    setBackgroundColor(newBackgroundColor)

    let newValue = -1
    switch (newBackgroundColor) {
      case 'blue': newValue = 0; break;
      case 'purple': newValue = 1; break;
      case 'green': newValue = 2; break;
      case 'red': newValue = 3; break;
      case 'orange': newValue = 4; break;
      case 'yellow': newValue = 5; break;
    }

    const result = await SettingService.modifySetting({
      key: 'homeBackgroundColor',
      value: newValue + ''
    })
    if (!result) {
      setBackgroundColor(oldBackgroundColor)
    }
  }

  async function handleViewAppear1() {
    const user = await UserService.fetchUser()
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setUsername(user.username)
      setAvatarURLs(user.avatarURLs)
    }
  }

  async function handleViewAppear2() {
    const homeBackgroundColor = await SettingService.fetchSetting({
      key: 'homeBackgroundColor'
    })
    switch (homeBackgroundColor?.homeBackgroundColor) {
      case 0: setBackgroundColor('blue'); break;
      case 1: setBackgroundColor('purple'); break;
      case 2: setBackgroundColor('green'); break;
      case 3: setBackgroundColor('red'); break;
      case 4: setBackgroundColor('orange'); break;
      case 5: setBackgroundColor('yellow'); break;
    }
  }

  return {
    isCustomizationPresented,
    backgroundColor,
    apps,
    radioMode,
    modalRight,
    firstName,
    lastName,
    username,
    avatarURLs,
    handleCustomizeButtonClick,
    handleCustomizeDoneButtonClick,
    handleModalOpen,
    handleModalClose,
    handleBackgroundColorChange,
    handleViewAppear1,
    handleViewAppear2
  }
}
