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
import { Fragment, useEffect } from "react"
import AsyncImage from "ui/async-image"
import { BoolBinding } from "ui/binding"
import Grid from "ui/grid"
import HStack from "ui/h-stack"
import Sheet from "ui/sheet"
import Text from "ui/text"
import TextField from "ui/text-field"
import Toggle from "ui/toggle"
import { Picker, PickerOption } from "ui/picker"
import NewLocalizer from "ui/localizer"
import ZStack from "ui/z-stack"
import Image from "ui/image"

export default function SongSheet({
  isPresented,
  mode,
  onCreate,
  detail
}: {
  isPresented: BoolBinding,
  mode: "creation" | "modification",
  onCreate?: () => void,
  detail?: {
    id?: number,
    artworkURLs?: string,
    title?: string,
    artist?: string,
    fileID?: number,
    duration?: number
  }
}) {
  const viewModel = useSongSheet({
    onCreate: onCreate,
    detail: detail
  })

  useEffect(() => {
    if (mode === "modification" && detail?.id !== undefined) {
      viewModel.viewDidAppear1()
    }
    viewModel.viewDidAppear2()
    viewModel.viewDidAppear3()
  }, [])

  return (
    <Sheet
      isPresented={isPresented}
      closeButtonActiveBackgroundStyleClassName="active:bg-music-keyColor/16"
      primaryButton={
        mode === "creation"
          ? {
            backgroundStyleClassName: (
              "bg-music-keyColor hover:bg-[#fb394f] active:bg-[#f90722]"
            ),
            action: () => viewModel.createButtonDidClick(),
            disabled: (
              viewModel.title.value.length <= 0 ||
                viewModel.artist.value.length <= 0 ||
                viewModel.trackNumber.value.length <= 0 ||
                viewModel.discNumber.value.length <= 0 ||
                viewModel.playCount.value.length <= 0 ||
                viewModel.sampleSize.value.length <= 0 ||
                viewModel.sampleRate.value.length <= 0 ||
                viewModel.selectedFileID.value.length <= 0 ||
                viewModel.selectedAlbumID.value.length <= 0 ||
                viewModel.isLoading
            ),
            label: () => (
              <Text textKey={viewModel.isLoading ? "Loading..." : "Create"} />
            )
          }
          : undefined
      }
    >
      <AsyncImage
        widthClassName="w-9"
        heightClassName="h-9"
        marginClassName="mb-3.5"
        urls={
          mode === "creation"
            ? process.env.NEXT_PUBLIC_MUSIC_ICON_URLS?.split(",")
            : detail?.artworkURLs?.split(",")
        }
      />
      <Text
        textKey={mode === "creation" ? "New Song" : "Details"}
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
              {
                typeof field.value.value === "boolean" && (
                  <Toggle
                    isOn={field.value}
                    tintClassName={
                      "checked:bg-music-keyColor " +
                        "checked:border-music-keyColor"
                    }
                    marginClassName="mb-3.75"
                  >
                    <Text
                      textKey={field.caption}
                      foregroundStyleClassName="text-labelSecondary"
                      fontSizeClassName="text-sm"
                    />
                  </Toggle>
                )
              }
              {
                (
                  typeof field.value.value !== "boolean" &&
                    (field.albums === undefined && field.files === undefined)
                ) && (
                  <TextField
                    text={field.value}
                    widthClassName="w-full"
                    heightClassName="h-9"
                    paddingClassName="px-2.5"
                    borderClassName={
                      "rounded-lg border border-gray3 focus:outline-3 " +
                        "focus:outline-music-keyColor/70 " +
                        "focus:-outline-offset-2"
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
                )
              }
              {
                (
                  typeof field.value.value !== "boolean" &&
                    (field.albums !== undefined || field.files !== undefined)
                ) && (
                  <ZStack
                    widthClassName="w-full"
                    marginClassName="mb-3.75"
                  >
                    <Picker
                      widthClassName="w-full"
                      heightClassName="h-9"
                      borderClassName={
                        "rounded-lg border border-gray3 focus:outline-3 " +
                          "focus:outline-music-keyColor/70 " +
                          "focus:-outline-offset-2"
                      }
                      paddingClassName="pl-2.5 pr-8"
                      selection={
                        field.albums !== undefined
                          ? viewModel.selectedAlbumID
                          : viewModel.selectedFileID
                      }
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
                    >
                      {
                        mode === "creation" && (
                          <PickerOption
                            tag="0"
                            disabled={true}
                          >
                            {
                              NewLocalizer.default.localize(
                                field.albums !== undefined
                                  ? "Choose an Album"
                                  : "Choose a File"
                              )
                            }
                          </PickerOption>
                        )
                      }
                      {
                        field.albums !== undefined
                          ? viewModel.albums.map(album => (
                            <PickerOption
                              key={album.id}
                              tag={album.id.toString()}
                            >
                              {`${album.artist}, ${album.name}, ${album.year}`}
                            </PickerOption>
                          ))
                          : viewModel.files.map(file => (
                            <PickerOption
                              key={file.id}
                              tag={file.id.toString()}
                            >
                              {file.name}
                            </PickerOption>
                          ))
                      }
                    </Picker>

                    <HStack
                      widthClassName="w-3"
                      heightClassName="h-9"
                      positionClassName="absolute top-0 right-2.5"
                    >
                      <Image
                        systemName="chevron.down"
                        widthClassName="w-3"
                        foregroundStyleClassName={
                          "fill-labelSecondary " + (
                            viewModel.isLoading
                              ? "opacity-30 dark:opacity-40"
                              : ""
                          )
                        }
                      />
                    </HStack>
                  </ZStack>
                )
              }
            </Fragment>
          ))
        }
      </Grid>
      {
        viewModel.isError && (
          <Text
            textKey="Unable to create song. Try again later."
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
