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

import AlbumService from "@/services/album-service"
import FileService from "@/services/file-service"
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
  const selectedFileID = useBinding(detail?.fileID?.toString() ?? "0")
  const selectedAlbumID = useBinding("0")
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [albums, setAlbums] = useState<{
    id: number,
    name: string,
    artist: string,
    year: number
  }[]>([])
  const [files, setFiles] = useState<{
    id: number,
    name: string
  }[]>([])

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
    label: "File",
    value: selectedFileID,
    files: files
  }, {
    label: "Album",
    value: selectedAlbumID,
    albums: albums
  }]

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
      fileID: +selectedFileID.value,
      albumID: +selectedAlbumID.value
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

  async function viewDidAppear1() {
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
      selectedAlbumID.setValue(song.albumID?.toString() ?? "")
    }
  }

  async function viewDidAppear2() {
    const newAlbums = await AlbumService.fetchAlbums({
      fields: "name,artist,year"
    })

    setAlbums(
      newAlbums.map(album => {
        return {
          id: album.id,
          name: album.name ?? "",
          artist: album.artist ?? "",
          year: album.year ?? 0
        }
      })
    )
  }

  async function viewDidAppear3() {
    const newFiles = await FileService.fetchFiles({
      fields: "name",
      filters: "kind_EQUALS_Apple MPEG-4 Audio"
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

  return {
    title,
    artist,
    trackNumber,
    discNumber,
    playCount,
    sampleSize,
    sampleRate,
    selectedFileID,
    selectedAlbumID,
    fields,
    isError,
    isLoading,
    albums,
    files,
    createButtonDidClick,
    viewDidAppear1,
    viewDidAppear2,
    viewDidAppear3
  }
}
