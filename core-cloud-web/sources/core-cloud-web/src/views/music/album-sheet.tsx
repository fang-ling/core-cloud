//
//  album-sheet.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/9/13.
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

import useAlbumSheet from "@/view-models/music/album-sheet"
import { Fragment } from "react"
import AsyncImage from "ui/async-image"
import { BoolBinding } from "ui/binding"
import Sheet from "ui/sheet"
import Text from "ui/text"
import TextField from "ui/text-field"
import Grid from "ui/grid"
import HStack from "ui/h-stack"

export default function AlbumSheet({
  isPresented,
  onCreate
}: {
  isPresented: BoolBinding,
  onCreate?: () => void
}) {
  const viewModel = useAlbumSheet({
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
          viewModel.name.value.length <= 0 ||
            viewModel.artist.value.length <= 0 ||
            viewModel.genre.value.length <= 0 ||
            viewModel.year.value.length <= 0 ||
            viewModel.artworkURLs.value.length <= 0 ||
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
        textKey="New Album"
        foregroundStyleClassName="text-labelPrimary"
        fontSizeClassName="text-[19px]"
        fontWeightClassName="font-semibold"
        lineHeightClassName="leading-5.5"
        marginClassName="mb-3.5"
        multilineTextAlignmentClassName="text-center"
      />

      <Grid
        widthClassName="w-full"
        gridTemplateClassName="grid-cols-[auto_1fr]"
        paddingClassName="px-2.5 pb-2.5"
      >
        {
          viewModel.fields.map((field, index) => (
            <Fragment key={index}>
              <HStack
                heightClassName="h-full"
                marginClassName="mb-3.75 mr-1"
              >
                <Text
                  textKey={field.label}
                  foregroundStyleClassName="text-labelPrimary"
                  fontSizeClassName="text-sm"
                  lineHeightClassName="leading-4.25"
                  marginClassName="mb-1.25"
                  multilineTextAlignmentClassName="text-right"
                />
              </HStack>
              <TextField
                text={field.value}
                widthClassName="w-full"
                heightClassName="h-9"
                paddingClassName="px-2.5"
                borderClassName={
                  "rounded-lg border border-gray3 focus:outline-3 " +
                    "focus:outline-music-keyColor/70 focus:-outline-offset-2"
                }
                tintClassName="caret-music-keyColor"
                marginClassName="mb-3.75"
                backgroundStyleClassName={
                  "hover:bg-fillQuaternary disabled:bg-fillQuaternary"
                }
                fontSizeClassName="text-sm"
                lineHeightClassName="leading-4.5"
                foregroundStyleClassName={
                  "text-labelPrimary disabled:opacity-30 " +
                    "dark:disabled:opacity-40"
                }
                disabled={viewModel.isLoading}
              />
            </Fragment>
          ))
        }
      </Grid>

      {
        viewModel.isError && (
          <Text
            textKey="Unable to create album. Try again later."
            foregroundStyleClassName="text-[#e30000] dark:text-[#ff3037]"
            fontSizeClassName="text-sm"
            lineHeightClassName="leading-5"
            marginClassName="mb-5"
            multilineTextAlignmentClassName="text-center"
          />
        )
      }
    </Sheet>
  )
}
