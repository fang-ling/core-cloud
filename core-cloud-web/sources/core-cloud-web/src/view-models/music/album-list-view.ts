//
//  album-list-view.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/9/13.
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

import AlbumService from "@/services/album-service"

export default function useAlbumListView({
  setAlbums
}: {
  setAlbums: React.Dispatch<React.SetStateAction<{
    id: number,
    name: string,
    artist: string,
    artworkURLs: string
  }[]>>
}) {
  /* MARK: Event handlers */
  async function viewDidAppear() {
    let newAlbums = await AlbumService.fetchAlbums({
      fields: "name,artist,artworkURLs"
    })
    setAlbums(
      newAlbums.map(album => {
        return {
          id: album.id,
          name: album.name ?? "",
          artist: album.artist ?? "",
          artworkURLs: album.artworkURLs ?? ""
        }
      })
    )
  }

  return {
    viewDidAppear
  }
}
