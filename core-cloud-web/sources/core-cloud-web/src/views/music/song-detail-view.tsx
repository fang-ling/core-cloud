//
//  song-detail-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/31.
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

import useSongDetailView from "@/view-models/music/song-detail-view"
import { Fragment, useEffect } from "react"
import AsyncImage from "ui/async-image"
import Grid from "ui/grid"
import GridRow from "ui/grid-row"
import HStack from "ui/h-stack"
import Image from "ui/image"
import Spacer from "ui/spacer"
import Text from "ui/text"
import VStack from "ui/v-stack"
import Button from "ui/button"
import ContextMenu from "./context-menu"
import SongSheet from "./song-sheet"

export default function SongDetailView({
  songs,
  setSongs,
  currentPlayingSong,
  setCurrentPlayingSong,
  isPlaying
}: {
  songs: {
    id: number,
    title: string,
    artist: string,
    albumName?: string,
    artworkURLs?: string,
    duration: number,
    fileID: number
  }[],
  setSongs: React.Dispatch<React.SetStateAction<{
    id: number,
    title: string,
    artist: string,
    albumName?: string,
    artworkURLs?: string,
    duration: number,
    fileID: number
  }[]>>,
  currentPlayingSong: {
    id: number,
    artworkURLs: string[],
    fileID: number,
    title: string,
    artist: string,
    album: string
  } | undefined,
  setCurrentPlayingSong: React.Dispatch<React.SetStateAction<{
    id: number,
    artworkURLs: string[],
    fileID: number,
    title: string,
    artist: string,
    album: string
  } | undefined>>,
  isPlaying: boolean
}) {
  const viewModel = useSongDetailView({
    setSongs: setSongs,
    setCurrentPlayingSong: setCurrentPlayingSong
  })

  useEffect(() => {
    viewModel.viewDidAppear()
  }, [])

  return (
    <>
      <VStack
        widthClassName="w-full"
        heightClassName="h-full"
        overflowClassName="overflow-hidden"
      >
        <HStack marginClassName="mt-2.5">
          <Text
            textKey="Songs"
            fontSizeClassName="text-[15px]"
            fontWeightClassName="font-semibold"
            lineHeightClassName="leading-5"
            foregroundStyleClassName="text-music-systemPrimary"
            multilineTextAlignmentClassName="text-center"
          />
        </HStack>

        {/* Table header, >= md */}
        <Grid
          widthClassName="w-full"
          paddingClassName="pl-10"
          gridTemplateClassName="grid-cols-[1fr_auto_1fr_auto_1fr_auto_80px]"
          borderClassName="border-b border-music-labelDivider"
          marginClassName="mt-3"
          visibilityClassName="not-md:hidden"
        >
          {
            ["Name", "Artist", "Album", "Duration"].map(key => (
              <Fragment key={key}>
                <HStack paddingClassName="py-1.5 px-2.25">
                  <Text
                    textKey={key}
                    fontSizeClassName="text-[11px]"
                    fontWeightClassName="font-semibold"
                    lineHeightClassName="leading-3.5"
                    foregroundStyleClassName="text-music-systemPrimary"
                    multilineTextAlignmentClassName="text-left"
                  />
                </HStack>
                {
                  key !== "Duration" && (
                    <HStack
                      widthClassName="w-0.25"
                      heightClassName="h-4.75"
                      backgroundStyleClassName="bg-music-labelDivider"
                    />
                  )
                }
              </Fragment>
            ))
          }
        </Grid>

        {/* Table content, >= md */}
        <Grid
          widthClassName="w-full"
          gridTemplateClassName="grid-cols-[40px_1fr_1fr_1fr_80px]"
          overflowClassName="overflow-y-auto"
          visibilityClassName="not-md:hidden"
        >
          {
            songs.length > 0 && songs.map((song, index) => (
              <GridRow
                key={song.id}
                onClick={() => viewModel.songListItemDidClick(song.id)}
                onDoubleClick={() => {
                  viewModel.songListItemDidDoubleClick({
                    id: song.id,
                    artworkURLs: song.artworkURLs?.split(",") ?? [],
                    album: song.albumName ?? "",
                    artist: song.artist,
                    title: song.title,
                    fileID: song.fileID
                  })
                }}
              >
                <HStack
                  heightClassName="h-11"
                  backgroundStyleClassName={
                    song.id === viewModel.selectedSongID
                      ? "bg-music-selectionColor"
                      : index % 2 === 0 ? "bg-music-trackBackgroundEven" : ""
                  }
                  foregroundStyleClassName={
                    song.id === viewModel.selectedSongID
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
                    song.id === viewModel.selectedSongID
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
                      song.id === viewModel.selectedSongID
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
                      viewModel.moreOptionsButtonDidClick(clickPosition, false)
                    }}
                  >
                    <HStack
                      widthClassName="w-7"
                      heightClassName="h-7"
                      foregroundStyleClassName={
                        song.id === viewModel.selectedSongID
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
                  [song.artist, song.albumName].map(detail => (
                    <HStack
                      key={detail}
                      overflowClassName="overflow-hidden"
                      heightClassName="h-11"
                      backgroundStyleClassName={
                        song.id === viewModel.selectedSongID
                          ? "bg-music-selectionColor"
                          : index % 2 === 0
                            ? "bg-music-trackBackgroundEven"
                            : ""
                      }
                    >
                      <Text
                        verbatimContent={detail}
                        fontSizeClassName="text-[13px]"
                        lineHeightClassName="leading-4"
                        foregroundStyleClassName={
                          song.id === viewModel.selectedSongID
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
                    song.id === viewModel.selectedSongID
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
                      song.id === viewModel.selectedSongID
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

        {/* Table header, < md */}
        <Grid
          widthClassName="w-full"
          paddingClassName="pl-10"
          gridTemplateClassName="grid-cols-[1fr_auto_80px]"
          borderClassName="border-b border-music-labelDivider"
          marginClassName="mt-3"
          visibilityClassName="md:hidden"
        >
          {
            ["Name", "Duration"].map(key => (
              <Fragment key={key}>
                <HStack paddingClassName="py-1.5 px-2.25">
                  <Text
                    textKey={key}
                    fontSizeClassName="text-[11px]"
                    fontWeightClassName="font-semibold"
                    lineHeightClassName="leading-3.5"
                    foregroundStyleClassName="text-music-systemPrimary"
                    multilineTextAlignmentClassName="text-left"
                  />
                </HStack>
                {
                  key !== "Duration" && (
                    <HStack
                      widthClassName="w-0.25"
                      heightClassName="h-4.75"
                      backgroundStyleClassName="bg-music-labelDivider"
                    />
                  )
                }
              </Fragment>
            ))
          }
        </Grid>

        {/* Table content, < md */}
        <Grid
          widthClassName="w-full"
          paddingClassName="pb-16"
          gridTemplateClassName="grid-cols-[40px_1fr_80px]"
          overflowClassName="overflow-y-auto"
          visibilityClassName="md:hidden"
        >
          {
            songs.length > 0 && songs.map((song, index) => (
              <GridRow
                key={song.id}
                onClick={() => viewModel.songListItemDidClick(song.id)}
                onDoubleClick={() => {
                  viewModel.songListItemDidDoubleClick({
                    id: song.id,
                    artworkURLs: song.artworkURLs?.split(",") ?? [],
                    album: song.albumName ?? "",
                    artist: song.artist,
                    title: song.title,
                    fileID: song.fileID
                  })
                }}
              >
                <HStack
                  heightClassName="h-11"
                  backgroundStyleClassName={
                    song.id === viewModel.selectedSongID
                      ? "bg-music-selectionColor"
                      : index % 2 === 0 ? "bg-music-trackBackgroundEven" : ""
                  }
                  foregroundStyleClassName={
                    song.id === viewModel.selectedSongID
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
                    song.id === viewModel.selectedSongID
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
                      song.id === viewModel.selectedSongID
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
                      viewModel.moreOptionsButtonDidClick(clickPosition, true)
                    }}
                  >
                    <HStack
                      widthClassName="w-7"
                      heightClassName="h-7"
                      foregroundStyleClassName={
                        song.id === viewModel.selectedSongID
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
                <HStack
                  overflowClassName="overflow-hidden"
                  heightClassName="h-11"
                  backgroundStyleClassName={
                    song.id === viewModel.selectedSongID
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
                      song.id === viewModel.selectedSongID
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
      </VStack>

      {/* Empty */}
      {
        songs.length < 0 && (
          <VStack heightClassName="h-full">
            <Spacer />

            <Image
              systemName="corecloud.applemusic"
              widthClassName="w-11.25"
              heightClassName="h-13.25"
              foregroundStyleClassName="fill-music-systemSecondary"
              marginClassName="mb-10"
            />
            <Text
              textKey="Add Music to Your Library"
              fontSizeClassName="text-[13px]"
              lineHeightClassName="leading-4"
              fontWeightClassName="font-extrabold"
              foregroundStyleClassName="text-music-systemSecondary"
              multilineTextAlignmentClassName="text-center"
            />
            <Text
              textKey={
                "Browse millions of songs and collect your favorites here."
              }
              fontSizeClassName="text-[11px]"
              lineHeightClassName="leading-3.5"
              foregroundStyleClassName="text-music-systemSecondary"
              multilineTextAlignmentClassName="text-center"
            />

            <Spacer />
          </VStack>
        )
      }

      {
        viewModel.isContextMenuPresented.value && (
          <ContextMenu
            isPresented={viewModel.isContextMenuPresented}
            position={viewModel.contextMenuPosition}
            action={() => viewModel.getInfoButtonDidClick()}
          />
        )
      }

      {
        viewModel.isSongSheetPresented.value && (
          <SongSheet
            isPresented={viewModel.isSongSheetPresented}
            mode="modification"
            detail={songs.find(s => s.id === viewModel.selectedSongID)}
          />
        )
      }
    </>
  )
}
