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
  }, [])

  return (
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
                "rgba(0, 0, 0, 0) 36%), radial-gradient(1511px at " +
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
            action={() => {}}
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
          widthClassName="w-102.5"
          positionClassName="absolute left-10 bottom-18.75"
        >
          <HStack widthClassName="w-full">
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
                />
              )
            }
          </HStack>
        </VStack>
      </ZStack>

      <Text
        verbatimContent={tvShow.starring}
      />
      <Text
        verbatimContent={tvShow.startYear?.toString()}
      />
      <Text
        verbatimContent={tvShow.endYear?.toString()}
      />
      <Text
        verbatimContent={tvShow.region}
      />
      <Text
        verbatimContent={tvShow.description}
      />
      <Text
        verbatimContent={tvShow.studio}
      />
      <Text
        textKey={tvShow.genre}
      />
    </VStack>
  )
}
