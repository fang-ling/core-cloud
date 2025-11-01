//
//  tv-show-detail-view.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/10/26.
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

import EpisodeService from "@/services/episode-service"
import TVShowService from "@/services/tv-show-service"
import { useState } from "react"
import { useBinding } from "ui/binding"

export default function useTVShowDetailView({
  tvShow,
  setTVShow
}: {
  tvShow: {
    id: number,
    posterURLs: string,
    artworkURLs?: string,
    titleLogoURLs?: string,
    title?: string,
    starring?: string,
    startYear?: number,
    endYear?: number,
    region?: string,
    description?: string,
    studio?: string,
    genre?: string
  },
  setTVShow: React.Dispatch<React.SetStateAction<{
    id: number,
    posterURLs: string,
    artworkURLs?: string,
    titleLogoURLs?: string,
    title?: string,
    starring?: string,
    startYear?: number,
    endYear?: number,
    region?: string,
    description?: string,
    studio?: string,
    genre?: string
  } | undefined>>
}) {
  const isNewEpisodeSheetPresented = useBinding(false)
  const [episodes, setEpisodes] = useState<{
    id: number,
    title: string,
    description: string,
    date: number,
    duration: number,
    width: number,
    height: number,
    isHDR: boolean,
    episodeNumber: number,
    seasonNumber: number,
    artworkURLs: string,
    fileID: number
  }[]>([])
  const isEpisodeDescriptionSheetPresented = useBinding(false)

  /* MARK: - Event handlers */
  async function viewDidAppear1() {
    const detail = await TVShowService.fetchTVShow({
      id: tvShow.id.toString()
    })
    if (detail) {
      setTVShow({
        ...tvShow,
        artworkURLs: detail.artworkURLs,
        titleLogoURLs: detail.titleLogoURLs,
        title: detail.title,
        starring: detail.starring,
        startYear: detail.startYear,
        endYear: detail.endYear,
        region: detail.region,
        description: detail.description,
        studio: detail.studio,
        genre: detail.genre
      })
    }
  }

  async function viewDidAppear2() {
    await updateEpisodes()
  }

  function backButtonDidClick() {
    setTVShow(undefined)
  }

  async function newEpisodeDidCreate() {
    await updateEpisodes()
  }

  function newEpisodeButtonDidClick() {
    isNewEpisodeSheetPresented.toggle()
  }

  function showEpisodeDescriptionButtonDidClick() {
    isEpisodeDescriptionSheetPresented.toggle()
  }

  /* MARK: - Utilities */
  async function updateEpisodes() {
    const newEpisodes = await EpisodeService.fetchEpisodes({
      fields: [
        "id",
        "title",
        "description",
        "date",
        "duration",
        "width",
        "height",
        "isHDR",
        "episodeNumber",
        "seasonNumber",
        "artworkURLs",
        "fileID"
      ]
        .join(","),
      filters: `tvShowID_EQUALS_${tvShow.id}`
    })

    setEpisodes(
      newEpisodes
        .sort((lhs, rhs) => {
          return (
            (lhs.seasonNumber ?? 0) - (rhs.seasonNumber ?? 0) ||
              (lhs.episodeNumber ?? 0) - (rhs.episodeNumber ?? 0)
          )
        })
        .map(episode => {
          return {
            id: episode.id,
            title: episode.title ?? "",
            description: episode.description ?? "",
            date: episode.date ?? 0,
            duration: episode.duration ?? 0,
            width: episode.width ?? 0,
            height: episode.height ?? 0,
            isHDR: episode.isHDR ?? false,
            episodeNumber: episode.episodeNumber ?? 0,
            seasonNumber: episode.seasonNumber ?? 0,
            artworkURLs: episode.artworkURLs ?? "",
            fileID: episode.fileID ?? 0
          }
        })
    )
  }

  return {
    isNewEpisodeSheetPresented,
    isEpisodeDescriptionSheetPresented,
    episodes,
    viewDidAppear1,
    viewDidAppear2,
    backButtonDidClick,
    newEpisodeDidCreate,
    newEpisodeButtonDidClick,
    showEpisodeDescriptionButtonDidClick
  }
}
