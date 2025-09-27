//
//  song-list-content.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/9/21.
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
import Button from "ui/button"
import Grid from "ui/grid"
import GridRow from "ui/grid-row"
import HStack from "ui/h-stack"
import Image from "ui/image"
import Spacer from "ui/spacer"
import Text from "ui/text"

export default function SongListContent({
  isMobile,
  songs,
  listItemOnClick,
  listItemOnDoubleClick,
  moreOptionsButtonOnClick,
  selectedSongID,
  currentPlayingSong,
  isPlaying
}: {
  isMobile: boolean,
  songs: {
    id: number,
    title: string,
    artist: string,
    albumName?: string,
    artworkURLs?: string,
    duration: number,
    fileID: number
  }[],
  listItemOnClick: (id: number) => void,
  listItemOnDoubleClick: (clickedItem: {
    id: number,
    artworkURLs: string[],
    fileID: number,
    title: string,
    artist: string,
    album: string
  }) => void,
  moreOptionsButtonOnClick: (
    clickPosition: { x: number, y: number },
    isMobile: boolean
  ) => void,
  selectedSongID: number | undefined,
  currentPlayingSong: {
    id: number,
    artworkURLs: string[],
    fileID: number,
    title: string,
    artist: string,
    album: string
  } | undefined,
  isPlaying: boolean
}) {
  return (
    <Grid
      widthClassName="w-full"
      paddingClassName={isMobile ? "pb-16" : ""}
      gridTemplateClassName={
        isMobile
          ? "grid-cols-[40px_1fr_80px]"
          : "grid-cols-[40px_1fr_1fr_1fr_80px]"
      }
      overflowClassName="overflow-y-auto"
      visibilityClassName={
        isMobile
          ? "md:hidden"
          : "not-md:hidden"
      }
    >
      {
        songs.length > 0 && songs.map((song, index) => (
          <GridRow
            key={song.id}
            onClick={() => listItemOnClick(song.id)}
            onDoubleClick={() => {
              listItemOnDoubleClick({
                id: song.id,
                artworkURLs: song.artworkURLs?.split(",") ?? [],
                album: song.albumName ?? "",
                artist: song.artist,
                title: song.title,
                fileID: song.fileID
              })
            }}
          >
            {/* Is Playing Indicator */}
            <HStack
              heightClassName="h-11"
              backgroundStyleClassName={
                song.id === selectedSongID
                  ? "bg-music-selectionColor"
                  : index % 2 === 0 ? "bg-music-trackBackgroundEven" : ""
              }
              foregroundStyleClassName={
                song.id === selectedSongID
                  ? "fill-white"
                  : "fill-systemBlue"
              }
            >
              {
                currentPlayingSong?.id === song.id && (
                  <Image
                    systemName={
                      isPlaying
                        ? "speaker.wave.2.fill"
                        : "speaker.fill"
                    }
                    heightClassName="h-3"
                    marginClassName="mx-auto"
                  />
                )
              }
            </HStack>

            <HStack
              heightClassName="h-11"
              overflowClassName="overflow-hidden"
              backgroundStyleClassName={
                song.id === selectedSongID
                  ? "bg-music-selectionColor"
                  : index % 2 === 0 ? "bg-music-trackBackgroundEven" : ""
              }
            >
              <AsyncImage
                widthClassName="w-9 min-w-9"
                heightClassName="h-9 min-h-9"
                urls={song.artworkURLs?.split(",")}
                marginClassName="mr-2.5"
              />
              <Text
                verbatimContent={song.title}
                fontSizeClassName="text-[13px]"
                lineHeightClassName="leading-4"
                foregroundStyleClassName={
                  song.id === selectedSongID
                    ? "text-white"
                    : "text-music-systemPrimary"
                }
                marginClassName="mr-2.25"
                multilineTextAlignmentClassName="text-left"
                truncationClassName="truncate"
              />
              <Spacer />
              <Button
                action={(clickPosition) => {
                  if (!clickPosition) {
                    return
                  }
                  moreOptionsButtonOnClick(clickPosition, isMobile)
                }}
              >
                <HStack
                  widthClassName="w-7"
                  heightClassName="h-7"
                  foregroundStyleClassName={
                    song.id === selectedSongID
                      ? "fill-white"
                      : "fill-music-keyColor"
                  }
                >
                  <Image
                    systemName="ellipsis"
                    widthClassName="w-3.75"
                  />
                </HStack>
              </Button>
            </HStack>
            {
              (isMobile ? [] : [song.artist, song.albumName]).map(detail => (
                <HStack
                  key={detail}
                  overflowClassName="overflow-hidden"
                  heightClassName="h-11"
                  backgroundStyleClassName={
                    song.id === selectedSongID
                      ? "bg-music-selectionColor"
                      : index % 2 === 0 ? "bg-music-trackBackgroundEven" : ""
                  }
                >
                  <Text
                    verbatimContent={detail}
                    fontSizeClassName="text-[13px]"
                    lineHeightClassName="leading-4"
                    foregroundStyleClassName={
                      song.id === selectedSongID
                        ? "text-white"
                        : "text-music-systemPrimary"
                    }
                    marginClassName="mx-2.25"
                    multilineTextAlignmentClassName="text-left"
                    truncationClassName="truncate"
                  />
                </HStack>
              ))
            }
            <HStack
              overflowClassName="overflow-hidden"
              heightClassName="h-11"
              backgroundStyleClassName={
                song.id === selectedSongID
                  ? "bg-music-selectionColor"
                  : index % 2 === 0 ? "bg-music-trackBackgroundEven" : ""
              }
            >
              <Text
                verbatimContent={
                  new Date(song.duration * 1000)
                    .toISOString()
                    .substring(14, 19)
                }
                fontSizeClassName="text-[13px]"
                lineHeightClassName="leading-4"
                foregroundStyleClassName={
                  song.id === selectedSongID
                    ? "text-white"
                    : "text-music-systemPrimary"
                }
                marginClassName="mr-2.25"
                multilineTextAlignmentClassName="text-left"
                truncationClassName="truncate"
              />
            </HStack>
          </GridRow>
        ))
      }
    </Grid>
  )
}
