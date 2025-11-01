//
//  detail-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/12.
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
import useDetailView from "@/view-models/drive/detail-view"
import { useEffect } from "react"
import NavigationBarSymbol from "./navigation-bar-symbol"
import UIProgress from "../ui-progress"
import TableView from "./table-view"
import Measurement from "foundation/measurement"
import { UnitInformationStorage } from "foundation/unit"
import NewLocalizer from "ui/localizer"

export default function DetailView({
  currentSidebarKey,
  title,
  symbolName,
  emptyMessage,
  emptyDescription,
  navigationStack,
  setNavigationStack
}: {
  currentSidebarKey: string,
  title: string,
  symbolName?: string,
  emptyMessage?: string,
  emptyDescription?: string,
  navigationStack: string[],
  setNavigationStack: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const viewModel = useDetailView({
    title: title,
    currentSidebarKey: currentSidebarKey,
    navigationStack: navigationStack,
    setNavigationStack: setNavigationStack
  })

  useEffect(() => {
    viewModel.handleOnAppear()
  }, [])

  return (
    <div className="grow flex flex-col overflow-y-auto">
      {/* Navigation bar */}
      <div className="flex pl-2.5 pr-3.75 py-1.25 flex-col select-none">
        <div className="flex">
          {
            viewModel.navigationStack.length > 1 && (
              <button
                className={
                  "fill-appTint size-8.5 p-1.5 rounded-lg " +
                    "hover:bg-fillTertiary active:bg-appTint/16 " +
                    "active:fill-appTint/30 " + (
                      viewModel.isLoading
                        ? "opacity-30 dark:opacity-40 pointer-events-none " +
                          "cursor-default"
                        : "cursor-pointer"
                    )
                }
                onClick={() => viewModel.handleNavigationChange(undefined)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 22 22"
                  version="1.1"
                  width={22}
                  height={22}
                >
                  <path
                    d={
                      "M10.9931889,22 C17.0006192,22 22,17.0111524 22" +
                        ",11 C22,4.98884758 16.9869969,0 10.9795666,0" +
                        " C4.98575851,0 0,4.98884758 0,11 C0,17.01115" +
                        "24 4.9993808,22 10.9931889,22 Z M13.1591331," +
                        "16.3023544 C12.8458204,16.6158612 12.2055728" +
                        ",16.5885998 11.8786378,16.2750929 L7.5331269" +
                        "3,12.2131351 C6.85201238,11.5861214 6.852012" +
                        "38,10.4547708 7.53312693,9.81412639 L11.8786" +
                        "378,5.76579926 C12.2464396,5.42503098 12.804" +
                        "9536,5.39776952 13.1455108,5.72490706 C13.52" +
                        "6935,6.07930607 13.5405573,6.67905824 13.172" +
                        "7554,7.03345725 L8.89535604,11.0136307 L13.1" +
                        "727554,15.0074349 C13.526935,15.3482032 13.5" +
                        "405573,15.9343247 13.1591331,16.3023544 Z"
                    }
                  />
                </svg>
              </button>
            )
          }
          <div
            className={
              "min-h-8.5 pt-0.5 px-2.25 font-medium text-2xl leading-7.5 " +
                "text-labelPrimary flex items-center"
            }
          >
            <NavigationBarSymbol
              className="-ml-2.25 fill-labelTertiary"
              symbolName={symbolName}
            />
            {
              NewLocalizer.default.localize(
                viewModel.navigationStack[viewModel.navigationStack.length-1]
              )
            }
          </div>
        </div>
        {/* status */}
        <h2
          className={
            "mt-0.25 text-sm leading-4 text-labelSecondary " + (
              viewModel.navigationStack.length > 1
                ? "pl-10.5"
                : "pl-2.25"
            )
          }
        >
          {
            viewModel.isLoading
              ? Localizer.default().localize("Loading...")
              : Localizer
                .default()
                .localize("%lld item(s)")
                .replace("%lld", viewModel.files.length + "") + (
                  viewModel.navigationStack.length > 1
                    ? Localizer.default().localize(", ") +
                      Localizer
                        .default()
                        .localize("%lld used")
                        .replace(
                          "%lld",
                          new Measurement({
                            value: viewModel.files.reduce((a,f) => a+f.size, 0),
                            unit: UnitInformationStorage.bytes
                          }).formatted()
                        )
                    : ""
                )
          }
        </h2>
      </div>
      <div
        className={
          "grow w-full flex overflow-y-auto " + (
            viewModel.isLoading || viewModel.files.length <= 0
              ? "items-center justify-center"
              : ""
          )
        }
      >
        {
          viewModel.isLoading
            ? <UIProgress variant="8" />
            : viewModel.files.length > 0
              ? (
                <TableView
                  files={viewModel.files}
                  onNavigation={(fileName) => {
                    viewModel.handleNavigationChange(fileName)
                  }}
                />
              )
              : (
                /* Empty */
                <div className="flex flex-col items-center px-5">
                  <h2
                    className={
                      "text-[31px] text-labelTertiary leading-[1.2] " +
                        "font-bold text-center"
                    }
                  >
                    {emptyMessage}
                  </h2>
                  {
                    emptyDescription && (
                      <p
                        className={
                          "text-base font-light text-labelTertiary leading-5 " +
                            "mt-5.5 text-center"
                        }
                      >
                        {emptyDescription}
                      </p>
                    )
                  }
                </div>
              )
        }
      </div>
    </div>
  )
}
