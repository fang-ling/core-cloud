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
import { useEffect } from "react"
import HStack from "ui/h-stack"
import Text from "ui/text"
import VStack from "ui/v-stack"
import ContextMenu from "./context-menu"
import SongSheet from "./song-sheet"
import EmptyDetailView from "./empty-detail-view"
import SongDetailHeader from "./song-detail-header"
import SongDetailContent from "./song-detail-content"

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
      {
        songs.length > 0 && (
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
            <SongDetailHeader isMobile={false} />

            {/* Table content, >= md */}
            <SongDetailContent
              isMobile={false}
              songs={songs}
              listItemOnClick={viewModel.songListItemDidClick}
              listItemOnDoubleClick={viewModel.songListItemDidDoubleClick}
              moreOptionsButtonOnClick={viewModel.moreOptionsButtonDidClick}
              selectedSongID={viewModel.selectedSongID}
              currentPlayingSong={currentPlayingSong}
              isPlaying={isPlaying}
            />

            {/* Table header, < md */}
            <SongDetailHeader isMobile={true} />

            {/* Table content, < md */}
            <SongDetailContent
              isMobile={true}
              songs={songs}
              listItemOnClick={viewModel.songListItemDidClick}
              listItemOnDoubleClick={viewModel.songListItemDidDoubleClick}
              moreOptionsButtonOnClick={viewModel.moreOptionsButtonDidClick}
              selectedSongID={viewModel.selectedSongID}
              currentPlayingSong={currentPlayingSong}
              isPlaying={isPlaying}
            />

          </VStack>
        )
      }


      {/* Empty */}
      {
        songs.length <= 0 && <EmptyDetailView />
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
