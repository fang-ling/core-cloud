//
//  album-detail-view.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/9/28.
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
import SongService from "@/services/song-service"
import { useState } from "react"

export default function useAlbumDetailView({
  album,
  setAlbum,
  setCurrentPlayingSong,
  setPlayingNextQueue
}: {
  album: {
    id: number,
    name: string,
    artist: string,
    artworkURLs: string,
    genre?: string,
    year?: number
  },
  setAlbum: React.Dispatch<React.SetStateAction<{
    id: number,
    name: string,
    artist: string,
    artworkURLs: string,
    genre?: string,
    year?: number
  } | undefined>>,
  setCurrentPlayingSong: React.Dispatch<React.SetStateAction<{
    id: number,
    artworkURLs: string[],
    fileID: number,
    title: string,
    artist: string,
    album: string
  } | undefined>>,
  setPlayingNextQueue: React.Dispatch<React.SetStateAction<{
    id: number,
    artworkURLs: string[],
    fileID: number,
    title: string,
    artist: string,
    album: string,
    duration: number
  }[]>>
}) {
  const [songs, setSongs] = useState<{
    id: number,
    isPopular: boolean,
    trackNumber: number,
    discNumber: number,
    title: string,
    duration: number,
    artist: string,
    artworkURLs: string[],
    fileID: number
  }[]>([])
  const [selectedSongID, setSelectedSongID] = useState<number | undefined>()

  /* MARK: - Event handlers */
  function backButtonDidClick() {
    setAlbum(undefined)
  }

  async function viewDidAppear1() {
    const detail = await AlbumService.fetchAlbum({
      id: album.id.toString()
    })
    setAlbum({
      ...album,
      genre: detail?.genre,
      year: detail?.year
    })
  }

  async function viewDidAppear2() {
    const newSongs = await SongService.fetchSongs({
      fields: [
        "isPopular",
        "trackNumber",
        "discNumber",
        "title",
        "duration",
        "artist",
        "artworkURLs",
        "fileID"
      ].join(","),
      filters: `albumID_EQUALS_${album.id}`
    })
    setSongs(
      newSongs.map(song => {
        return {
          id: song.id,
          isPopular: song.isPopular ?? false,
          trackNumber: song.trackNumber ?? 0,
          discNumber: song.discNumber ?? 0,
          title: song.title ?? "",
          duration: song.duration ?? 0,
          artist: song.artist ?? "",
          artworkURLs: song.artworkURLs?.split(",") ?? [],
          fileID: song.fileID ?? 0
        }
      })
    )
  }

  function trackListItemDidClick(id: number) {
    setSelectedSongID(id)
  }

  function trackListItemDidDoubleClick(
    clickedItem: {
      id: number,
      artworkURLs: string[],
      fileID: number,
      title: string,
      artist: string,
      album: string
    },
    discNumber: number,
    trackNumber: number
  ) {
    setCurrentPlayingSong(clickedItem)

    const newSongs = songs.filter(song => {
      if (song.discNumber < trackNumber) {
        return false
      } else if (song.discNumber === discNumber) {
        return song.trackNumber >= trackNumber
      }
      return true
    })
    play(newSongs)
  }

  function playButtonDidClick() {
    const newSongs = songs.slice()
    play(newSongs)
  }

  /* MARK: - Utilities */
  function play(newSongs: typeof songs) {
    const currentSong = newSongs.shift()
    setCurrentPlayingSong({
      id: currentSong?.id ?? 0,
      artworkURLs: currentSong?.artworkURLs ?? [],
      fileID: currentSong?.fileID ?? 0,
      title: currentSong?.title ?? "",
      artist: currentSong?.artist ?? "",
      album: album.name
    })

    setPlayingNextQueue(
      newSongs.map(song => {
        return {
          id: song.id,
          artworkURLs: song.artworkURLs,
          fileID: song.fileID,
          title: song.title,
          artist: song.artist,
          album: album.name,
          duration: song.duration
        }
      })
    )
  }

  return {
    songs,
    selectedSongID,
    backButtonDidClick,
    viewDidAppear1,
    viewDidAppear2,
    trackListItemDidClick,
    trackListItemDidDoubleClick,
    playButtonDidClick
  }
}
