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
            <VStack
              heightClassName="h-full"
              overflowClassName="overflow-y-auto"
            >
              {
                homeVideos.map(homeVideo => (
                  <VStack
                    key={homeVideo.id}
                  >
                    <AsyncImage
                      urls={homeVideo.artworkURLs.split(",")}
                    />
                    <Text
                      verbatimContent={homeVideo.title}
                    />
                    <button
                      onClick={() => {
                        setTempURL(
                          `${process.env.NEXT_PUBLIC_API_HOST}/api/file` +
                            `?id=${homeVideo.fileID}` +
                            "&application=TV"
                        )
                      }}
                    >
                      {"Play"}
                    </button>
                  </VStack>
                ))
              }
            </VStack>
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
