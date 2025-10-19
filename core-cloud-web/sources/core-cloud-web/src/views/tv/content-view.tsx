//
//  content-view.tsx
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

import useContentView from "@/view-models/tv/content-view"
import VStack from "ui/v-stack"
import SharedToolbar from "../shared-toolbar"
import SharedBodyguard from "../shared-bodyguard"
import SharedFooter from "../shared-footer"
import NavigationSplitView from "ui/navigation-split-view"
import SharedSidebar from "../shared-sidebar"
import HomeVideoSheet from "./home-video-sheet"
import HStack from "ui/h-stack"
import Button from "ui/button"
import Image from "ui/image"
import Text from "ui/text"
import DetailView from "./detail-view"
import TVShowSheet from "./tv-show-sheet"

export default function ContentView() {
  const viewModel = useContentView()

  return (
    <VStack heightClassName="h-dvh">
      <SharedToolbar
        source="tv"
        variant={viewModel.isCheckpointPassed.value ? "app" : "thinMaterial"}
      />

      {
        viewModel.isCheckpointPassed.value && (
          <NavigationSplitView
            sidebar={({ selectedItemKey, onChange }) => (
              <>
                <SharedSidebar
                  sections={viewModel.sectionsRef.current}
                  selectedItemKey={selectedItemKey}
                  itemForegroundStyleClassName="fill-systemBlue"
                  itemBackgroundStyleClassName="active:bg-systemBlue"
                  onSelectedItemKeyChange={(newSelectedItemKey) => {
                    onChange(newSelectedItemKey)
                  }}
                />
                <HStack
                  marginClassName="mt-auto"
                  paddingClassName="pb-2.5"
                >
                  <Button
                    heightClassName="h-7.5"
                    borderClassName="rounded-lg"
                    foregroundStyleClassName={
                      "text-systemBlue active:text-systemBlue/30"
                    }
                    paddingClassName="px-2.5"
                    backgroundStyleClassName={
                      "hover:bg-fillTertiary active:bg-systemBlue/16"
                    }
                    action={() => {
                      if (viewModel.selectedSidebarItemKey === "home videos") {
                        viewModel.newHomeVideoButtonDidClick()
                      } else {
                        viewModel.newTVShowSheetButtonDidClick()
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
                        viewModel.selectedSidebarItemKey === "home videos"
                          ? "New Home Video"
                          : "New TV Show"
                      }
                      fontSizeClassName="text-[15px]"
                      fontWeightClassName="font-semibold"
                      lineHeightClassName="leading-4.5"
                    />
                  </Button>
                </HStack>
              </>
            )}
            detail={() => (
              <DetailView
                selectedSidebarItemKey={viewModel.selectedSidebarItemKey}
                homeVideos={viewModel.homeVideos}
                setHomeVideos={viewModel.setHomeVideos}
                tvShows={viewModel.tvShows}
                setTVShows={viewModel.setTVShows}
              />
            )}
            selectedSidebarItemKey={viewModel.selectedSidebarItemKey}
            onSelectedSidebarItemKeyChange={(newSelectedSidebarItemKey) => {
              viewModel.selectedSidebarItemKeyDidChange(
                newSelectedSidebarItemKey
              )
            }}
            toggleForegroundStyleClassName={
              "fill-systemBlue active:fill-systemBlue/30"
            }
            toggleBackgroundStyleClassName={
              "hover:bg-fillTertiary active:bg-systemBlue/16"
            }
          >
          </NavigationSplitView>
        )
      }

      {
        !viewModel.isCheckpointPassed.value && (
          <>
            <SharedBodyguard
              isPassed={viewModel.isCheckpointPassed}
              secureFieldTintClassName={
                "focus:border-systemBlue caret-systemBlue"
              }
            />
            <SharedFooter />
          </>
        )
      }

      {
        viewModel.isNewHomeVideoSheetPresented.value && (
          <HomeVideoSheet
            isPresented={viewModel.isNewHomeVideoSheetPresented}
            onCreate={() => viewModel.newHomeVideoDidCreate()}
            mode="creation"
          />
        )
      }
      {
        viewModel.isNewTVShowSheetPresented.value && (
          <TVShowSheet
            isPresented={viewModel.isNewTVShowSheetPresented}
            onCreate={() => viewModel.newTVShowDidCreate()}
          />
        )
      }
    </VStack>
  )
}
