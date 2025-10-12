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
import Grid from "ui/grid"
import HStack from "ui/h-stack"
import Image from "ui/image"
import NewLocalizer from "ui/localizer"
import Spacer from "ui/spacer"
import Text from "ui/text"
import VStack from "ui/v-stack"
import ZStack from "ui/z-stack"

export default function AlbumDetailView({
  album,
  setAlbum,
  setCurrentPlayingSong,
  setPlayingNextQueue
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
  } | undefined>>,
  setCurrentPlayingSong: React.Dispatch<React.SetStateAction<{
    id: number,
    artworkURLs: string[],
    fileID: number,
    title: string,
    artist: string,
    album: string
  } | undefined>>,
  setPlayingNextQueue: React.Dispatch<React.SetStateAction<{
    id: number,
    artworkURLs: string[],
    fileID: number,
    title: string,
    artist: string,
    album: string,
    duration: number
  }[]>>
}) {
  const viewModel = useAlbumDetailView({
    album: album,
    setAlbum: setAlbum,
    setCurrentPlayingSong: setCurrentPlayingSong,
    setPlayingNextQueue: setPlayingNextQueue
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
      paddingClassName="not-md:pb-16"
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

      <Grid
        widthClassName="w-full"
        paddingClassName="md:p-10 not-md:px-6.25 not-md:pb-8 not-md:pt-5"
        gridTemplateClassName="grid-cols-1 md:grid-cols-[auto_1fr]"
      >
        {/* Artwork */}
        <ZStack
          widthClassName="w-67.5 min-w-67.5"
          heightClassName="h-67.5 min-h-67.5"
          marginClassName="mx-auto md:mr-7.5"
        >
          <AsyncImage
            widthClassName="w-67.5"
            heightClassName="h-67.5"
            borderClassName="rounded-[10px]"
            positionClassName="absolute inset-0"
            opacityClassName="opacity-40 dark:opacity-30"
            transformClassName="scale-88 origin-bottom"
            foregroundStyleClassName="blur-[20px] saturate-200 "
            urls={album.artworkURLs.split(",")}
          />
          <AsyncImage
            widthClassName="w-67.5"
            heightClassName="h-67.5"
            borderClassName="rounded-[10px]"
            positionClassName="absolute inset-0"
            shadowClassName={
              "shadow-[0_10px_20px_0_rgba(0,0,0,.1)] " +
                "dark:shadow-[0_10px_20px_0_rgba(0,0,0,.3)]"
            }
            urls={album.artworkURLs.split(",")}
          />
        </ZStack>

        {/* Detail */}
        <VStack
          heightClassName="md:h-full"
          marginClassName="not-md:mt-4.5"
        >
          <VStack
            widthClassName="w-full"
            heightClassName="h-full"
          >
            <Spacer />

            <Text
              verbatimContent={album.name}
              fontSizeClassName="text-[26px]"
              foregroundStyleClassName="text-music-systemPrimary"
              fontWeightClassName="font-semibold"
              lineHeightClassName="leading-8"
              multilineTextAlignmentClassName="not-md:text-center"
            />
            <Text
              verbatimContent={album.artist}
              fontSizeClassName="text-[26px]"
              foregroundStyleClassName="text-music-keyColor"
              lineHeightClassName="leading-8"
              multilineTextAlignmentClassName="not-md:text-center"
            />
            <HStack
              widthClassName="md:w-full"
              marginClassName="mt-1 not-md:mx-auto"
            >
              {
                [
                  { text: album.genre, isLocalizeStringKey: true },
                  { text: " · ", isLocalizeStringKey: false },
                  { text: album.year?.toString(), isLocalizeStringKey: false }
                ].map(item => (
                  <HStack key={album.id}>
                    <Text
                      textKey={item.isLocalizeStringKey ? item.text : undefined}
                      verbatimContent={
                        !item.isLocalizeStringKey ? item.text: undefined
                      }
                      fontSizeClassName="text-xs"
                      foregroundStyleClassName="text-music-systemSecondary"
                      fontWeightClassName="font-semibold"
                      lineHeightClassName="leading-3.75"
                    />
                  </HStack>
                ))
              }
            </HStack>

            <Spacer />
          </VStack>

          <HStack
            widthClassName="md:w-full"
            marginClassName="not-md:mt-4.5 not-md:mx-auto"
          >
            {
              [
                {
                  label: "Play",
                  icon: "play.fill",
                  action: () => viewModel.playButtonDidClick()
                },
                { label: "Shuffle", icon: "shuffle", action: () => {} }
              ].map((item, index) => (
                <Button
                  key={index}
                  action={item.action}
                  backgroundStyleClassName={
                    "bg-music-keyColor active:bg-music-keyColor-pressed"
                  }
                  widthClassName="min-w-25"
                  heightClassName="h-7"
                  borderClassName="rounded-md"
                  marginClassName={index === 0 ? "mr-4 md:mr-2.5" : ""}
                  transitionClassName={
                    "transition-[background-color] duration-100 ease-[ease-in]"
                  }
                >
                  <Image
                    systemName={item.icon}
                    heightClassName="h-3"
                    foregroundStyleClassName="fill-white"
                  />
                  <HStack marginClassName="ml-0.5">
                    <Text
                      textKey={item.label}
                      foregroundStyleClassName="text-white"
                      fontSizeClassName="text-[13px]"
                      fontWeightClassName="font-semibold"
                      lineHeightClassName="leading-4"
                    />
                  </HStack>
                </Button>
              ))
            }
          </HStack>
        </VStack>
      </Grid>

      {
        [...new Set(viewModel.songs.map(song => song.discNumber))].map(disc => (
          <VStack
            key={disc}
            widthClassName="w-full"
            paddingClassName="px-6.25 md:px-10"
            marginClassName="not-first:mt-9.5"
          >
            <Text
              verbatimContent={
                NewLocalizer.default.localize("Disc %lld")
                  .replace("%lld", disc.toString())
              }
              fontSizeClassName="text-xs"
              fontWeightClassName="font-semibold"
              foregroundStyleClassName="text-music-systemSecondary"
              lineHeightClassName="leading-3.75"
              marginClassName="mb-2.25"
            />
            {
              viewModel.songs
                .filter(song => song.discNumber === disc)
                .sort((lhs, rhs) => lhs.trackNumber - rhs.trackNumber)
                .map(song => (
                  <HStack
                    key={song.id}
                    widthClassName="w-full"
                    heightClassName="h-11.5 min-h-11.5"
                    borderClassName="rounded-md"
                    backgroundStyleClassName={
                      viewModel.selectedSongID === song.id
                        ? "bg-music-selectionColor"
                        : "even:bg-music-tracklistAltRowColor " +
                          "hover:bg-music-tracklistHoverColor"
                    }
                    positionClassName="relative"
                    onClick={() => viewModel.trackListItemDidClick(song.id)}
                    onDoubleClick={() => {
                      viewModel.trackListItemDidDoubleClick(
                        song.discNumber,
                        song.trackNumber
                      )
                    }}
                  >
                    {
                      song.isPopular && (
                        <HStack
                          widthClassName="w-6.25"
                          heightClassName="h-full"
                          positionClassName="absolute top-0 -left-6.25"
                        >
                          <HStack
                            widthClassName="w-1.5"
                            heightClassName="h-1.5"
                            backgroundStyleClassName="bg-music-systemSecondary"
                            marginClassName="mx-auto"
                            borderClassName="rounded-full"
                          />
                        </HStack>
                      )
                    }

                    <HStack widthClassName="w-10 min-w-10">
                      <Text
                        verbatimContent={song.trackNumber.toString()}
                        fontSizeClassName="text-[13px]"
                        lineHeightClassName="leading-4.25"
                        foregroundStyleClassName={
                          viewModel.selectedSongID === song.id
                            ? "text-white"
                            : "text-music-systemSecondary"
                        }
                        multilineTextAlignmentClassName="text-center"
                      />
                    </HStack>

                    <VStack widthClassName="w-full">
                      <Text
                        verbatimContent={song.title}
                        fontSizeClassName="text-[13px]"
                        foregroundStyleClassName={
                          viewModel.selectedSongID === song.id
                            ? "text-white"
                            : "text-music-systemPrimary"
                        }
                        lineHeightClassName="leading-4"
                      />
                      {
                        song.artist !== album.artist && (
                          <Text
                            verbatimContent={song.artist}
                            fontSizeClassName="text-[13px]"
                            foregroundStyleClassName={
                              viewModel.selectedSongID === song.id
                                ? "text-white"
                                : "text-music-systemSecondary"
                            }
                            lineHeightClassName="leading-4"
                          />
                        )
                      }
                    </VStack>

                    <HStack
                      widthClassName="w-9 min-w-9"
                      marginClassName="mr-4.5"
                    >
                      <Text
                        verbatimContent={
                          new Date(song.duration * 1000)
                            .toISOString()
                            .substring(14, 19)
                        }
                        fontSizeClassName="text-[13px]"
                        foregroundStyleClassName={
                          viewModel.selectedSongID === song.id
                            ? "text-white"
                            : "text-music-systemSecondary"
                        }
                        lineHeightClassName="leading-4"
                        multilineTextAlignmentClassName="text-right"
                        fontDesignClassName="tabular-nums"
                      />
                    </HStack>
                  </HStack>
                ))
            }
          </VStack>
        ))
      }

      <HStack widthClassName="w-full">
        <Text
          verbatimContent={
            NewLocalizer.default.localize("%lld item(s)").replace(
              "%lld",
              viewModel.songs.length.toString()
            )
          }
          fontSizeClassName="text-[13px]"
          foregroundStyleClassName="text-music-systemSecondary"
          lineHeightClassName="leading-4"
          marginClassName="mt-8.5 mx-6.25 md:mx-10 mb-13"
          paddingClassName="pl-3"
        />
      </HStack>
    </VStack>
  )
}
