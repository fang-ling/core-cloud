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

import Localizer from "@/localizer"
import ApplicationTokenService from "@/services/application-token-service"
import LocationService from "@/services/location-service"
import { useState } from "react"
import { useBinding } from "ui/binding"

export default function useContentView({

}: {

}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isPassed, setIsPassed] = useState(false)
  const [isSidebarOn, setIsSidebarOn] = useState(true)
  const [sections, setSections] = useState([
    {
      header: Localizer.default().localize("Drive"),
      items: [
        {
          key: "recents",
          symbolName: "clock",
          title: Localizer.default().localize("Recents")
        },
        {
          key: "shared",
          symbolName: "shared",
          title: Localizer.default().localize("Shared")
        },
        {
          key: "recently-deleted",
          symbolName: "trash",
          title: Localizer.default().localize("Recently Deleted")
        }
      ]
    }
  ])
  const [isLocationDialogPresented, setIsLocationDialogPresented] = useState(
    false
  )
  const [selectedSidebarItemKey, setSelectedSidebarItemKey] = useState("")
  const [navigationStack, setNavigationStack] = useState<string[]>([])
  const isUploadSheetPresented = useBinding(false)

  /* MARK: - Event handlers */
  async function handleViewAppear2() {
    setIsLoading(true)

    const hasToken = await ApplicationTokenService.peekApplicationToken()
    if (hasToken) {
      setIsPassed(true)
    }

    const locations = await LocationService.fetchLocations()
    const newSections = sections.slice()
    if (locations.length > 0) {
      newSections.push(
        {
          header: Localizer.default().localize("Locations"),
          items: locations.map(location => {
            return {
              key: location.id + "",
              symbolName: "folder",
              title: location.name
            }
          })
        }
      )
    }
    setSections(newSections)
    setSelectedSidebarItemKey(newSections[0].items[0].key)

    setIsLoading(false)
  }

  function handleSidebarToggle() {
    setIsSidebarOn(!isSidebarOn)
  }

  function handleNewLocationButtonClick() {
    document.body.style.setProperty("overflow", "hidden")
    setIsLocationDialogPresented(true)
  }

  function handleNewLocationAdd({ id, name }: { id: number, name: string }) {
    const newSections = sections.slice()
    const newLocation = {
      key: id + "",
      title: name,
      symbolName: "folder"
    }
    if (newSections.length <= 1) {
      newSections.push({
        header: Localizer.default().localize("Locations"),
        items: [newLocation]
      })
    } else {
      newSections[newSections.length - 1].items.push(newLocation)
    }
    setSections(newSections)
  }

  function handleSelectedSidebarItemChange(key: string) {
    if (selectedSidebarItemKey === key) {
      /* No-op when click current key. */
      return
    }

    setSelectedSidebarItemKey(key)
    setNavigationStack([])
  }

  function handleCheckPointPass() {
    setIsPassed(true)
  }

  function uploadButtonDidClick() {
    isUploadSheetPresented.toggle()
  }

  function fileDidUpload() {
    window.location.reload()
  }

  return {
    isLoading,
    isPassed,
    isSidebarOn,
    setIsSidebarOn,
    sections,
    setSections,
    isLocationDialogPresented,
    setIsLocationDialogPresented,
    selectedSidebarItemKey,
    navigationStack,
    setNavigationStack,
    isUploadSheetPresented,
    handleViewAppear2,
    handleSidebarToggle,
    handleNewLocationButtonClick,
    handleNewLocationAdd,
    handleSelectedSidebarItemChange,
    handleCheckPointPass,
    uploadButtonDidClick,
    fileDidUpload
  }
}
