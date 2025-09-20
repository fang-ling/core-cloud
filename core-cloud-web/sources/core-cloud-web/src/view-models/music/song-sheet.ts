//
//  song-sheet.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/31.
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

import SongService from "@/services/song-service"
import { useState } from "react"
import { useBinding } from "ui/binding"

export default function useSongSheet({
  onCreate,
  detail
}: {
  onCreate?: () => void,
  detail?: {
    id?: number,
    artworkURLs?: string,
    title?: string,
    artist?: string,
    fileID?: number,
    duration?: number
  }
}) {
  const title = useBinding(detail?.title ?? "")
  const artist = useBinding(detail?.artist ?? "")
  const trackNumber = useBinding("")
  const discNumber = useBinding("")
  const playCount = useBinding("")
  const sampleSize = useBinding("")
  const sampleRate = useBinding("")
  const duration = useBinding(detail?.duration?.toString() ?? "")
  const isPopular = useBinding(false)
  const fileID = useBinding(detail?.fileID?.toString() ?? "")
  const albumID = useBinding("")
  const fields = [{
    label: "Title",
    value: title
  },{
    label: "Artist",
    value: artist
  }, {
    label: "Track Number",
    value: trackNumber
  }, {
    label: "Disc Number",
    value: discNumber
  }, {
    label: "Play Count",
    value: playCount
  }, {
    label: "Sample Size",
    value: sampleSize
  }, {
    label: "Sample Rate",
    value: sampleRate
  }, {
    label: "Duration",
    value: duration
  }, {
    label: "Popular",
    value: isPopular,
    caption: "The song is popular on this album"
  }, {
    label: "File ID",
    value: fileID
  }, {
    label: "Album ID",
    value: albumID
  }]
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /* MARK: - Event handlers */
  async function createButtonDidClick() {
    setIsError(false)
    setIsLoading(true)

    const success = await SongService.insertSong({
      title: title.value,
      artist: artist.value,
      trackNumber: +trackNumber.value,
      discNumber: +discNumber.value,
      playCount: +playCount.value,
      sampleSize: +sampleSize.value,
      sampleRate: +sampleRate.value,
      duration: +duration.value,
      isPopular: isPopular.value,
      fileID: +fileID.value,
      albumID: +albumID.value
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

  async function viewDidAppear() {
    /* TODO: Use this loading state. */
    setIsLoading(true)

    const song = await SongService.fetchSong({
      /*
       * It is actually guaranteed that detail.id is not undefined, but we can
       * be conservative here.
       */
      id: detail?.id?.toString() ?? "-1",
      fields: [
        "playCount",
        "trackNumber",
        "discNumber",
        "sampleSize",
        "sampleRate",
        "isPopular",
        "albumID"
      ].join(",")
    })

    setIsLoading(false)

    if (song) {
      playCount.setValue(song.playCount?.toString() ?? "")
      trackNumber.setValue(song.trackNumber?.toString() ?? "")
      discNumber.setValue(song.discNumber?.toString() ?? "")
      sampleSize.setValue(song.sampleSize?.toString() ?? "")
      sampleRate.setValue(song.sampleRate?.toString() ?? "")
      isPopular.setValue(song.isPopular ?? false)
      albumID.setValue(song.albumID?.toString() ?? "")
    }
  }

  return {
    title,
    artist,
    trackNumber,
    discNumber,
    playCount,
    sampleSize,
    sampleRate,
    fileID,
    albumID,
    fields,
    isError,
    isLoading,
    createButtonDidClick,
    viewDidAppear
  }
}
