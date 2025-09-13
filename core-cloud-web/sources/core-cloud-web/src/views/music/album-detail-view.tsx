//
//  album-detail-view.tsx
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

import useAlbumDetailView from "@/view-models/music/album-detail-view"
import { useEffect } from "react"
import AsyncImage from "ui/async-image"
import Text from "ui/text"

export default function AlbumDetailView({
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
  const viewModel = useAlbumDetailView({
    setAlbums: setAlbums
  })

  useEffect(() => {
    viewModel.viewDidAppear()
  }, [])

  return (
    <>
      {
        albums.map(album => (
          <div
            className="w-full flex"
            key={album.id}
          >
            <AsyncImage
              widthClassName="w-5"
              heightClassName="h-5"
              urls={album.artworkURLs.split(",")}
            />
            <Text verbatimContent={album.name} />
            <Text verbatimContent={album.artist} />
          </div>
        ))
      }
    </>
  )
}
