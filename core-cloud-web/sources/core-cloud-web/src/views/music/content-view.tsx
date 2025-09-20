//
//  content-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/24.
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

import useContentView from "@/view-models/music/content-view"
import NavigationSplitView from "ui/navigation-split-view"
import SharedToolbar from "../shared-toolbar"
import SharedBodyguard from "../shared-bodyguard"
import SharedFooter from "../shared-footer"
import SharedSidebar from "../shared-sidebar"
import VStack from "ui/v-stack"
import DetailView from "./detail-view"
import HStack from "ui/h-stack"
import Image from "ui/image"
import Text from "ui/text"
import SongSheet from "./song-sheet"
import AlbumSheet from "./album-sheet"

export default function ContentView() {
  const viewModel = useContentView()

  return (
    <VStack heightClassName="h-dvh">
      <SharedToolbar
        source="music"
        variant={viewModel.isCheckpointPassed.value ? "app" : "thinMaterial"}
      />

      {
        viewModel.isCheckpointPassed.value && (
          <NavigationSplitView
            sidebar={({
              selectedItemKey,
              onChange
            }) => (
              <>
                <SharedSidebar
                  sections={viewModel.sectionsRef.current}
                  selectedItemKey={selectedItemKey}
                  itemForegroundStyleClassName="fill-music-keyColor"
                  itemBackgroundStyleClassName="active:bg-music-keyColor"
                  onSelectedItemKeyChange={(newSelectedItemKey) => {
                    onChange(newSelectedItemKey)
                  }}
                />
                <HStack
                  marginClassName="mt-auto"
                  paddingClassName="pb-2.5"
                >
                  <button
                    className={
                      "cursor-pointer rounded-lg text-music-keyColor px-2.5 " +
                        "flex items-center h-7.5 hover:bg-fillTertiary " +
                        "active:bg-music-keyColor/16 " +
                        "active:text-music-keyColor/30"
                    }
                    onClick={() => {
                      if (viewModel.selectedSidebarItemKey === "albums") {
                        viewModel.newAlbumButtonDidClick()
                      } else {
                        viewModel.newSongButtonDidClick()
                      }
                    }}
                  >
                    <HStack
                      widthClassName="w-4.75"
                      marginClassName="mr-1"
                      foregroundStyleClassName="fill-current"
                    >
                      <Image
                        systemName="plus.circle"
                        widthClassName="w-full"
                      />
                    </HStack>
                    <Text
                      textKey={
                        viewModel.selectedSidebarItemKey === "albums"
                          ? "New Album"
                          : "New Song"
                      }
                      fontSizeClassName="text-[15px]"
                      fontWeightClassName="font-semibold"
                      lineHeightClassName="leading-4.5"
                    />
                  </button>
                </HStack>
              </>
            )}
            detail={() => (
              <DetailView
                albums={viewModel.albums}
                setAlbums={viewModel.setAlbums}
                songs={viewModel.songs}
                setSongs={viewModel.setSongs}
                selectedSidebarItemKey={viewModel.selectedSidebarItemKey}
              />
            )}
            selectedSidebarItemKey={viewModel.selectedSidebarItemKey}
            onSelectedSidebarItemKeyChange={(newSelectedSidebarItemKey) => {
              viewModel.selectedSidebarItemKeyDidChange(
                newSelectedSidebarItemKey
              )
            }}
            toggleForegroundStyleClassName={
              "fill-music-keyColor active:fill-music-keyColor/30"
            }
            toggleBackgroundStyleClassName={
              "hover:bg-fillTertiary active:bg-music-keyColor/16"
            }
          />
        )
      }

      {
        !viewModel.isCheckpointPassed.value && (
          <>
            <SharedBodyguard
              isPassed={viewModel.isCheckpointPassed}
              secureFieldTintClassName={
                "focus:border-music-keyColor caret-music-keyColor"
              }
            />
            <SharedFooter />
          </>
        )
      }

      {
        viewModel.isNewAlbumSheetPresented.value && (
          <AlbumSheet
            isPresented={viewModel.isNewAlbumSheetPresented}
            onCreate={() => viewModel.newAlbumDidCreate()}
          />
        )
      }
      {
        viewModel.isNewSongSheetPresented.value && (
          <SongSheet
            isPresented={viewModel.isNewSongSheetPresented}
            onCreate={() => viewModel.newSongDidCreate()}
            mode="creation"
          />
        )
      }
    </VStack>
  )
}
