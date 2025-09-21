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
import ContentMode from "ui/content-mode"
import Grid from "ui/grid"
import HStack from "ui/h-stack"
import Text from "ui/text"
import VStack from "ui/v-stack"
import Alignment from "ui/alignment"
import EmptyDetailView from "./empty-detail-view"

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
        albums.length > 0 && (
          <VStack
            widthClassName="w-full"
            heightClassName="h-full"
            overflowClassName="overflow-hidden"
          >
            <HStack
              marginClassName="mt-2.5"
              paddingClassName="pb-3"
            >
              <Text
                textKey="Albums"
                fontSizeClassName="text-[15px]"
                fontWeightClassName="font-semibold"
                lineHeightClassName="leading-5"
                foregroundStyleClassName="text-music-systemPrimary"
                multilineTextAlignmentClassName="text-center"
              />
            </HStack>
            <Grid
              alignment={Alignment.top}
              widthClassName="w-full"
              gridTemplateClassName={
                "grid-cols-[repeat(2,1fr)] md:grid-cols-[repeat(3,1fr)] " +
                  "lg:grid-cols-[repeat(4,1fr)] xl:grid-cols-[repeat(5,1fr)]"
              }
              overflowClassName="overflow-y-auto"
              paddingClassName="px-6.25 lg:px-10 pb-3.75"
              horizontalSpacingClassName="gap-x-2.5 lg:gap-x-5"
              verticalSpacingClassName="gap-y-6.25"
            >
              {
                albums.map(album => (
                  <VStack key={album.id}>
                    <AsyncImage
                      widthClassName="w-full"
                      urls={album.artworkURLs.split(",")}
                      contentMode={ContentMode.fit}
                      borderClassName="rounded-lg"
                    />
                    <Text
                      verbatimContent={album.name}
                      marginClassName="mt-1"
                      fontSizeClassName="text-xs"
                      lineHeightClassName="leading-3.75"
                      wrapClassName="text-wrap"
                      foregroundStyleClassName="text-music-systemPrimary"
                    />
                    <Text
                      verbatimContent={album.artist}
                      fontSizeClassName="text-xs"
                      lineHeightClassName="leading-3.75"
                      wrapClassName="text-wrap"
                      foregroundStyleClassName="text-music-systemSecondary"
                    />
                  </VStack>
                ))
              }
            </Grid>
          </VStack>
        )
      }

      {/* Empty */}
      {
        albums.length <= 0 && <EmptyDetailView />
      }
    </>
  )
}
