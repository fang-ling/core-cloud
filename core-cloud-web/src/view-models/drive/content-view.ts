//
//  content-view.ts
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

import Localizer from '@/localizer'
import ApplicationTokenService from '@/services/application-token-service'
import UserService from '@/services/user-service'
import { useState } from 'react'

export default function useContentView({

}: {

}) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [avatarURLs, setAvatarURLs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPassed, setIsPassed] = useState(false)
  const [isSidebarOn, setIsSidebarOn] = useState(true)
  const [sections, setSections] = useState([
    {
      header: Localizer.default().localize('Drive'),
      items: [
        {
          key: 'recents',
          symbolName: 'clock',
          title: Localizer.default().localize('Recents')
        },
        {
          key: 'shared',
          symbolName: 'shared',
          title: Localizer.default().localize('Shared')
        },
        {
          key: 'recently-deleted',
          symbolName: 'trash',
          title: Localizer.default().localize('Recently Deleted')
        }
      ]
    }
  ])
  const [isLocationDialogPresented, setIsLocationDialogPresented] = useState(
    false
  )
  const [selectedSidebarItemKey, setSelectedSidebarItemKey] = useState('')

  /* MARK: - Event handlers */
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
    setIsLoading(true)

    const hasToken = await ApplicationTokenService.peekApplicationToken()
    if (hasToken) {
      setIsPassed(true)
    }

    //await new Promise(resolve => setTimeout(resolve, 2000))
    const newSections = sections.slice()
    newSections.push(
      {
        header: Localizer.default().localize('Locations'),
        items: [
          {
            key: 'placeholder',
            symbolName: 'folder',
            title: 'Placeholder'
          }
        ]
      }
    )
    setSections(newSections)
    setSelectedSidebarItemKey(newSections[0].items[0].key)

    setIsLoading(false)
  }

  function handleSidebarToggle() {
    setIsSidebarOn(!isSidebarOn)
  }

  function handleNewLocationButtonClick() {
    document.body.style.setProperty('overflow', 'hidden')
    setIsLocationDialogPresented(true)
  }

  /* TODO: use DTO */
  function handleNewLocationAdd(
    newLocation: { key: string, title: string },
  ) {
    const newSections = sections.slice()
    newSections[1].items.push({
      key: newLocation.key,
      title: newLocation.title,
      symbolName: 'folder'
    })
    setSections(newSections)
  }

  function handleSelectedSidebarItemChange(key: string) {
    setSelectedSidebarItemKey(key)
  }

  function handleCheckPointPass() {
    setIsPassed(true)
  }

  return {
    firstName,
    lastName,
    username,
    avatarURLs,
    isLoading,
    isPassed,
    isSidebarOn,
    setIsSidebarOn,
    sections,
    setSections,
    isLocationDialogPresented,
    setIsLocationDialogPresented,
    selectedSidebarItemKey,
    handleViewAppear1,
    handleViewAppear2,
    handleSidebarToggle,
    handleNewLocationButtonClick,
    handleNewLocationAdd,
    handleSelectedSidebarItemChange,
    handleCheckPointPass
  }
}
