//
//  album-content-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/9/28.
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

import useAlbumContentView from "@/view-models/music/album-content-view"
import AlbumListView from "./album-list-view"
import AlbumDetailView from "./album-detail-view"

export default function AlbumContentView({
  albums,
  setAlbums
}: {
  albums: {
    id: number,
    name: string,
    artist: string,
    artworkURLs: string
  }[],
  setAlbums: React.Dispatch<React.SetStateAction<{
    id: number,
    name: string,
    artist: string,
    artworkURLs: string
  }[]>>
}) {
  const viewModel = useAlbumContentView()

  return (
    <>
      {
        !viewModel.selectedAlbum && (
          <AlbumListView
            albums={albums}
            setAlbums={setAlbums}
            setSelectedAlbum={viewModel.setSelectedAlbum}
          />
        )
      }

      {
        viewModel.selectedAlbum && (
          <AlbumDetailView
            album={viewModel.selectedAlbum}
            setAlbum={viewModel.setSelectedAlbum}
          />
        )
      }
    </>
  )
}
