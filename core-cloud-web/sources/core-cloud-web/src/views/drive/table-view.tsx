//
//  table-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/16.
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

import Localizer from "@/localizer"
import useTableView from "@/view-models/drive/table-view"
import { Fragment } from "react"
import TableViewSymbol from "./table-view-symbol"
import Measurement from "foundation/measurement"
import { UnitInformationStorage } from "foundation/unit"
import NewLocalizer from "ui/localizer"

export default function TableView({
  files,
  onNavigation
}: {
  files: {
    id: number,
    name: string,
    kind: string,
    size: number,
    date: number
  }[],
  onNavigation?: (fileName: string) => void
}) {
  const viewModel = useTableView({
    onNavigation: onNavigation
  })

  return (
    <table className="mx-4.5 w-full table-fixed mt-5 md:mt-0">
      <thead className="sticky top-0 bg-backgroundPrimary">
        <tr
          className={
            "w-[calc(100%-36px)] text-labelTertiary text-sm " +
              "leading-4 h-11 relative not-md:hidden " +
              "*:shadow-[inset_0_-1px_var(--color-separator)]"
          }
        >
          <th className="w-13.5" />
          <th className="pr-3 w-[calc(25%-18.4px)] font-normal text-left">
            {Localizer.default().localize("Name")}
          </th>
          <th className="px-3 w-[calc(25%-18.4px)] font-normal text-left">
            {Localizer.default().localize("Kind")}
          </th>
          <th
            className={
              "px-3 w-[calc(25%-18.4px)] font-normal text-left not-md:hidden"
            }
          >
            {Localizer.default().localize("Size")}
          </th>
          <th
            className={
              "px-3 w-[calc(25%-18.4px)] font-normal text-left not-lg:hidden"
            }
          >
            {Localizer.default().localize("Date")}
          </th>
        </tr>
      </thead>
      <tbody className="w-full px-4.5 after:mt-auto">
        {
          files.map((file, index) => (
            <Fragment
              key={file.id}
            >
              {/* >= md */}
              <tr
                className={
                  "w-full h-10.25 not-md:hidden select-none " + (
                    viewModel.selectedFileID === file.id
                      ? "bg-appTint hover:bg-[rgb(0,93,186)] " +
                        "dark:hover:bg-[rgb(41,169,255)]"
                      : "hover:bg-fillQuaternary"
                  )
                }
                onClick={() => viewModel.handleSelectedFileChange(file.id)}
                onDoubleClick={() => {
                  if (file.kind === "Application Library") {
                    viewModel.handleNavigationChange(file.name)
                  }
                }}
              >
                <td className="rounded-l-[10px] w-13.5 pl-4 pr-1.5">
                  <div className="size-5.5">
                    <TableViewSymbol
                      kind={file.kind}
                      applicationName={
                        file.kind === "Application Library"
                          ? file.name
                          : undefined
                      }
                      selected={viewModel.selectedFileID === file.id}
                      className="size-full overflow-visible"
                    />
                  </div>
                </td>
                <td
                  className={
                    "pr-3 w-[calc(25%-18.4px)] text-ellipsis overflow-hidden " +
                      "whitespace-nowrap text-base leading-5 " + (
                        index !== files.length - 1
                          ? "border-b border-separator "
                          : ""
                      ) + (
                        viewModel.selectedFileID === file.id
                          ? "text-systemWhite"
                          : "text-labelPrimary"
                      )
                  }
                >
                  {
                    file.kind === "Application Library"
                      ? NewLocalizer.default.localize(file.name)
                      : file.name
                  }
                </td>
                <td
                  className={
                    "px-3 w-[calc(25%-18.4px)] text-sm leading-4 " +
                      "text-ellipsis overflow-hidden whitespace-nowrap " + (
                        index !== files.length - 1
                          ? "border-b border-separator "
                          : ""
                      ) + (
                        viewModel.selectedFileID === file.id
                          ? "text-systemWhite"
                          : "text-labelSecondary"
                      )
                  }
                >
                  {NewLocalizer.default.localize(file.kind)}
                </td>
                <td
                  className={
                    "px-3 w-[calc(25%-18.4px)] not-md:hidden text-sm " +
                      "leading-4 not-lg:rounded-r-[10px] " + (
                        index !== files.length - 1
                          ? "border-b border-separator "
                          : ""
                      ) + (
                        viewModel.selectedFileID === file.id
                          ? "text-systemWhite"
                          : "text-labelSecondary"
                      )
                  }
                >
                  {
                    file.size === -1
                      ? "--"
                      : new Measurement({
                        value: file.size,
                        unit: UnitInformationStorage.bytes
                      }).formatted()
                  }
                </td>
                <td
                  className={
                    "px-3 w-[calc(25%-18.4px)] not-lg:hidden text-ellipsis " +
                      "overflow-hidden whitespace-nowrap text-sm leading-4 " +
                      "rounded-r-[10px] " + (
                        index !== files.length - 1
                          ? "border-b border-separator "
                          : ""
                      ) + (
                        viewModel.selectedFileID === file.id
                          ? "text-systemWhite"
                          : "text-labelSecondary"
                      )
                  }
                >
                  {
                    file.date === -1
                      ? ""
                      : new Date(file.date).toLocaleString()
                  }
                </td>
              </tr>

              {/* < md */}
              <tr
                className={
                  "w-full h-15.25 md:hidden " + (
                    viewModel.selectedFileID === file.id
                      ? "bg-appTint hover:bg-[rgb(0,93,186)] " +
                        "dark:hover:bg-[rgb(41,169,255)]"
                      : "hover:bg-fillQuaternary"
                  )
                }
                onClick={() => viewModel.handleSelectedFileChange(file.id)}
                onDoubleClick={() => {
                  if (file.kind === "Application Library") {
                    viewModel.handleNavigationChange(file.name)
                  }
                }}
              >
                <td className="rounded-l-xl w-11.5 pl-4 pr-1.5">
                  <div className="size-5.5">
                    <TableViewSymbol
                      kind={file.kind}
                      applicationName={
                        file.kind === "Application Library"
                          ? file.name
                          : undefined
                      }
                      selected={viewModel.selectedFileID === file.id}
                      className="size-full overflow-visible"
                    />
                  </div>
                </td>
                <td
                  className={
                    "rounded-r-xl px-3 " + (
                      index !== files.length - 1
                        ? "border-b border-b-separator"
                        : ""
                    )
                  }
                >
                  <div
                    className={
                      "text-ellipsis overflow-hidden whitespace-nowrap " +
                        "text-base leading-7.5 " + (
                          viewModel.selectedFileID === file.id
                            ? "text-systemWhite"
                            : "text-labelPrimary"
                        )
                    }
                  >
                    {
                      file.kind === "Application Library"
                        ? Localizer.default().localize(file.name)
                        : file.name
                    }
                  </div>
                  <div
                    className={
                      "text-sm leading-4 " + (
                        viewModel.selectedFileID === file.id
                          ? "text-systemWhite"
                          : "text-labelSecondary"
                      )
                    }
                  >
                    {Localizer.default().localize(file.kind)}
                  </div>
                </td>
              </tr>
            </Fragment>
          ))
        }
      </tbody>
    </table>
  )
}
