//
//  tv-show-list-view.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/10/19.
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

export default function useTVShowListView({
  setTVShows,
  setSelectedTVShow
}: {
  setTVShows: React.Dispatch<React.SetStateAction<{
    id: number,
    posterURLs: string
  }[]>>,
  setSelectedTVShow: React.Dispatch<React.SetStateAction<{
    id: number,
    posterURLs: string
  } | undefined>>
}) {
  /* MARK: - Event handlers */
  async function viewDidAppear() {
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

  function tvShowDidSelect(selectedTVShow: {
    id: number,
    posterURLs: string
  }) {
    setSelectedTVShow(selectedTVShow)
  }

  return {
    viewDidAppear,
    tvShowDidSelect
  }
}
