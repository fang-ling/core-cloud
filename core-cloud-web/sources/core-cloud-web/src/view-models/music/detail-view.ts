//
//  detail-view.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/29.
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
import { useRef, useState } from "react"

export default function useDetailView({
  songs,
  setSongs
}: {
  songs: {
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
  }[],
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
  }[]>>
}) {
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false)
  /**
   * 0: none
   * 1: all
   * 2: 1
   */
  const [repeatMode, setRepeatMode] = useState(0)
  const [
    isBackwardForwardButtonDisabled,
    setIsBackwardForwardButtonDisabled
  ] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlayingSong, setCurrentPlayingSong] = useState<{
    id: number,
    artworkURLs: string[],
    fileID: number,
    title: string,
    artist: string,
    album: string
  } | undefined>(undefined)
  const [elapsed, setElapsed] = useState(0)
  const totalRef = useRef(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const playedRef = useRef(false)

  /* MARK: - Event handlers */
  function shuffleButtonDidClick() {
    setIsShuffleEnabled(!isShuffleEnabled)
  }

  function repeatButtonDidClick() {
    setRepeatMode((repeatMode + 1) % 3)
  }

  function playPauseButtonDidClick() {
    if (isPlaying) {
      audioRef.current?.pause()
    } else {
      audioRef.current?.play()
    }
    setIsPlaying(!isPlaying)
  }

  function audioMetadataDidLoad() {
    totalRef.current = audioRef.current?.duration ?? 0
  }

  function audioTimeDidUpdate() {
    if (audioRef.current) {
      setElapsed(audioRef.current.currentTime)

      if (
        !playedRef.current &&
          audioRef.current.currentTime / totalRef.current > 0.8
      ) {
        playedRef.current = true
        if (currentPlayingSong) {
          let i = 0;
          const newSongs = songs.slice()
          for (; i < newSongs.length; i += 1) {
            if (newSongs[i].id === currentPlayingSong.id) {
              newSongs[i].playCount += 1
              break
            }
          }
          setSongs(newSongs)

          SongService.modifySong({
            id: `${currentPlayingSong.id}`,
            playCount: `${newSongs[i].playCount}`
          })
        }
      }
    }
  }

  function audioDidEnd() {
    /* TODO: Add Play Next Queue */
    setIsPlaying(false)
    setCurrentPlayingSong(undefined)
    totalRef.current = 0
    setElapsed(0)
  }

  function currentPlayingSongDidChange() {
    if (!currentPlayingSong) {
      return
    }

    audioRef.current?.pause()
    playedRef.current = false
    setIsPlaying(false)

    audioRef.current = new Audio(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/file` +
        `?id=${currentPlayingSong?.fileID}&application=Music`
    )

    audioRef.current.addEventListener("loadedmetadata", audioMetadataDidLoad)
    audioRef.current.addEventListener("timeupdate", audioTimeDidUpdate)
    audioRef.current.addEventListener("ended", audioDidEnd)

    audioRef.current.play()
    setIsPlaying(true)

    return () => {
      audioRef.current?.pause()
      audioRef.current?.removeEventListener(
        "loadedmetadata",
        audioMetadataDidLoad
      )
      audioRef.current?.removeEventListener("timeupdate", audioTimeDidUpdate)
      audioRef.current?.removeEventListener("ended", audioDidEnd)
    }
  }

  return {
    isShuffleEnabled,
    repeatMode,
    isBackwardForwardButtonDisabled,
    isPlaying,
    currentPlayingSong,
    setCurrentPlayingSong,
    elapsed,
    totalRef,
    shuffleButtonDidClick,
    repeatButtonDidClick,
    playPauseButtonDidClick,
    currentPlayingSongDidChange
  }
}
