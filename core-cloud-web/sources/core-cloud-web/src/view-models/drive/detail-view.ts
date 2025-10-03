//
//  detail-view.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/16.
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

import FileService from "@/services/file-service"
import { useState } from "react"

export default function useDetailView({
  title,
  currentSidebarKey,
  navigationStack,
  setNavigationStack
}: {
  title: string,
  currentSidebarKey: string,
  navigationStack: string[],
  setNavigationStack: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const ROOT_FILES = [
    {
      id: 0,
      name: "Music",
      kind: "Application Library",
      size: -1,
      date: -1
    }
  ]
  const [isLoading, setIsLoading] = useState(true)
  const [files, setFiles] = useState<typeof ROOT_FILES>([])

  /* MARK: - Event handlers */
  async function handleOnAppear() {
    setIsLoading(true)

    setNavigationStack([title])
    handleRootFilesAppear()

    setIsLoading(false)
  }

  async function handleNavigationChange(fileName?: string) {
    setIsLoading(true)

    const newNavigationStack = navigationStack.slice()
    if (fileName) {
      newNavigationStack.push(fileName)
      const newFiles = await FileService.fetchFiles({
        filters: [
          `application_EQUALS_${fileName}`,
          `locationID_EQUALS_${currentSidebarKey}`
        ].join(","),
        fields: "name,kind,size,date"
      })
      setFiles(
        newFiles.map(file => {
          return {
            id: file.id,
            name: file.name ?? "",
            kind: file.kind ?? "",
            size: file.size ?? 0,
            date: file.date ?? 0
          }
        })
      )
    } else {
      newNavigationStack.pop()
      if (newNavigationStack.length === 1) {
        handleRootFilesAppear()
      }
    }
    setNavigationStack(newNavigationStack)

    setIsLoading(false)
  }

  function handleRootFilesAppear() {
    if (
      currentSidebarKey === "recents" ||
        currentSidebarKey === "shared" ||
        currentSidebarKey === "recently-deleted"
    ) {
      /* TODO */
      setFiles([])
    } else {
      setFiles(ROOT_FILES)
    }
  }

  return {
    isLoading,
    files,
    navigationStack,
    handleOnAppear,
    handleNavigationChange
  }
}
