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

export default function useSongSheet({
  onCreate
}: {
  onCreate?: () => void
}) {
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [genre, setGenre] = useState("")
  const [year, setYear] = useState("")
  const [trackNumber, setTrackNumber] = useState("")
  const [discNumber, setDiscNumber] = useState("")
  const [playCount, setPlayCount] = useState("")
  const [sampleSize, setSampleSize] = useState("")
  const [sampleRate, setSampleRate] = useState("")
  const [fileID, setFileID] = useState("")
  const fields = [{
    label: "Title",
    value: title,
    onChange: titleDidChange
  },{
    label: "Artist",
    value: artist,
    onChange: artistDidChange
  }, {
    label: "Genre",
    value: genre,
    onChange: genreDidChange
  }, {
    label: "Year",
    value: year,
    onChange: yearDidChange
  }, {
    label: "Track Number",
    value: trackNumber,
    onChange: trackNumberDidChange
  }, {
    label: "Disc Number",
    value: discNumber,
    onChange: discNumberDidChange
  }, {
    label: "Play Count",
    value: playCount,
    onChange: playCountDidChange
  }, {
    label: "Sample Size",
    value: sampleSize,
    onChange: sampleSizeDidChange
  }, {
    label: "Sample Rate",
    value: sampleRate,
    onChange: sampleRateDidChange
  }, {
    label: "File ID",
    value: fileID,
    onChange: fileIDDidChange
  }]
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /* MARK: - Event handlers */
  function titleDidChange(newTitle: string) {
    setTitle(newTitle)
  }

  function artistDidChange(newArtist: string) {
    setArtist(newArtist)
  }

  function genreDidChange(newGenre: string) {
    setGenre(newGenre)
  }

  function yearDidChange(newYear: string) {
    setYear(newYear)
  }

  function trackNumberDidChange(newTrackNumber: string) {
    setTrackNumber(newTrackNumber)
  }

  function discNumberDidChange(newDiscNumber: string) {
    setDiscNumber(newDiscNumber)
  }

  function playCountDidChange(newPlayCount: string) {
    setPlayCount(newPlayCount)
  }

  function sampleSizeDidChange(newSampleSize: string) {
    setSampleSize(newSampleSize)
  }

  function sampleRateDidChange(newSampleRate: string) {
    setSampleRate(newSampleRate)
  }

  function fileIDDidChange(newFileID: string) {
    setFileID(newFileID)
  }

  async function createButtonDidClick() {
    setIsError(false)
    setIsLoading(true)

    const success = await SongService.insertSong({
      title: title,
      artist: artist,
      genre: genre,
      year: +year,
      trackNumber: +trackNumber,
      discNumber: +discNumber,
      playCount: +playCount,
      sampleSize: +sampleSize,
      sampleRate: +sampleRate,
      fileID: +fileID
    })
    setIsLoading(false)
    if (success) {
      setIsError(false)
      onCreate?.()
      return true
    } else {
      setIsError(true)
      return false
    }
  }

  return {
    title,
    artist,
    genre,
    year,
    trackNumber,
    discNumber,
    playCount,
    sampleSize,
    sampleRate,
    fileID,
    fields,
    isError,
    isLoading,
    createButtonDidClick
  }
}
