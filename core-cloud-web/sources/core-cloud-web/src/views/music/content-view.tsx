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

export default function ContentView() {
  const viewModel = useContentView()

  return (
    <VStack heightClassName="h-dvh">
      <SharedToolbar
        source="music"
        variant={viewModel.isPassed ? "app" : "thinMaterial"}
      />

      {
        viewModel.isPassed && (
          <NavigationSplitView
            sidebar={({
              selectedItemKey,
              onChange
            }) => (
              <SharedSidebar
                sections={viewModel.sectionsRef.current}
                selectedItemKey={selectedItemKey}
                itemForegroundStyleClassName="fill-music-keyColor"
                itemBackgroundStyleClassName="active:bg-music-keyColor"
                onSelectedItemKeyChange={(newSelectedItemKey) => {
                  onChange(newSelectedItemKey)
                }}
              />
            )}
            detail={() => (
              <DetailView />
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
        !viewModel.isPassed && (
          <>
            <SharedBodyguard
              onPass={() => {}}
              inputClassName="focus:border-music-keyColor"
            />
            <SharedFooter />
          </>
        )
      }
    </VStack>
  )
}
