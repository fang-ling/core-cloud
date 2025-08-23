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

import { useState } from "react"

export default function useDetailView({
  title,
  currentSidebarKey
}: {
  title: string,
  currentSidebarKey: string
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
  const [navigationStack, setNavigationStack] = useState<string[]>([])

  /* MARK: - Event handlers */
  async function handleOnAppear() {
    setIsLoading(true)
    setNavigationStack([title])
    handleRootFilesAppear()
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  async function handleNavigationChange(fileName?: string) {
    setIsLoading(true)
    const newNavigationStack = navigationStack.slice()
    if (fileName) {
      newNavigationStack.push(fileName)
      setFiles([]) /* TODO */
    } else {
      newNavigationStack.pop()
      if (newNavigationStack.length === 1) {
        handleRootFilesAppear()
      }
    }
    setNavigationStack(newNavigationStack)
    await new Promise(resolve => setTimeout(resolve, 2000))
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
