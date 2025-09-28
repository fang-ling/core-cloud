//
//  album-detail-view.tsx
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

import useAlbumDetailView from "@/view-models/music/album-detail-view"
import { useEffect } from "react"
import AsyncImage from "ui/async-image"
import Button from "ui/button"
import HStack from "ui/h-stack"
import Image from "ui/image"
import Text from "ui/text"
import VStack from "ui/v-stack"

export default function AlbumDetailView({
  album,
  setAlbum
}: {
  album: {
    id: number,
    name: string,
    artist: string,
    artworkURLs: string,
    genre?: string,
    year?: number
  },
  setAlbum: React.Dispatch<React.SetStateAction<{
    id: number,
    name: string,
    artist: string,
    artworkURLs: string,
    genre?: string,
    year?: number
  } | undefined>>
}) {
  const viewModel = useAlbumDetailView({
    album: album,
    setAlbum: setAlbum
  })

  useEffect(() => {
    viewModel.viewDidAppear1()
    viewModel.viewDidAppear2()
  }, [])

  return (
    <VStack
      widthClassName="w-full"
      heightClassName="h-full"
      overflowClassName="overflow-y-auto"
    >
      <HStack widthClassName="w-full">
        {/* Back Button */}
        <Button
          widthClassName="w-7 md:w-8.5"
          heightClassName="h-7 md:h-8.5"
          backgroundStyleClassName={
            "hover:bg-fillTertiary active:bg-music-keyColor/16"
          }
          borderClassName="rounded-lg"
          marginClassName="mt-1.5 ml-12 md:ml-2.5"
          action={() => viewModel.backButtonDidClick()}
        >
          <Image
            systemName="chevron.left.circle.fill"
            widthClassName="w-4.75 md:w-5.5"
            heightClassName="h-4.75 md:h-5.5"
            foregroundStyleClassName={
              "fill-music-keyColor active:fill-music-keyColor/30"
            }
          />
        </Button>
      </HStack>

      <AsyncImage
        urls={album.artworkURLs.split(",")}
      />
      <Text
        verbatimContent={album.name}
      />
      <Text
        verbatimContent={album.artist}
      />
      <Text
        textKey={album.genre}
      />
      <Text
        verbatimContent={album.year?.toString()}
      />

      {
        viewModel.songs.map(song => (
          <HStack widthClassName="w-full">
            <Text
              verbatimContent={song.isPopular ? "P" : "X"}
            />
            <Text
              verbatimContent={`${song.discNumber}-${song.trackNumber}`}
            />
            <Text
              verbatimContent={song.title}
            />
            <Text
              verbatimContent={
                new Date(song.duration * 1000)
                  .toISOString()
                  .substring(14, 19)
              }
            />
          </HStack>
        ))
      }
    </VStack>
  )
}
