//
//  home-video-list-view.ts
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

export default function useHomeVideoListView({
  setHomeVideos
}: {
  setHomeVideos: React.Dispatch<React.SetStateAction<{
    id: number,
    title: string,
    artworkURLs: string
    fileID: number
  }[]>>
}) {
  /* MARK: - Event handlers */
  async function viewDidAppear() {
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

  return {
    viewDidAppear
  }
}
