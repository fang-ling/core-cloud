//
//  shared-toolbar.ts
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

"use client"

import UserService from "@/services/user-service"
import { useState } from "react"

export default function useSharedToolbar({
  source,
  onCustomize
}: {
  source: "authenticator" | "home" | "drive" | "music" | "tv",
  onCustomize?: () => void
}) {
  /*
   * 0: off
   * 1: advanced data protection
   * 2: quick access
   * 3: profile
   */
  const [radioMode, setRadioMode] = useState(0)
  const [modalRight, setModalRight] = useState(0)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [avatarURLs, setAvatarURLs] = useState<string[]>([])

  /* MARK: - Event handlers */
  function handleModalOpen(
    event: React.MouseEvent<HTMLButtonElement>,
    newRadioMode: 1 | 2 | 3
  ) {
    /* Disable body scrolling when modal is open. */
    document.body.style.setProperty("overflow", "hidden")

    const right = event.currentTarget.getBoundingClientRect().right
    setModalRight(window.innerWidth - right)
    setRadioMode(newRadioMode)
  }

  function handleModalClose() {
    /* Revert body scrolling disable */
    document.body.style.removeProperty("overflow")

    setRadioMode(0)
  }

  function handleOnCustomize() {
    /* Revert body scrolling disable */
    document.body.style.removeProperty("overflow")

    setRadioMode(0)
    onCustomize?.()
  }

  async function viewDidAppear() {
    if (
      source !== "home" &&
        source !== "drive" &&
        source !== "music" &&
        source !== "tv"
    ) {
      return
    }

    const user = await UserService.fetchUser()
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setUsername(user.username)
      setAvatarURLs(user.avatarURLs)
    }
  }

  return {
    radioMode,
    modalRight,
    firstName,
    lastName,
    username,
    avatarURLs,
    handleModalOpen,
    handleModalClose,
    handleOnCustomize,
    viewDidAppear
  }
}
