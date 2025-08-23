//
//  upload-sheet.ts
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

export default function useUploadSheet({

}: {

}) {
  const [sha512, setSHA512] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [file, setFile] = useState<File | undefined>(undefined)

  /* MARK: - Event handlers */
  function fileInputDidChange(newFile: File | undefined) {
    setFile(newFile)
  }

  function sha512InputDidChange(newSHA512: string) {
    setSHA512(newSHA512)
  }

  async function uploadButtonDidClick() {

  }

  return {
    sha512,
    isLoading,
    isError,
    file,
    fileInputDidChange,
    sha512InputDidChange,
    uploadButtonDidClick
  }
}
