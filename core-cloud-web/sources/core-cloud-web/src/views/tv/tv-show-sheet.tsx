//
//  tv-show-sheet.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/10/19.
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

import useTVShowSheet from "@/view-models/tv/tv-show-sheet"
import { Fragment } from "react"
import AsyncImage from "ui/async-image"
import { BoolBinding } from "ui/binding"
import Grid from "ui/grid"
import HStack from "ui/h-stack"
import Sheet from "ui/sheet"
import Text from "ui/text"
import TextField from "ui/text-field"

export default function TVShowSheet({
  isPresented,
  onCreate
}: {
  isPresented: BoolBinding,
  onCreate?: () => void
}) {
  const viewModel = useTVShowSheet({
    onCreate: onCreate
  })

  return (
    <Sheet
      isPresented={isPresented}
      closeButtonActiveBackgroundStyleClassName="active:bg-systemBlue/16"
      primaryButton={{
        backgroundStyleClassName: (
          "bg-systemBlue hover:bg-[rgb(0,93,186)] " +
            "dark:hover:bg-[rgb(41,169,255)] " +
            "dark:active:bg-[rgb(82,186,255)] active:bg-[rgb(0,73,145)] "
        ),
        action: () => viewModel.createButtonDidClick(),
        disabled: (
          viewModel.title.value.length <= 0 ||
            viewModel.starring.value.length <= 0 ||
            viewModel.genre.value.length <= 0 ||
            viewModel.startYear.value.length <= 0 ||
            viewModel.endYear.value.length <= 0 ||
            viewModel.region.value.length <= 0 ||
            viewModel.description.value.length <= 0 ||
            viewModel.posterURLs.value.length <= 0 ||
            viewModel.artworkURLs.value.length <= 0 ||
            viewModel.studio.value.length <= 0 ||
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
        urls={process.env.NEXT_PUBLIC_TV_ICON_URLS?.split(",")}
      />
      <Text
        textKey={"New TV Show"}
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
                    "focus:outline-systemBlue/70 " +
                    "focus:-outline-offset-2"
                }
                tintClassName="caret-systemBlue"
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
            textKey="Unable to create tv show. Try again later."
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
