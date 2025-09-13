//
//  song-sheet.tsx
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

import useSongSheet from "@/view-models/music/song-sheet"
import { Fragment } from "react"
import AsyncImage from "ui/async-image"
import { BoolBinding } from "ui/binding"
import Sheet from "ui/sheet"
import Text from "ui/text"
import VStack from "ui/v-stack"

export default function SongSheet({
  isPresented,
  onCreate
}: {
  isPresented: BoolBinding,
  onCreate?: () => void
}) {
  const viewModel = useSongSheet({
    onCreate: onCreate
  })

  return (
    <Sheet
      isPresented={isPresented}
      closeButtonActiveBackgroundStyleClassName="active:bg-music-keyColor/16"
      primaryButton={{
        backgroundStyleClassName: (
          "bg-music-keyColor hover:bg-[#fb394f] active:bg-[#f90722]"
        ),
        action: () => viewModel.createButtonDidClick(),
        disabled: (
          viewModel.title.length <= 0 ||
            viewModel.artist.length <= 0 ||
            viewModel.genre.length <= 0 ||
            viewModel.year.length <= 0 ||
            viewModel.trackNumber.length <= 0 ||
            viewModel.discNumber.length <= 0 ||
            viewModel.playCount.length <= 0 ||
            viewModel.sampleSize.length <= 0 ||
            viewModel.sampleRate.length <= 0 ||
            viewModel.fileID.length <= 0 ||
            viewModel.albumID.length <= 0 ||
            viewModel.isLoading
        ),
        label: () => (
          <Text textKey={viewModel.isLoading ? "Loading..." : "Create"} />
        )
      }}
    >
      <AsyncImage
        widthClassName="w-9"
        heightClassName="h-9"
        marginClassName="mb-3.5"
        urls={process.env.NEXT_PUBLIC_MUSIC_ICON_URLS?.split(",")}
      />
      <Text
        textKey="New Song"
        foregroundStyleClassName="text-labelPrimary"
        fontSizeClassName="text-[19px]"
        fontWeightClassName="font-semibold"
        lineHeightClassName="leading-5.5"
        marginClassName="mb-3.5"
        multilineTextAlignmentClassName="text-center"
      />

      <VStack
        widthClassName="w-full"
        paddingClassName="px-2.5 pb-2.5"
      >
        {
          viewModel.fields.map((field, index) => (
            <Fragment
              key={index}
            >
              <Text
                textKey={field.label}
                foregroundStyleClassName="text-labelPrimary"
                fontSizeClassName="text-sm"
                lineHeightClassName="leading-4.25"
                marginClassName="mb-1.25"
                multilineTextAlignmentClassName="text-left"
              />
              <input
                className={
                  "w-full h-9 px-2.5 rounded-lg border border-gray3 " +
                    "caret-music-keyColor mb-3.75 hover:bg-fillQuaternary " +
                    "text-sm leading-4.5 text-labelPrimary focus:outline-3 " +
                    "focus:outline-music-keyColor/70 focus:-outline-offset-2 " +
                    "text-ellipsis disabled:bg-fillQuaternary " +
                    "disabled:opacity-30 dark:disabled:opacity-40"
                }
                value={field.value}
                onChange={(event) => {
                  field.onChange(event.target.value)
                }}
                disabled={viewModel.isLoading}
              />
            </Fragment>
          ))
        }

        {
          viewModel.isError && (
            <Text
              textKey="Unable to create song. Try again later."
              foregroundStyleClassName="text-[#e30000] dark:text-[#ff3037]"
              fontSizeClassName="text-sm"
              lineHeightClassName="leading-5"
              marginClassName="mb-2.5"
              multilineTextAlignmentClassName="text-center"
            />
          )
        }
      </VStack>
    </Sheet>
  )
}
