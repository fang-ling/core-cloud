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
import UIImage from "../ui-image"
import CoreCloudWeb from "@/core-cloud-web"
import Localizer from "@/localizer"
import UIProgress from "../ui-progress"
import { BoolBinding } from "ui/binding"
import Sheet from "ui/sheet"
import UISFSymbol from "../ui-sf-symbol"

export default function UploadSheet({
  isPresented
}: {
  isPresented: BoolBinding
}) {
  const viewModel = useUploadSheet({ })

  return (
    <Sheet isPresented={isPresented}>
      <UIImage
        className="size-9 mb-3.5"
        urls={
          CoreCloudWeb.APPS.find(a => a.href === "/drive")?.urls ?? []
        }
      />
      <h1
        className={
          "text-labelPrimary text-[19px] font-semibold leading-5.5 " +
            "mb-3.5"
        }
      >
        {Localizer.default().localize("New File")}
      </h1>
      <div className="px-2.5 pb-2.5 w-full">
        <label
          className={
            "text-labelPrimary text-left w-full text-sm " +
              "leading-4.25 mb-1.25 block"
          }
        >
          {"SHA-512"}
        </label>
        <input
          className={
            "w-full h-9 px-2.5 rounded-lg border border-gray3 " +
              "caret-appTint mb-3.75 hover:bg-fillQuaternary " +
              "text-sm leading-4.5 text-labelPrimary focus:outline-3 " +
              "focus:outline-appTint/70 focus:-outline-offset-2 " +
              "text-ellipsis"
          }
          value={viewModel.sha512}
          onChange={(event) => {
            viewModel.sha512InputDidChange(event.target.value)
          }}
        />

        <div className="flex items-center justify-center w-full mb-7.5">
          <label
            htmlFor="dropzone-file"
            className={
              "flex flex-col items-center justify-center w-full h-24 border " +
                "border-gray3 border-dashed rounded-lg cursor-pointer " +
                "hover:bg-fillQuaternary"
            }
          >
            <div className="flex flex-col items-center justify-center w-full">
              <UISFSymbol
                systemName="icloud.and.arrow.up"
                className="w-8 h-8 fill-labelTertiary"
              />
              <p
                className={
                  "w-full text-labelTertiary text-sm leading-4.25 mt-1.5 " +
                    "truncate text-center"
                }
              >
                {
                  viewModel.file
                    ? viewModel.file.name
                    : Localizer.default().localize("Choose a File")
                }
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={(event) => {
                viewModel.fileInputDidChange((event.target.files ?? [])[0])
              }}
            />
          </label>
        </div>

        {
          viewModel.isError && (
            <p
              className={
                "text-[#e30000] dark:text-[#ff3037] text-sm " +
                  "leading-5 mb-2.5 text-center"
              }
            >
              {
                Localizer
                  .default()
                  .localize(
                    "Unable to upload file. Try again later."
                  )
              }
            </p>
          )
        }
        <div className="w-full flex justify-center">
          <button
            className={
              "min-w-1/2 bg-appTint text-systemWhite h-9 flex " +
                "items-center justify-center rounded-lg " +
                "hover:bg-[rgb(0,93,186)] " +
                "dark:hover:bg-[rgb(41,169,255)] " +
                "dark:active:bg-[rgb(82,186,255)] " +
                "active:bg-[rgb(0,73,145)] " +
                "active:text-systemWhite/30 " + (
                  (viewModel.sha512.length <= 0 || !viewModel.file)
                    ? "opacity-30 dark:opacity-40 pointer-events-none"
                    : "cursor-pointer"
                )
            }
            onClick={() => viewModel.uploadButtonDidClick()}
          >
            {Localizer.default().localize("Upload")}
          </button>
        </div>
      </div>

      {/* Loading */}
      <div
        className={
          "bg-backgroundPrimary absolute inset-0 flex items-center " +
            "justify-center rounded-b-[11px] " + (
              viewModel.isLoading ? "visible" : "invisible"
            )
        }
      >
        <UIProgress variant="8" />
      </div>
    </Sheet>
  )
}
