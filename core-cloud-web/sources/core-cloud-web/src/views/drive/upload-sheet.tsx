//
//  upload-sheet.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/23.
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

import useUploadSheet from "@/view-models/drive/upload-sheet"
import { BoolBinding } from "ui/binding"
import Sheet from "ui/sheet"
import AsyncImage from "ui/async-image"
import Text from "ui/text"
import VStack from "ui/v-stack"
import Image from "ui/image"

export default function UploadSheet({
  isPresented,
  application,
  locationID,
  onUpload
}: {
  isPresented: BoolBinding,
  application: string,
  locationID: string,
  onUpload: () => void
}) {
  const viewModel = useUploadSheet({
    application: application,
    locationID: locationID,
    onUpload: onUpload
  })

  return (
    <Sheet
      isPresented={isPresented}
      closeButtonActiveBackgroundStyleClassName="active:bg-appTint/16"
      primaryButton={{
        backgroundStyleClassName: (
          "bg-appTint hover:bg-[rgb(0,93,186)] " +
            "dark:hover:bg-[rgb(41,169,255)] " +
            "dark:active:bg-[rgb(82,186,255)] active:bg-[rgb(0,73,145)]"
        ),
        action: () => viewModel.uploadButtonDidClick(),
        disabled: !viewModel.file || viewModel.isLoading,
        label: () => (
          <Text textKey={viewModel.isLoading ? "Uploading..." : "Upload"} />
        )
      }}
    >
      <AsyncImage
        widthClassName="w-9"
        heightClassName="h-9"
        marginClassName="mb-3.5"
        urls={process.env.NEXT_PUBLIC_DRIVE_ICON_URLS?.split(",")}
      />
      <Text
        textKey="New File"
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
        <VStack
          widthClassName="w-full"
          marginClassName="mb-7.5"
          heightClassName="h-24"
          borderClassName="border border-gray3 border-dashed rounded-lg"
          backgroundStyleClassName="hover:bg-fillQuaternary"
        >
          <label
            htmlFor="dropbox"
            className={
              "flex flex-col items-center justify-center size-full " +
                "cursor-pointer fill-labelTertiary"
            }
          >
            <Image
              systemName="icloud.and.arrow.up"
              widthClassName="w-8"
              heightClassName="h-8"
            />
            <Text
              textKey={viewModel.file ? undefined : "Choose a File"}
              verbatimContent={viewModel.file ? viewModel.file.name : undefined}
              foregroundStyleClassName="text-labelTertiary"
              fontSizeClassName="text-sm"
              lineHeightClassName="leading-4.25"
              marginClassName="mt-1.5"
              multilineTextAlignmentClassName="text-center"
              truncationClassName="truncate"
            />
            <input
              id="dropbox"
              type="file"
              className="hidden"
              accept={
                application === "Music"
                  ? ".m4a"
                  : application === "TV"
                  ? ".mp4"
                  : ".zyy"
              }
              onChange={(event) => {
                viewModel.fileInputDidChange((event.target.files ?? [])[0])
              }}
            />
          </label>
        </VStack>

        {
          viewModel.isError && (
            <Text
              textKey="Unable to upload file. Try again later."
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
