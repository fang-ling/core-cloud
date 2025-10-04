//
//  playing-next-queue.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/10/03.
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

import usePlayingNextQueue from "@/view-models/music/playing-next-queue"
import { useEffect } from "react"
import AsyncImage from "ui/async-image"
import Button from "ui/button"
import HStack from "ui/h-stack"
import Spacer from "ui/spacer"
import Text from "ui/text"
import VStack from "ui/v-stack"

export default function PlayingNextQueue({
  queue,
  animationClassName,
  setPlayingNextQueue
}: {
  queue: {
    id: number,
    artworkURLs: string[],
    fileID: number,
    title: string,
    artist: string,
    album: string,
    duration: number
  }[],
  animationClassName: string,
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
  const viewModel = usePlayingNextQueue({
    setPlayingNextQueue: setPlayingNextQueue
  })

  useEffect(() => {
    viewModel.queueDidChange()
  }, [queue])

  return (
    <VStack
      widthClassName="w-75 min-w-75"
      heightClassName="h-full"
      borderClassName={
        "border-t border-t-music-playerDropShadow2 border-l-[0.5px] " +
          "border-l-music-systemQuaternary"
      }
      shadowClassName="shadow-[0_0_3px_rgba(0,0,0,.1)]"
      backgroundStyleClassName={
        "bg-music-systemToolbarTitlebarMaterialSover backdrop-blur-[60px]"
      }
      animationClassName={animationClassName}
      visibilityClassName="not-md:hidden"
    >
      <HStack
        widthClassName="w-full"
        paddingClassName="px-5 pt-5.75 pb-3"
      >
        <HStack>
          <Text
            textKey="Playing Next"
            fontSizeClassName="text-base"
            fontWeightClassName="font-bold"
            lineHeightClassName="leading-5.5"
            foregroundStyleClassName="text-music-systemPrimary"
          />
        </HStack>

        <Spacer />

        {
          queue.length > 0 && (
            <Button action={() => viewModel.clearQueueButtonDidClick()}>
              <Text
                textKey="Clear"
                fontSizeClassName="text-[15px]"
                lineHeightClassName="leading-5"
                foregroundStyleClassName="text-music-keyColor"
              />
            </Button>
          )
        }
      </HStack>

      {
        queue.length > 0 && (
          <VStack
            widthClassName="w-full"
            paddingClassName="px-2.5"
            overflowClassName="overflow-y-auto"
          >
            {
              queue.map((song, index) => (
                <HStack
                  key={song.id}
                  paddingClassName="px-2.5"
                  widthClassName="w-full"
                  heightClassName="h-13.75 min-h-13.75"
                  spacingClassName="gap-3"
                  backgroundStyleClassName={
                    viewModel.selectedSongIndex === index
                      ? "bg-music-selectionColor"
                      : ""
                  }
                  borderClassName="rounded-md"
                  onClick={() => viewModel.songItemDidClick(index)}
                >
                  <AsyncImage
                    widthClassName="w-10 min-w-10"
                    heightClassName="h-10 min-h-10"
                    urls={song.artworkURLs}
                    borderClassName="rounded-[3px]"
                  />
                  <HStack
                    spacingClassName="gap-3"
                    heightClassName="h-full"
                    borderClassName={
                      (
                        index !== queue.length - 1 &&
                          (
                            index !== viewModel.selectedSongIndex &&
                              index + 1 !== viewModel.selectedSongIndex
                          )
                      )
                        ? "border-b-[0.5px] border-b-music-labelDivider"
                        : ""
                    }
                  >
                    <VStack widthClassName="w-39">
                      <Text
                        verbatimContent={song.title}
                        fontSizeClassName="text-[13px]"
                        foregroundStyleClassName={
                          index === viewModel.selectedSongIndex
                            ? "text-white"
                            : "text-music-systemPrimary"
                        }
                        lineHeightClassName="leading-4"
                        truncationClassName="truncate"
                      />
                      <Text
                        verbatimContent={`${song.artist} — ${song.album}`}
                        fontSizeClassName="text-[13px]"
                        foregroundStyleClassName={
                          index === viewModel.selectedSongIndex
                            ? "text-white"
                            : "text-music-systemSecondary"
                        }
                        lineHeightClassName="leading-4"
                        truncationClassName="truncate"
                        marginClassName="mt-0.5"
                      />
                    </VStack>

                    <HStack widthClassName="w-10 min-w-10">
                      <Text
                        verbatimContent={
                          new Date(song.duration * 1000)
                            .toISOString()
                            .substring(14, 19)
                        }
                        fontSizeClassName="text-[13px]"
                        foregroundStyleClassName={
                          index === viewModel.selectedSongIndex
                            ? "text-white"
                            : "text-music-systemSecondary"
                        }
                        lineHeightClassName="leading-4"
                        multilineTextAlignmentClassName="text-center"
                      />
                    </HStack>
                  </HStack>
                </HStack>
              ))
            }
          </VStack>
        )
      }

      {
        queue.length <= 0 && (
          <HStack
            widthClassName="w-full"
            heightClassName="h-full"
          >
            <Text
              textKey="No upcoming songs."
              fontSizeClassName="text-xs"
              lineHeightClassName="leading-3.75"
              foregroundStyleClassName="text-music-systemSecondary"
              multilineTextAlignmentClassName="text-center"
            />
          </HStack>
        )
      }
    </VStack>
  )
}
