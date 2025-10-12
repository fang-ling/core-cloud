//
//  home-video-list-view.tsx
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

import useHomeVideoListView from "@/view-models/tv/home-video-list-view"
import { useEffect, useRef, useState } from "react"
import AsyncImage from "ui/async-image"
import Text from "ui/text"
import VStack from "ui/v-stack"
import EmptyView from "./empty-view"
import HStack from "ui/h-stack"
import Grid from "ui/grid"
import Alignment from "ui/alignment"
import ZStack from "ui/z-stack"
import ContentMode from "ui/content-mode"
import Button from "ui/button"
import Image from "ui/image"

export default function HomeVideoListView({
  homeVideos,
  setHomeVideos
}: {
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
  const viewModel = useHomeVideoListView({
    setHomeVideos: setHomeVideos
  })

  const tempPlayer = useRef<HTMLVideoElement | null>(null)
  const [tempURL, setTempURL] = useState<string | undefined>(undefined)

  useEffect(() => {
    viewModel.viewDidAppear()
  }, [])

  useEffect(() => {
    const b = () => {
      if (!document.fullscreenElement) {
        tempPlayer.current?.pause()
        setTempURL(undefined)
      }
    }

    document.addEventListener("fullscreenchange", b)

    return () => {
      document.removeEventListener("fullscreenchange", b)
    }
  }, [])

  /* Does the same thing but works on iPadOS. */
  useEffect(() => {
    const b = () => {
      tempPlayer.current?.pause()
      setTempURL(undefined)
    }

    tempPlayer.current?.addEventListener("webkitendfullscreen", b)

    return () => {
      tempPlayer.current?.removeEventListener("webkitendfullscreen", b)
    }
  }, [tempPlayer])

  return (
    <>
      {
        homeVideos.length > 0 && (
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
                textKey="Home Videos"
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
                "grid-cols-[repeat(2,minmax(0,1fr))] " +
                  "md:grid-cols-[repeat(3,minmax(0,1fr))] " +
                  "lg:grid-cols-[repeat(4,minmax(1fr))]"
              }
              overflowClassName="overflow-y-auto"
              paddingClassName="px-6.25 lg:px-10 pb-3.75"
              horizontalSpacingClassName="gap-x-2.5 lg:gap-x.5"
              verticalSpacingClassName="gap-y-6.25"
            >
              {
                homeVideos.map(homeVideo => (
                  <VStack
                    key={homeVideo.id}
                    isGroup={true}
                  >
                    <ZStack
                      widthClassName="w-full"
                      heightClassName="aspect-16/9"
                    >
                      <AsyncImage
                        urls={homeVideo.artworkURLs.split(",")}
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
                        {/* Play button */}
                        <Button
                          widthClassName="w-7.5"
                          heightClassName="h-7.5"
                          backgroundStyleClassName={
                            "bg-music-systemStandardThinMaterialSover " +
                              "hover:bg-systemBlue " +
                              "dark:backdrop-saturate-180 " +
                              "backdrop-saturate-190 backdrop-blur-[60px]"
                          }
                          borderClassName="rounded-full"
                          positionClassName="absolute bottom-2.5 left-2.5"
                          propagationStopped={true}
                          action={() => {
                            setTempURL(
                              `${process.env.NEXT_PUBLIC_API_HOST}/api/file` +
                                `?id=${homeVideo.fileID}` +
                                "&application=TV"
                            )
                          }}
                        >
                          <Image
                            systemName="play.fill"
                            widthClassName="w-3"
                            marginClassName="ml-0.25"
                            foregroundStyleClassName="fill-white"
                          />
                        </Button>

                        {/* Detail button */}
                        <Button
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
                        </Button>
                      </HStack>
                    </ZStack>
                    <HStack widthClassName="w-full">
                      <Text
                        verbatimContent={homeVideo.title}
                        marginClassName="mt-1"
                        fontSizeClassName="text-xs"
                        lineHeightClassName="leading-3.75"
                        foregroundStyleClassName="text-music-systemPrimary"
                        truncationClassName="truncate"
                      />
                    </HStack>
                  </VStack>
                ))
              }
            </Grid>
          </VStack>
        )
      }

      {/* Empty */}
      {
        homeVideos.length <= 0 && <EmptyView />
      }

      <video
        className={!tempURL ? "hidden" : ""}
        ref={tempPlayer}
        src={tempURL}
        onLoadedMetadata={() => {
          (tempPlayer.current as any)?.webkitEnterFullscreen()
          tempPlayer.current?.play()
        }}
        onEnded={() => {
          (tempPlayer.current as any)?.webkitExitFullscreen()
          setTempURL(undefined)
        }}
      />
    </>
  )
}
