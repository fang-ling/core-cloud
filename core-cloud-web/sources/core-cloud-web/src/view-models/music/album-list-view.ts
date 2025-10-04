//
//  album-list-view.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/9/13.
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

export default function useAlbumListView({
  setAlbums,
  setSelectedAlbum,
  setPlayingNextQueue,
  setCurrentPlayingSong
}: {
  setAlbums: React.Dispatch<React.SetStateAction<{
    id: number,
    name: string,
    artist: string,
    artworkURLs: string
  }[]>>,
  setSelectedAlbum: React.Dispatch<React.SetStateAction<{
    id: number,
    name: string,
    artist: string,
    artworkURLs: string,
    genre?: string,
    year?: number
  } | undefined>>,
  setPlayingNextQueue: React.Dispatch<React.SetStateAction<{
    id: number,
    artworkURLs: string[],
    fileID: number,
    title: string,
    artist: string,
    album: string,
    duration: number
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
    let newAlbums = await AlbumService.fetchAlbums({
      fields: "name,artist,artworkURLs"
    })
    setAlbums(
      newAlbums.map(album => {
        return {
          id: album.id,
          name: album.name ?? "",
          artist: album.artist ?? "",
          artworkURLs: album.artworkURLs ?? ""
        }
      })
    )
  }

  function albumDidSelect(selectedAlbum: {
    id: number,
    name: string,
    artist: string,
    artworkURLs: string
  }) {
    setSelectedAlbum(selectedAlbum)
  }

  async function playButtonDidClick(albumID: number) {
    const songs = await SongService.fetchSongs({
      filters: `albumID_EQUALS_${albumID}`,
      fields: "artworkURLs,fileID,title,artist,album,duration"
    })

    const currentSong = songs.shift()
    if (currentSong) {
      setCurrentPlayingSong({
        id: currentSong.id,
        artworkURLs: currentSong.artworkURLs?.split(",") ?? [],
        fileID: currentSong.fileID ?? 0,
        title: currentSong.title ?? "",
        artist: currentSong.artist ?? "",
        album: currentSong.albumName ?? ""
      })
    }

    setPlayingNextQueue(
      songs.map(song => {
        return {
          id: song.id,
          artworkURLs: song.artworkURLs?.split(",") ?? [],
          fileID: song.fileID ?? 0,
          title: song.title ?? "",
          artist: song.artist ?? "",
          album: song.albumName ?? "",
          duration: song.duration ?? 0
        }
      })
    )
  }

  return {
    viewDidAppear,
    albumDidSelect,
    playButtonDidClick
  }
}
