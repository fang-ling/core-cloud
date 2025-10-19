//
//  tv-show-list-view.tsx
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

import useTVShowListView from "@/view-models/tv/tv-show-list-view"
import { useEffect } from "react"
import EmptyView from "./empty-view"
import VStack from "ui/v-stack"
import HStack from "ui/h-stack"
import Text from "ui/text"
import Grid from "ui/grid"
import Alignment from "ui/alignment"
import ZStack from "ui/z-stack"
import AsyncImage from "ui/async-image"
import ContentMode from "ui/content-mode"

export default function TVShowListView({
  tvShows,
  setTVShows,
  setSelectedTVShow
}: {
  tvShows: {
    id: number,
    posterURLs: string
  }[],
  setTVShows: React.Dispatch<React.SetStateAction<{
    id: number,
    posterURLs: string
  }[]>>,
  setSelectedTVShow: React.Dispatch<React.SetStateAction<{
    id: number,
    posterURLs: string
  } | undefined>>
}) {
  const viewModel = useTVShowListView({
    setTVShows: setTVShows,
    setSelectedTVShow: setSelectedTVShow
  })

  useEffect(() => {
    viewModel.viewDidAppear()
  }, [])

  return (
    <>
      {
        tvShows.length > 0 && (
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
                textKey="TV Shows"
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
                "grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
              }
              overflowClassName="overflow-y-auto"
              paddingClassName="px-6.25 lg:px-10 pb-3.75"
              horizontalSpacingClassName="gap-x-2.5 lg:gap-x-5"
              verticalSpacingClassName="gap-y-6.25"
            >
              {
                tvShows.map(tvShow => (
                  <VStack
                    key={tvShow.id}
                    pointerStyleClassname="hover:cursor-pointer"
                    isGroup={true}
                  >
                    <ZStack
                      widthClassName="w-full"
                      heightClassName="aspect-2/3"
                    >
                      <AsyncImage
                        urls={tvShow.posterURLs.split(",")}
                        contentMode={ContentMode.fit}
                        borderClassName="rounded-lg"
                        shadowClassName={
                          "shadow-md shadow-black/10 dark:shadow-black/60"
                        }
                        positionClassName="absolute inset-0"
                      />
                      {/* Overlay */}
                      <HStack
                        positionClassName={
                          "absolute inset-0 opacity-100 " +
                            "not-group-hover:opacity-0"
                        }
                        backgroundStyleClassName="bg-[#3333334d]"
                        borderClassName="rounded-lg"
                        transitionClassName={
                          "transition-opacity duration-100 ease-[ease-in]"
                        }
                      >
                        {/* Detail button */}
                        {/*<Button
                          widthClassName="w-7.5"
                          heightClassName="h-7.5"
                          backgroundStyleClassName={
                            "bg-music-systemStandardThinMaterialSover " +
                              "hover:bg-systemBlue " +
                              "dark:backdrop-saturate-180 " +
                              "backdrop-saturate-190 backdrop-blur-[60px]"
                          }
                          borderClassName="rounded-full"
                          positionClassName="absolute bottom-2.5 right-2.5"
                          propagationStopped={true}
                          action={() => {

                          }}
                        >
                          <Image
                            systemName="ellipsis"
                            widthClassName="w-4"
                            marginClassName="ml-0.25"
                            foregroundStyleClassName="fill-white"
                          />
                          </Button>*/}
                      </HStack>
                    </ZStack>
                  </VStack>
                ))
              }
            </Grid>
          </VStack>
        )
      }

      {/* Empty */}
      {
        tvShows.length <= 0 && <EmptyView />
      }
    </>
  )
}
