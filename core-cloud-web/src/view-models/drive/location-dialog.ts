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

import { useState } from 'react'

export default function useLocationDialog({
  setIsPresented,
  onAdd
}: {
  setIsPresented: React.Dispatch<React.SetStateAction<boolean>>,
  onAdd: (newLocation: { key: string, title: string }) => void
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
    await new Promise(resolve => setTimeout(resolve, 2000))
    setDisks([{
      path: '/mnt/placeholder'
    },
    {
      path: '/mnt/placeholder2'
    },
    {
      path: '/mnt/placeholder3'
    },
    {
      path: '/mnt/placeholder4'
    },
    {
      path: '/mnt/placeholder5'
    }])
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
    await new Promise(resolve => setTimeout(resolve, 2000))
    /*
     * We also need to fetch new locations here (and update the states)
     * after the creation.
     */
    onAdd({ key: 'test', title: 'Test' })
    const success = true
    if (success) {
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
