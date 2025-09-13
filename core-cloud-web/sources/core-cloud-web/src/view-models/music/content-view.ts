//
//  content-view.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/24.
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
import { useRef, useState } from "react"
import { useBinding } from "ui/binding"

export default function useContentView() {
  const isCheckpointPassed = useBinding(false)
  const [selectedSidebarItemKey, setSelectedSidebarItemKey] = useState(
    "albums"
  )
  const sectionsRef = useRef([{
    header: "Library",
    items: [/*{
      key: "artists",
      symbolName: "music.microphone",
      title: "Artists"
    },*/{
      key: "albums",
      symbolName: "square.stack",
      title: "Albums"
    },{
      key: "songs",
      symbolName: "music.note",
      title: "Songs"
    }]
  }])
  const isNewAlbumSheetPresented = useBinding(false)
  const isNewSongSheetPresented = useBinding(false)
  const [songs, setSongs] = useState<{
    id: number,
    title: string,
    artist: string,
    trackNumber: number,
    discNumber: number,
    playCount: number,
    sampleSize: number,
    sampleRate: number,
    fileID: number
  }[]>([])
  const [albums, setAlbums] = useState<{
    id: number,
    name: string,
    artist: string,
    artworkURLs: string
  }[]>([])

  /* MARK: - Event handlers */
  function selectedSidebarItemKeyDidChange(newSelectedSidebarItemKey: string) {
    setSelectedSidebarItemKey(newSelectedSidebarItemKey)
  }

  function newAlbumButtonDidClick() {
    isNewAlbumSheetPresented.toggle()
  }

  function newSongButtonDidClick() {
    isNewSongSheetPresented.toggle()
  }

  async function newAlbumDidCreate() {
    if (selectedSidebarItemKey !== "albums") {
      return
    }

    let newAlbums = await AlbumService.fetchAlbums()
    setAlbums(
      newAlbums.map(album => {
        return {
          id: album.id,
          name: album.name,
          artist: album.artist,
          artworkURLs: album.artworkURLs
        }
      })
    )
  }

  async function newSongDidCreate() {
    if (selectedSidebarItemKey !== "songs") {
      return
    }

    let newSongs = await SongService.fetchSongs()
    setSongs(
      newSongs.map(song => {
        return {
          id: song.id,
          title: song.title,
          artist: song.artist,
          trackNumber: song.trackNumber,
          discNumber: song.discNumber,
          playCount: song.playCount,
          sampleSize: song.sampleSize,
          sampleRate: song.sampleRate,
          fileID: song.fileID
        }
      })
    )
  }

  return {
    isCheckpointPassed,
    selectedSidebarItemKey,
    sectionsRef,
    isNewAlbumSheetPresented,
    isNewSongSheetPresented,
    albums,
    setAlbums,
    songs,
    setSongs,
    selectedSidebarItemKeyDidChange,
    newAlbumButtonDidClick,
    newSongButtonDidClick,
    newAlbumDidCreate,
    newSongDidCreate
  }
}
