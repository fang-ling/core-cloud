//
//  song-detail-view.ts
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

export default function useSongDetailView({
  setSongs,
  setCurrentPlayingSong
}: {
  setSongs: React.Dispatch<React.SetStateAction<{
    id: number,
    title: string,
    artist: string,
    albumName?: string,
    artworkURLs?: string,
    duration: number,
    fileID: number
  }[]>>,
  setCurrentPlayingSong: React.Dispatch<React.SetStateAction<{
    id: number,
    artworkURLs: string[],
    fileID: number,
    title: string,
    artist: string,
    album: string
  } | undefined>>
}) {
  const [selectedSongID, setSelectedSongID] = useState<number | undefined>()

  /* MARK: Event handlers */
  async function viewDidAppear() {
    let newSongs = await SongService.fetchSongs()
    setSongs(
      newSongs.map(song => {
        return {
          id: song.id,
          title: song.title,
          artist: song.artist,
          albumName: song.albumName,
          artworkURLs: song.artworkURLs,
          duration: song.duration,
          fileID: song.fileID
        }
      })
    )
  }

  function songListItemDidDoubleClick(
    clickedItem: {
      id: number,
      artworkURLs: string[],
      fileID: number,
      title: string,
      artist: string,
      album: string
    }
  ) {
    setCurrentPlayingSong(clickedItem)
  }

  function songListItemDidClick(id: number) {
    setSelectedSongID(id)
  }

  return {
    viewDidAppear,
    selectedSongID,
    songListItemDidDoubleClick,
    songListItemDidClick
  }
}
