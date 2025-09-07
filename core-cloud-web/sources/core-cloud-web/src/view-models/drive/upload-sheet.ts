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
import FileService from "@/services/file-service"

export default function useUploadSheet({
  application,
  locationID,
  onUpload
}: {
  application: string,
  locationID: string,
  onUpload: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [file, setFile] = useState<File | undefined>(undefined)

  /* MARK: - Event handlers */
  function fileInputDidChange(newFile: File | undefined) {
    setFile(newFile)
  }

  async function uploadButtonDidClick() {
    if (!file) {
      setIsError(true)
      return false
    }

    let kind= ""
    const components = file.name.split(".")
    if (components[components.length - 1] === "m4a") {
      kind = "Apple MPEG-4 Audio"
    }

    setIsError(false)
    setIsLoading(true)

    const fileBuffer = await file.arrayBuffer()
    const digestBuffer = await crypto.subtle.digest("SHA-512", fileBuffer)
    const digestData = new Uint8Array(digestBuffer)
    const binaryCharacters: string[] = []
    digestData.forEach(digestDatum => {
      binaryCharacters.push(String.fromCharCode(digestDatum))
    })

    const response = await FileService.insertFile({
      request: {
        name: file.name.split(".")[0],
        kind: kind,
        size: `${file.size}`,
        checksum: btoa(binaryCharacters.join("")),
        application: application,
        locationID: locationID
      },
      file: file
    })
    if (!response) {
      setIsError(true)
      setIsLoading(false)
      return false
    } else {
      onUpload()
      setIsLoading(false)
      return true
    }
  }

  return {
    isLoading,
    isError,
    file,
    fileInputDidChange,
    uploadButtonDidClick
  }
}
