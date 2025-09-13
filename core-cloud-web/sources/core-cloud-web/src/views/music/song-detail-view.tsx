//
//  song-detail-view.tsx
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

import useSongDetailView from "@/view-models/music/song-detail-view"
import { useEffect } from "react"
import Text from "ui/text"

export default function SongDetailView({
  songs,
  setSongs,
  setCurrentPlayingSong
}: {
  songs: {
    id: number,
    title: string,
    artist: string,
    trackNumber: number,
    discNumber: number,
    playCount: number,
    sampleSize: number,
    sampleRate: number,
    fileID: number
  }[],
  setSongs: React.Dispatch<React.SetStateAction<{
    id: number,
    title: string,
    artist: string,
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
  const viewModel = useSongDetailView({
    setSongs: setSongs,
    setCurrentPlayingSong: setCurrentPlayingSong
  })

  useEffect(() => {
    viewModel.viewDidAppear()
  }, [])

  return (
    <>
      {
        songs.map(song => (
          <div
            className="w-full flex"
            key={song.id}
            onDoubleClick={() => {
              viewModel.songListItemDidDoubleClick({
                id: song.id,
                artworkURLs: [],
                album: "",
                artist: song.artist,
                title: song.title,
                fileID: song.fileID
              })
            }}
          >
            <Text verbatimContent={song.title} />
            <Text verbatimContent={song.artist} />
            <Text verbatimContent={`${song.trackNumber}`} />
            <Text verbatimContent={`${song.discNumber}`} />
            <Text verbatimContent={`${song.playCount}`} />
            <Text verbatimContent={`${song.sampleSize}`} />
            <Text verbatimContent={`${song.sampleRate}`} />
          </div>
        ))
      }
    </>
  )
}
