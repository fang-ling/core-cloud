//
//  location-dialog.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/13.
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

import DiskService from '@/services/disk-service'
import LocationService from '@/services/location-service'
import { useState } from 'react'

export default function useLocationDialog({
  setIsPresented,
  onAdd
}: {
  setIsPresented: React.Dispatch<React.SetStateAction<boolean>>,
  onAdd: ({ id, name }: { id: number, name: string }) => void
}) {
  const [isClosing, setIsClosing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [disks, setDisks] = useState<{ path: string }[]>([])
  const [selectedDiskIndex, setSelectedDiskIndex] = useState(0)
  const [name, setName] = useState('')
  const [isError, setIsError] = useState(false)

  /* MARK: - Event handlers */
  async function handleCloseButtonClick() {
    setIsClosing(true)
    await new Promise(resolve => setTimeout(resolve, 200))
    setIsPresented(false)
    document.body.style.removeProperty('overflow')
  }

  async function handleContentAppear() {
    setIsLoading(true)

    const disks = await DiskService.fetchDisks()
    setDisks(disks)

    setIsLoading(false)
  }

  function handleDiskChange(newSelectedDiskIndex: number) {
    setSelectedDiskIndex(newSelectedDiskIndex)
  }

  function handleNameChange(newName: string) {
    setName(newName)
  }

  async function handleCreateButtonClick() {
    setIsLoading(true)
    setIsError(false)

    const successes = await LocationService.insertLocation({
      name: name,
      path: disks[selectedDiskIndex].path
    })

    if (successes) {
      const newLocations = await LocationService.fetchLocations()
      const newLocation = newLocations.findLast(l => l.name === name)
      if (newLocation) {
        onAdd(newLocation)
      }

      handleCloseButtonClick()
    } else {
      setIsLoading(false)
      setIsError(true)
    }
  }

  return {
    isClosing,
    isLoading,
    disks,
    selectedDiskIndex,
    name,
    isError,
    handleCloseButtonClick,
    handleContentAppear,
    handleDiskChange,
    handleNameChange,
    handleCreateButtonClick
  }
}
