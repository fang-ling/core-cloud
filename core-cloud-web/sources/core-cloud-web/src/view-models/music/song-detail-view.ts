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

export default function useSongDetailView({
  setSongs,
  setCurrentPlayingSong
}: {
  setSongs: React.Dispatch<React.SetStateAction<{
    id: number,
    title: string,
    artist: string,
    genre: string,
    year: number,
    trackNumber: number,
    discNumber: number,
    playCount: number,
    sampleSize: number,
    sampleRate: number,
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
  /* MARK: Event handlers */
  async function viewDidAppear() {
    let newSongs = await SongService.fetchSongs()
    setSongs(
      newSongs.map(newSong => {
        return {
          id: newSong.id,
          title: newSong.title,
          artist: newSong.artist,
          genre: newSong.genre,
          year: newSong.year,
          trackNumber: newSong.trackNumber,
          discNumber: newSong.discNumber,
          playCount: newSong.playCount,
          sampleSize: newSong.sampleSize,
          sampleRate: newSong.sampleRate,
          fileID: newSong.fileID
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

  return {
    viewDidAppear,
    songListItemDidDoubleClick
  }
}
