//
//  tv-show-detail-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/10/25.
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

import useTVShowDetailView from "@/view-models/tv/tv-show-detail-view"
import { useEffect } from "react"
import AsyncImage from "ui/async-image"
import Button from "ui/button"
import ContentMode from "ui/content-mode"
import HStack from "ui/h-stack"
import Image from "ui/image"
import Spacer from "ui/spacer"
import Text from "ui/text"
import VStack from "ui/v-stack"
import ZStack from "ui/z-stack"
import EpisodeSheet from "./episode-sheet"
import NewLocalizer from "ui/localizer"
import Sheet from "ui/sheet"
import VerticalAlignment from "ui/vertical-alignment"

export default function TVShowDetailView({
  tvShow,
  setTVShow
}: {
  tvShow: {
    id: number,
    posterURLs: string,
    artworkURLs?: string,
    titleLogoURLs?: string,
    title?: string,
    starring?: string,
    startYear?: number,
    endYear?: number,
    region?: string,
    description?: string,
    studio?: string,
    genre?: string
  },
  setTVShow: React.Dispatch<React.SetStateAction<{
    id: number,
    posterURLs: string,
    artworkURLs?: string,
    titleLogoURLs?: string,
    title?: string,
    starring?: string,
    startYear?: number,
    endYear?: number,
    region?: string,
    description?: string,
    studio?: string,
    genre?: string
  } | undefined>>
}) {
  const viewModel = useTVShowDetailView({
    tvShow: tvShow,
    setTVShow: setTVShow
  })

  useEffect(() => {
    viewModel.viewDidAppear1()
    viewModel.viewDidAppear2()
  }, [])

  return (
    <>
      <VStack
        widthClassName="w-full"
        heightClassName="h-full"
        overflowClassName="overflow-y-auto"
      >
        <ZStack widthClassName="w-full">
          <AsyncImage
            widthClassName="w-full"
            heightClassName="h-full"
            contentMode={ContentMode.fit}
            urls={tvShow.artworkURLs?.split(",")}
          />

          <HStack
            positionClassName="absolute inset-0"
            style={{
              background: (
                "linear-gradient(80deg, rgba(0, 0, 0, 0.14), " +
                  "rgba(0, 0, 0, 0) 41%), linear-gradient(0deg, " +
                  "rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.36) 5%, " +
                  "rgba(0, 0, 0, 0.27) 9%, rgba(0, 0, 0, 0.18) 16%, " +
                  "rgba(0, 0, 0, 0.09) 22%, rgba(0, 0, 0, 0.02) 29%, " +
                  "rgba(0, 0, 0, 0) 36%), radial-gradient(circle 100vmax at " +
                  "66.699997% 0%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.04) " +
                  "19%, rgba(0, 0, 0, 0.15) 36%, rgba(0, 0, 0, 0.3) 51%, " +
                  "rgba(0, 0, 0, 0.33) 53%, rgba(0, 0, 0, 0.49) 65%, " +
                  "rgba(0, 0, 0, 0.67) 77%, rgba(0, 0, 0, 0.85) 89%, " +
                  "rgb(0, 0, 0) 100%)"
              )
            }}
          />

          <HStack positionClassName="absolute left-0 right-0 top-3">
            {/* Back Button */}
            <Button
              marginClassName="ml-12"
              action={() => viewModel.backButtonDidClick()}
            >
              <Image
                systemName="chevron.left.circle.fill"
                widthClassName="w-4.75"
                heightClassName="h-4.75"
                foregroundStyleClassName="fill-white"
              />
            </Button>

            <Spacer />

            {/* New Episode Button */}
            <Button
              marginClassName="mr-12"
              action={() => viewModel.newEpisodeButtonDidClick()}
            >
              <Image
                systemName="plus.circle"
                widthClassName="w-4.75"
                heightClassName="h-4.75"
                foregroundStyleClassName="fill-white"
              />
            </Button>
          </HStack>

          <VStack
            widthClassName="md:w-102.5"
            positionClassName={
              "absolute md:left-10 md:bottom-18.75 left-3 not-md:right-3 " +
                "bottom-3"
            }
          >
            <HStack widthClassName="w-full">
              <Spacer visibilityClassName="md:hidden" />
              {
                tvShow.titleLogoURLs && (
                  <AsyncImage
                    widthClassName="w-54"
                    heightClassName="h-full"
                    contentMode={ContentMode.fit}
                    urls={tvShow.titleLogoURLs.split(",")}
                  />
                )
              }
              {
                !tvShow.titleLogoURLs && (
                  <Text
                    verbatimContent={tvShow.title}
                    fontSizeClassName="text-[26px]"
                    foregroundStyleClassName="text-labelPrimaryOnDark"
                    fontWeightClassName="font-bold"
                    lineHeightClassName="leading-8"
                  />
                )
              }
              <Spacer visibilityClassName="md:hidden" />
            </HStack>

            <Text
              verbatimContent={
                NewLocalizer.default.localize("TV Show") +
                  " · " +
                  NewLocalizer.default.localize(tvShow.genre ?? "")
              }
              foregroundStyleClassName="text-labelPrimaryOnDark"
              fontSizeClassName="text-[15px]"
              fontWeightClassName="font-semibold"
              lineHeightClassName="leading-4.5"
              multilineTextAlignmentClassName="md:text-left text-center"
              marginClassName="my-2.25"
            />

            <ZStack widthClassName="w-full">
              <Text
                verbatimContent={tvShow.description}
                foregroundStyleClassName="line-clamp-2 text-white/71"
                fontSizeClassName="text-[15px]"
                lineHeightClassName="leading-5"
                style={{
                  mask: (
                    "linear-gradient(0deg,transparent 0,transparent 16px," +
                      "#000 16px),linear-gradient(270deg,transparent 0," +
                      "transparent 32px,#000 64px)"
                  )
                }}
              />
              <Button
                positionClassName="absolute right-0 bottom-0.25"
                paddingClassName="pl-1.25"
                action={() => viewModel.showEpisodeDescriptionButtonDidClick()}
              >
                <Text
                  textKey="MORE"
                  fontSizeClassName="text-[11px]"
                  foregroundStyleClassName="text-[#007aff]"
                  lineHeightClassName="leading-3.5"
                  fontWeightClassName="font-semibold"
                />
              </Button>
            </ZStack>

            <HStack
              widthClassName="w-full"
              marginClassName="mt-2.25"
            >
              <HStack marginClassName="mr-1.5">
                <Text
                  verbatimContent={`${tvShow.startYear} — ${tvShow.endYear}`}
                  foregroundStyleClassName="text-labelSecondaryOnDark"
                  fontSizeClassName="text-[13px]"
                  fontWeightClassName="font-semibold"
                  lineHeightClassName="leading-4"
                />
              </HStack>

              <HStack widthClassName="w-5.75">
                {
                  viewModel.episodes[0]?.height === 1080 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="15"
                      viewBox="0 0 26 15"
                    >
                      <path
                        fill="#ebebf5"
                        fill-rule="evenodd"
                        d={
                          "M2.737 0h20.528A2.73 2.73 0 0 1 26 " +
                            "2.727v9.545A2.73 2.73 0 0 1 23.265 " +
                            "15H2.737A2.73 2.73 0 0 1 0 12.272V2.727A2.73 " +
                            "2.73 0 0 1 2.737 0M12.5 " +
                            "11.778V3.326h-1.772v3.433H6.921V3.326H5.152" +
                            "v8.452h1.769V8.217h3.807v3.561zm1.409-8.452" +
                            "v8.452h3.257c2.536 0 4.03-1.576 " +
                            "4.03-4.258S19.7 3.326 17.163 " +
                            "3.326h-3.257zm1.769 1.458h1.277c1.558 0 " +
                            "2.437.972 2.437 2.741 0 1.827-.855 2.788-2.437 " +
                            "2.788h-1.28V4.785z"
                        }
                      />
                    </svg>
                  )
                }
                {
                  viewModel.episodes[0]?.height === 2160 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="15"
                      viewBox="0 0 26 15"
                    >
                      <path
                        fill="#ebebf5"
                        fill-rule="evenodd"
                        d={
                          "M2.737 0h20.528A2.73 2.73 0 0 1 26 " +
                            "2.727v9.545A2.73 2.73 0 0 1 " +
                            "23.265 15H2.737A2.73 2.73 0 0 1 0 " +
                            "12.272V2.727A2.73 2.73 0 0 1 2.737 0m7.078 " +
                            "11.6H11.5v-1.5h1.1V8.681h-1.1v-5.53H9a56 56 " +
                            "0 0 0-3.39 5.442V10.1h4.205zM7.162 8.686A40 " +
                            "40 0 0 1 9.815 4.4h.035v4.333H7.162zm8.273 " +
                            "2.914V9.02l.791-.949 2.507 3.529h2.114L17.5 " +
                            "6.9l3.13-3.749h-1.968l-3.174 " +
                            "3.854h-.053V3.151h-1.769V11.6z"
                        }
                      />
                    </svg>
                  )
                }
              </HStack>
            </HStack>
          </VStack>

          <VStack
            widthClassName="max-w-75"
            positionClassName="absolute right-10 bottom-18.75"
            visibilityClassName="not-md:hidden"
          >
            <HStack alignment={VerticalAlignment.top}>
              <HStack marginClassName="mr-1">
                <Text
                  textKey="Starring"
                  fontSizeClassName="text-[13px]"
                  foregroundStyleClassName="text-labelSecondaryOnDark"
                  lineHeightClassName="leading-4.5"
                  wrapClassName="whitespace-nowrap"
                />
              </HStack>
              <HStack>
                <Text
                  verbatimContent={tvShow.starring?.split(",").join(", ")}
                  fontSizeClassName="text-[13px]"
                  foregroundStyleClassName="text-labelPrimaryOnDark"
                  lineHeightClassName="leading-4.5"
                />
              </HStack>
            </HStack>
          </VStack>
        </ZStack>

        {
          viewModel.episodes.map(episode => (
            <VStack key={episode.id}>
              <AsyncImage
                urls={episode.artworkURLs.split(",")}
              />
              <Text verbatimContent={episode.title} />
              <Text verbatimContent={episode.description} />
              <Text
                verbatimContent={new Date(episode.date).toLocaleDateString()}
              />
              <Text verbatimContent={episode.duration.toString()} />
              <Text verbatimContent={"E" + episode.episodeNumber.toString()} />
              <Text verbatimContent={"S" + episode.seasonNumber.toString()} />
              <a
                href={`/api/file?id=${episode.fileID}&application=TV`}
                target="_blank"
              >
                {"Play"}
              </a>
            </VStack>
          ))
        }

        {/* About */}
        <VStack
          widthClassName="w-full"
          paddingClassName="pt-11 px-6.25 md:px-10"
          backgroundStyleClassName="bg-tv-opaqueShelfBG"
        >
          <Text
            textKey="About"
            fontSizeClassName="text-base"
            fontWeightClassName="font-bold"
            foregroundStyleClassName="text-labelPrimary"
            lineHeightClassName="leading-5"
            marginClassName="mb-3"
          />

          <HStack widthClassName="w-full">
            <VStack
              widthClassName="w-full md:w-1/3"
              borderClassName="rounded-xl"
              paddingClassName="p-4"
              backgroundStyleClassName="bg-tv-cardBackgroundColor"
            >
              <Text
                verbatimContent={tvShow.title}
                fontSizeClassName="text-base"
                fontWeightClassName="font-bold"
                foregroundStyleClassName="text-labelPrimary"
                lineHeightClassName="leading-5"
                marginClassName="mb-1"
              />
              <Text
                textKey={tvShow.genre}
                fontSizeClassName="text-[11px]"
                foregroundStyleClassName="text-labelSecondary"
                lineHeightClassName="leading-3.25"
                marginClassName="mb-1"
              />
            </VStack>
          </HStack>

          <Text
            verbatimContent={tvShow.region}
          />
          <Text
            verbatimContent={tvShow.studio}
          />
        </VStack>

      </VStack>

      {
        viewModel.isNewEpisodeSheetPresented.value && (
          <EpisodeSheet
            isPresented={viewModel.isNewEpisodeSheetPresented}
            mode="creation"
            onCreate={() => viewModel.newEpisodeDidCreate()}
            tvShowID={tvShow.id}
          />
        )
      }

      {
        viewModel.isEpisodeDescriptionSheetPresented.value && (
          <Sheet
            isPresented={viewModel.isEpisodeDescriptionSheetPresented}
            closeButtonActiveBackgroundStyleClassName="active:bg-systemBlue/16"
          >
            <Text
              verbatimContent={tvShow.description}
              paddingClassName="px-2.5 md:px-5 pb-10"
              foregroundStyleClassName="text-labelPrimary"
              fontSizeClassName="text-[15px]"
              lineHeightClassName="leading-5.5"
            />
          </Sheet>
        )
      }
    </>
  )
}
