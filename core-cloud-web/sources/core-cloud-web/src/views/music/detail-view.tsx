//
//  detail-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/27.
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

import AsyncImage from "ui/async-image"
import useDetailView from "@/view-models/music/detail-view"
import Grid from "ui/grid"
import HStack from "ui/h-stack"
import Image from "ui/image"
import Text from "ui/text"
import VStack from "ui/v-stack"
import ZStack from "ui/z-stack"

export default function DetailView() {
  const viewModel = useDetailView()

  const PLAYER_OUTER_BUTTON_STYLE = (
    "w-7.5 h-8 flex items-center justify-center transition-colors " +
      "duration-200 ease-[ease-out] cursor-pointer"
  )
  const PLAYER_INNER_BUTTON_STYLE = (
    "size-8 flex items-center justify-center transition-colors duration-200 " +
      "ease-[ease-out] fill-music-systemSecondary " +
      "hover:fill-music-systemPrimary-vibrant"
  )

  return (
    <VStack>
      {/* Player, >= md */}
      <HStack
        widthClassName="w-full"
        heightClassName="h-13.5"
        shadowClassName="shadow-music-playerContainer"
        visibilityClassName="not-md:hidden"
      >
        <ZStack
          widthClassName="w-full"
          heightClassName="h-full"
        >
          <HStack
            widthClassName="w-full"
            heightClassName="h-full"
            positionClassName="absolute"
            backgroundStyleClassName={
              "bg-music-playerBGFill backdrop-saturate-50 backdrop-blur-[20px]"
            }
          />
          <Grid
            gridTemplateClassName={
              "grid-cols-[calc(30%-22px)_minmax(40%,900px)_calc(30%+22px)]"
            }
            widthClassName="w-full"
            heightClassName="h-full"
            positionClassName="absolute"
          >
            <HStack marginClassName="mx-auto">
              <button
                className={
                  `${PLAYER_OUTER_BUTTON_STYLE} ` + (
                    viewModel.isShuffleEnabled
                      ? "fill-music-keyColor"
                      : "fill-music-systemSecondary " +
                        "hover:fill-music-systemPrimary-vibrant " +
                        "active:fill-music-keyColor"
                  )
                }
                onClick={() => viewModel.shuffleButtonDidClick()}
              >
                <Image
                  systemName="shuffle"
                  heightClassName="h-3"
                />
              </button>
              <button
                className={
                  `${PLAYER_INNER_BUTTON_STYLE} ` + (
                    viewModel.isBackwardForwardButtonDisabled
                      ? "opacity-40 pointer-events-none"
                      : "cursor-pointer"
                  )
                }
                disabled={viewModel.isBackwardForwardButtonDisabled}
              >
                <Image
                  systemName="backward.fill"
                  heightClassName="h-3"
                />
              </button>
              <button
                className={`${PLAYER_INNER_BUTTON_STYLE} cursor-pointer`}
                onClick={() => viewModel.playPauseButtonDidClick()}
              >
                <Image
                  systemName={viewModel.isPlaying ? "pause.fill" : "play.fill"}
                  heightClassName="h-4.5"
                />
              </button>
              <button
                className={
                  `${PLAYER_INNER_BUTTON_STYLE} ` + (
                    viewModel.isBackwardForwardButtonDisabled
                      ? "opacity-40 pointer-events-none"
                      : "cursor-pointer"
                  )
                }
                disabled={viewModel.isBackwardForwardButtonDisabled}
              >
                <Image
                  systemName="forward.fill"
                  heightClassName="h-3"
                />
              </button>
              <button
                className={
                  `${PLAYER_OUTER_BUTTON_STYLE} ` + (
                    viewModel.repeatMode > 0
                      ? "fill-music-keyColor"
                      : "fill-music-systemSecondary " +
                        "hover:fill-music-systemPrimary-vibrant " +
                        "active:fill-music-keyColor"
                  )
                }
                onClick={() => viewModel.repeatButtonDidClick()}
              >
                <Image
                  systemName={
                    viewModel.repeatMode === 2 ? "repeat.1" : "repeat"
                  }
                  heightClassName="h-3"
                />
              </button>
            </HStack>
            <HStack
              paddingClassName="p-1.25"
              widthClassName="w-full"
              heightClassName="h-full"
            >
              <Grid
                gridTemplateClassName={
                  "grid-cols-[auto_minmax(40%,680px)_1px_auto] " +
                    "grid-rows-[41px_3px_0]"
                }
                widthClassName="w-full"
                heightClassName="h-full"
                borderClassName={
                  "rounded-xs border-[0.5px] border-[rgba(0,0,0,.2)]"
                }
                backgroundStyleClassName="bg-music-playerLCDBGFill"
                style={{
                  gridTemplateAreas: (
                    `"art metadata badge controls"
                    "art track track track"
                    "border border border border"`
                  )
                }}
                isGroup={true}
              >
                <HStack
                  widthClassName="w-11"
                  heightClassName="h-11"
                  foregroundStyleClassName="fill-music-playerMissingArtworkIcon"
                  backgroundStyleClassName="bg-music-playerMissingArtworkBg"
                  borderClassName="rounded-l-xs"
                  style={{
                    gridRowStart: "art",
                    gridColumnStart: "art",
                    gridRowEnd: "art",
                    gridColumnEnd: "art"
                  }}
                >
                  {
                    !viewModel.currentPlayingSong?.artworkURLs && (
                      <Image
                        systemName="corecloud.applemusic"
                        heightClassName="h-5.5"
                        marginClassName="mx-auto"
                      />
                    )
                  }
                  {
                    viewModel.currentPlayingSong?.artworkURLs && (
                      <AsyncImage
                        urls={viewModel.currentPlayingSong.artworkURLs}
                      />
                    )
                  }
                </HStack>

                <HStack>
                  <VStack widthClassName="w-full">
                    {
                      !viewModel.currentPlayingSong && (
                        <AsyncImage
                          urls={
                            process.env.NEXT_PUBLIC_MUSIC_ICON_URLS?.split(",")
                          }
                          widthClassName="w-6"
                          heightClassName="h-6"
                        />
                      )
                    }
                    {
                      viewModel.currentPlayingSong && (
                        <>
                          <Text
                            verbatimContent={viewModel.currentPlayingSong.title}
                            fontSizeClassName="text-xs"
                            fontWeightClassName="font-semibold"
                            lineHeightClassName="leading-3.75"
                            alignmentClassName="text-center"
                            foregroundStyleClassName={
                              "text-music-lcd-primary-text-color"
                            }
                          />
                          <HStack
                            widthClassName={
                              "w-full group-hover:w-[calc(100%-72px)]"
                            }
                          >
                            <Text
                              verbatimContent={
                                viewModel.currentPlayingSong.artist +
                                  " — " +
                                  viewModel.currentPlayingSong.album
                              }
                              fontSizeClassName="text-xs"
                              lineHeightClassName="leading-3.75"
                              alignmentClassName="text-center"
                              foregroundStyleClassName={
                                "text-music-lcd-secondary-text-color"
                              }
                            />
                          </HStack>
                        </>
                      )
                    }
                  </VStack>
                </HStack>

                <ZStack
                  widthClassName="w-full"
                  heightClassName="h-0.75"
                  borderClassName="rounded-[1.25px]"
                  backgroundStyleClassName="bg-music-playerScrubberTrack"
                  style={{
                    gridRowStart: "track",
                    gridColumnStart: "track",
                    gridRowEnd: "track",
                    gridColumnEnd: "track"
                  }}
                >
                  <HStack
                    heightClassName="h-full"
                    backgroundStyleClassName="bg-music-playerLCDBGFill"
                    positionClassName="absolute left-0"
                    style={{
                      width: "50%"
                    }}
                  >
                    <HStack
                      heightClassName="h-full"
                      widthClassName="w-full"
                      backgroundStyleClassName="bg-music-playerScrubberFill"
                    />
                  </HStack>
                  <HStack
                    widthClassName="w-1.5"
                    heightClassName="h-2"
                    borderClassName="rounded-t-[3px]"
                    positionClassName="absolute bottom-0 -translate-x-1/2"
                    backgroundStyleClassName="bg-music-playerLCDBGFill"
                    style={{
                      left: "50%"
                    }}
                    visibilityClassName="not-group-hover:hidden"
                  >
                    <HStack
                      widthClassName="w-full"
                      heightClassName="h-full"
                      backgroundStyleClassName="bg-music-playerScrubberFill"
                      borderClassName={
                        "rounded-t-[3px] border-x border-t " +
                          "border-music-playerLCDBGFill"
                      }
                    />
                  </HStack>

                  <HStack
                    paddingClassName="px-1.5"
                    widthClassName="w-full"
                    positionClassName="absolute bottom-0.75 left-0"
                    opacityClassName="opacity-0 group-hover:opacity-100"
                    transitionClassName={
                      "transition-opacity duration-100 ease-[ease-in]"
                    }
                  >
                    <Text
                      verbatimContent={
                        new Date(viewModel.elapsed * 1000)
                          .toISOString()
                          .substring(14, 19)
                      }
                      fontSizeClassName="text-[10px]"
                      lineHeightClassName="leading-3.25"
                      foregroundStyleClassName="text-music-systemTertiary"
                    />
                    <Text
                      verbatimContent={
                        "-" + new Date(
                          (viewModel.totalRef.current-viewModel.elapsed) * 1000
                        )
                          .toISOString()
                          .substring(14, 19)
                      }
                      alignmentClassName="text-right"
                      fontSizeClassName="text-[10px]"
                      lineHeightClassName="leading-3.25"
                      foregroundStyleClassName="text-music-systemTertiary"
                    />
                  </HStack>
                </ZStack>
              </Grid>
            </HStack>
            <p>{/*TODO: Volume Control & Play Next Queue*/}</p>
          </Grid>
        </ZStack>
      </HStack>

      {/* Player < md */}
      <HStack
        heightClassName="h-14"
        borderClassName="rounded-[14px]"
        positionClassName="absolute bottom-0 left-0 right-0"
        shadowClassName="shadow-[0_0_8px_rgba(0,0,0,.2)]"
        marginClassName="mb-1.25 mx-3"
        paddingClassName="pl-2 pr-3.75"
        backgroundStyleClassName={
          "backdrop-saturate-60 backdrop-blur-[20px] " +
            "bg-music-miniPlayerBackground"
        }
        visibilityClassName="md:hidden"
      >
        <HStack
          widthClassName="w-10 min-w-10"
          heightClassName="h-10"
          foregroundStyleClassName="fill-music-playerMissingArtworkIcon"
          backgroundStyleClassName="bg-music-playerMissingArtworkBg"
          borderClassName="rounded-md border border-[rgba(128,128,128,.1)]"
          marginClassName="mr-4"
        >
          {
            !viewModel.currentPlayingSong?.artworkURLs && (
              <Image
                systemName="corecloud.applemusic"
                heightClassName="h-4.5"
                marginClassName="mx-auto"
              />
            )
          }
          {
            viewModel.currentPlayingSong?.artworkURLs && (
              <AsyncImage
                urls={viewModel.currentPlayingSong.artworkURLs}
              />
            )
          }
        </HStack>

        <Text
          verbatimContent={viewModel.currentPlayingSong?.title}
          textKey={!viewModel.currentPlayingSong ? "Not Playing" : undefined}
          fontSizeClassName="text-[15px]"
          fontWeightClassName="font-medium"
          lineHeightClassName="leading-5"
          foregroundStyleClassName="text-music-lcd-primary-text-color"
        />

        <HStack>
          <button
            className={`${PLAYER_INNER_BUTTON_STYLE} cursor-pointer mr-2.25`}
            onClick={() => viewModel.playPauseButtonDidClick()}
          >
            <Image
              systemName={viewModel.isPlaying ? "pause.fill" : "play.fill"}
              heightClassName="h-4.5"
            />
          </button>
          <button
            className={
              `${PLAYER_INNER_BUTTON_STYLE} ` + (
                viewModel.isBackwardForwardButtonDisabled
                  ? "opacity-40 pointer-events-none"
                  : "cursor-pointer"
              )
            }
            disabled={viewModel.isBackwardForwardButtonDisabled}
          >
            <Image
              systemName="forward.fill"
              heightClassName="h-3"
            />
          </button>
        </HStack>
      </HStack>
    </VStack>
  )
}
