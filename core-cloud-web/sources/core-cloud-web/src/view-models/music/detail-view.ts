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

export default function useDetailView() {
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
  const [
    isPlayingNextQueuePresented,
    setIsPlayingNextQueuePresented
  ] = useState(false)
  const [playingNextQueue, setPlayingNextQueue] = useState<{
    id: number,
    artworkURLs: string[],
    fileID: number,
    title: string,
    artist: string,
    album: string,
    duration: number
  }[]>([])
  const [
    playingNextQueueAnimationClassName,
    setPlayingNextQueueAnimationClassName
  ] = useState("")

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
          SongService
            .fetchSong({
              id: currentPlayingSong.id.toString(),
              fields: "playCount"
            })
            .then(response => {
              if (response?.playCount !== undefined) {
                SongService.modifySong({
                  id: currentPlayingSong.id.toString(),
                  playCount: (response.playCount + 1).toString()
                })
              }
            })
        }
      }
    }
  }

  function audioDidEnd() {
    totalRef.current = 0
    setElapsed(0)

    if (playingNextQueue.length > 0) {
      const newPlayingNextQueue = playingNextQueue.slice()

      const currentSong = newPlayingNextQueue.shift()
      setCurrentPlayingSong({
        id: currentSong?.id ?? 0,
        artworkURLs: currentSong?.artworkURLs ?? [],
        fileID: currentSong?.fileID ?? 0,
        title: currentSong?.title ?? "",
        artist: currentSong?.artist ?? "",
        album: currentSong?.album ?? ""
      })
      setPlayingNextQueue(newPlayingNextQueue)
    } else {
      setIsPlaying(false)
      setCurrentPlayingSong(undefined)
    }
  }

  function currentPlayingSongDidChange() {
    if (!currentPlayingSong) {
      return
    }

    audioRef.current?.pause()
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
    playedRef.current = false
    setIsPlaying(false)

    audioRef.current?.play()
    setIsPlaying(true)

    return () => {
      audioRef.current?.pause()
    }
  }

  function playingNextQueueToggleDidTrigger() {
    if (isPlayingNextQueuePresented) {
      setPlayingNextQueueAnimationClassName(
        "animate-[300ms_linear_0ms_both_svelte-636731410-0]"
      )
      setTimeout(() => {
        setPlayingNextQueueAnimationClassName("")
        setIsPlayingNextQueuePresented(!isPlayingNextQueuePresented)
      }, 300)
    } else {
      setPlayingNextQueueAnimationClassName(
        "animate-[300ms_linear_0ms_both_svelte-1102588416-0]"
      )
      setIsPlayingNextQueuePresented(!isPlayingNextQueuePresented)
      setTimeout(() => {
        setPlayingNextQueueAnimationClassName("")
      }, 300)
    }
  }

  return {
    audioRef,
    isShuffleEnabled,
    repeatMode,
    isBackwardForwardButtonDisabled,
    isPlaying,
    currentPlayingSong,
    setCurrentPlayingSong,
    elapsed,
    totalRef,
    isPlayingNextQueuePresented,
    playingNextQueue,
    setPlayingNextQueue,
    playingNextQueueAnimationClassName,
    shuffleButtonDidClick,
    repeatButtonDidClick,
    playPauseButtonDidClick,
    currentPlayingSongDidChange,
    playingNextQueueToggleDidTrigger,
    audioMetadataDidLoad,
    audioTimeDidUpdate,
    audioDidEnd
  }
}
