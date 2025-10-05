//
//  detail-view.tsx
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

import HStack from "ui/h-stack"
import HomeVideoListView from "./home-video-list-view"

export default function DetailView({
  selectedSidebarItemKey,
  homeVideos,
  setHomeVideos
}: {
  selectedSidebarItemKey: string,
  homeVideos: {
    id: number,
    title: string,
    artworkURLs: string
    fileID: number
  }[],
  setHomeVideos: React.Dispatch<React.SetStateAction<{
    id: number,
    title: string,
    artworkURLs: string
    fileID: number
  }[]>>
}) {
  return (
    <HStack
      widthClassName="w-full"
      heightClassName="h-full"
      overflowClassName="overflow-hidden"
    >
      {
        selectedSidebarItemKey === "home videos" && (
          <HomeVideoListView
            homeVideos={homeVideos}
            setHomeVideos={setHomeVideos}
          />
        )
      }
    </HStack>
  )
}
