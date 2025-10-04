//
//  playing-next-queue.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/10/04.
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

import { useState } from "react"

export default function usePlayingNextQueue({
  setPlayingNextQueue
}: {
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
  const [
    selectedSongIndex,
    setSelectedSongIndex
  ] = useState<number | undefined>(undefined)

  /* MARK: - Event handlers */
  function songItemDidClick(index: number) {
    setSelectedSongIndex(index)
  }

  function queueDidChange() {
    setSelectedSongIndex(undefined)
  }

  function clearQueueButtonDidClick() {
    setPlayingNextQueue([])
  }

  return {
    selectedSongIndex,
    songItemDidClick,
    queueDidChange,
    clearQueueButtonDidClick
  }
}
