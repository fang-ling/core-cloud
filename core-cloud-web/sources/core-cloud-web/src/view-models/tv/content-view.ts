//
//  content-view.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/10/5.
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

import HomeVideoService from "@/services/home-video-service"
import TVShowService from "@/services/tv-show-service"
import { useRef, useState } from "react"
import { useBinding } from "ui/binding"

export default function useContentView() {
  const isCheckpointPassed = useBinding(false)
  const sectionsRef = useRef([
    {
      header: "Library",
      items: [
        {
          key: "tv shows",
          symbolName: "tv",
          title: "TV Shows"
        },
        {
          key: "home videos",
          symbolName: "video",
          title: "Home Videos"
        }
      ]
    }
  ])
  const [selectedSidebarItemKey, setSelectedSidebarItemKey] = useState(
    "tv shows"
  )
  const isNewHomeVideoSheetPresented = useBinding(false)
  const [homeVideos, setHomeVideos] = useState<{
    id: number,
    title: string,
    artworkURLs: string
    fileID: number
  }[]>([])
  const [tvShows, setTVShows] = useState<{
    id: number,
    posterURLs: string
  }[]>([])
  const isNewTVShowSheetPresented = useBinding(false)

  /* MARK: - Event handlers */
  function selectedSidebarItemKeyDidChange(newSelectedSidebarItemKey: string) {
    setSelectedSidebarItemKey(newSelectedSidebarItemKey)
  }

  function newHomeVideoButtonDidClick() {
    isNewHomeVideoSheetPresented.toggle()
  }

  function newTVShowSheetButtonDidClick() {
    isNewTVShowSheetPresented.toggle()
  }

  async function newHomeVideoDidCreate() {
    if (selectedSidebarItemKey !== "home videos") {
      return
    }

    const newHomeVideos = await HomeVideoService.fetchHomeVideos({
      fields: "title,artworkURLs,fileID"
    })
    setHomeVideos(
      newHomeVideos.map(homeVideo => {
        return {
          id: homeVideo.id,
          title: homeVideo.title ?? "",
          artworkURLs: homeVideo.artworkURLs ?? "",
          fileID: homeVideo.fileID ?? 0
        }
      })
    )
  }

  async function newTVShowDidCreate() {
    if (selectedSidebarItemKey !== "tv shows") {
      return
    }

    const newTVShows = await TVShowService.fetchTVShows({
      fields: "posterURLs"
    })
    setTVShows(
      newTVShows.map(tvShow => {
        return {
          id: tvShow.id,
          posterURLs: tvShow.posterURLs ?? ""
        }
      })
    )
  }

  return {
    isCheckpointPassed,
    sectionsRef,
    selectedSidebarItemKey,
    isNewHomeVideoSheetPresented,
    isNewTVShowSheetPresented,
    homeVideos,
    setHomeVideos,
    tvShows,
    setTVShows,
    selectedSidebarItemKeyDidChange,
    newHomeVideoButtonDidClick,
    newTVShowSheetButtonDidClick,
    newHomeVideoDidCreate,
    newTVShowDidCreate
  }
}
