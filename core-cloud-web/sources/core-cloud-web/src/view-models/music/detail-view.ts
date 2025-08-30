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
  ] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlayingSong, setCurrentPlayingSong] = useState<{
    artworkURLs: string[],
    fileID: string,
    title: string,
    artist: string,
    album: string
  }>()
  const [elapsed, setElapsed] = useState(0)
  const totalRef = useRef(0)

  /* MARK: - Event handlers */
  function shuffleButtonDidClick() {
    setIsShuffleEnabled(!isShuffleEnabled)
  }

  function repeatButtonDidClick() {
    setRepeatMode((repeatMode + 1) % 3)
  }

  function playPauseButtonDidClick() {
    setIsPlaying(!isPlaying)
  }

  return {
    isShuffleEnabled,
    repeatMode,
    isBackwardForwardButtonDisabled,
    isPlaying,
    currentPlayingSong,
    elapsed,
    totalRef,
    shuffleButtonDidClick,
    repeatButtonDidClick,
    playPauseButtonDidClick
  }
}
