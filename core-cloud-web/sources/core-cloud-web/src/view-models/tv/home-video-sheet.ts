//
//  home-video-sheet.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/10/5.
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
import HomeVideoService from "@/services/home-video-service"
import { useState } from "react"
import { useBinding } from "ui/binding"

export default function useHomeVideoSheet({
  onCreate,
  detail
}: {
  onCreate?: () => void,
  detail?: {
    id?: number
  }
}) {
  const title = useBinding(/*detail?.title ?? */"")
  const cast = useBinding("")
  const director = useBinding("")
  const genre = useBinding("")
  const tags = useBinding("")
  const date = useBinding("")
  const duration = useBinding("")
  const artworkURLs = useBinding("")
  const width = useBinding("")
  const height = useBinding("")
  const isHDR = useBinding(false)
  const videoCodec = useBinding("")
  const audioCodec = useBinding("")
  const selectedFileID = useBinding("0")
  const [files, setFiles] = useState<{ id: number, name: string}[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const fields = [
    { label: "Title", value: title },
    { label: "Cast", value: cast },
    { label: "Director", value: director },
    { label: "Genre", value: genre },
    { label: "Tag", value: tags },
    { label: "Date", value: date },
    { label: "Duration", value: duration },
    { label: "Artwork URL", value: artworkURLs },
    { label: "Width", value: width },
    { label: "Height", value: height },
    { label: "HDR", value: isHDR, caption: "The file contains HDR content" },
    { label: "Video Codec", value: videoCodec },
    { label: "Audio Codec", value: audioCodec },
    { label: "File", value: selectedFileID, files: files }
  ]

  /* MARK: - Event handlers */
  async function viewDidAppear1() {
    const newFiles = await FileService.fetchFiles({
      fields: "name",
      filters: "kind_EQUALS_MPEG-4 Movie"
    })

    setFiles(
      newFiles.map(file => {
        return {
          id: file.id,
          name: file.name ?? ""
        }
      })
    )
  }

  async function createButtonDidClick() {
    setIsError(false)
    setIsLoading(true)

    const success = await HomeVideoService.insertHomeVideo({
      title: title.value,
      cast: cast.value,
      director: director.value,
      genre: genre.value,
      tags: tags.value,
      date: +date.value,
      duration: +duration.value,
      artworkURLs: artworkURLs.value,
      width: +width.value,
      height: +height.value,
      isHDR: isHDR.value,
      videoCodec: videoCodec.value,
      audioCodec: audioCodec.value,
      fileID: +selectedFileID.value
    })

    setIsLoading(false)

    if (success) {
      setIsError(false)
      onCreate?.()
    } else {
      setIsError(true)
    }

    return success
  }

  return {
    title,
    cast,
    director,
    genre,
    tags,
    date,
    duration,
    artworkURLs,
    width,
    height,
    isHDR,
    videoCodec,
    audioCodec,
    selectedFileID,
    isLoading,
    isError,
    fields,
    viewDidAppear1,
    createButtonDidClick
  }
}
