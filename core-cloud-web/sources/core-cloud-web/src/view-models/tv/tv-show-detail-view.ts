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

import TVShowService from "@/services/tv-show-service"

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

  function backButtonDidClick() {
    setTVShow(undefined)
  }

  return {
    viewDidAppear1,
    backButtonDidClick
  }
}
