//
//  episode-sheet.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/11/1.
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

import EpisodeService from "@/services/episode-service"
import FileService from "@/services/file-service"
import { useState } from "react"
import { useBinding } from "ui/binding"

export default function useEpisodeSheet({
  onCreate,
  tvShowID
}: {
  onCreate?: () => void,
  tvShowID: number
}) {
  const title = useBinding("")
  const artworkURLs = useBinding("")
  const description = useBinding("")
  const date = useBinding("")
  const episodeNumber = useBinding("")
  const seasonNumber = useBinding("")
  const duration = useBinding("")
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
    { label: "Artwork URL", value: artworkURLs },
    { label: "Description", value: description },
    { label: "Date", value: date },
    { label: "Episode Number", value: episodeNumber },
    { label: "Season Number", value: seasonNumber },
    { label: "Duration", value: duration },
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
      newFiles
        .sort((lhs, rhs) => lhs.name?.localeCompare(rhs.name ?? "") ?? 0)
        .map(file => {
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

    const success = await EpisodeService.insertEpisode({
      title: title.value,
      artworkURLs: artworkURLs.value,
      description: description.value,
      date: +date.value,
      episodeNumber: +episodeNumber.value,
      seasonNumber: +seasonNumber.value,
      duration: +duration.value,
      width: +width.value,
      height: +height.value,
      isHDR: isHDR.value,
      videoCodec: videoCodec.value,
      audioCodec: audioCodec.value,
      fileID: +selectedFileID.value,
      tvShowID: tvShowID
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
    artworkURLs,
    description,
    date,
    episodeNumber,
    seasonNumber,
    duration,
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
