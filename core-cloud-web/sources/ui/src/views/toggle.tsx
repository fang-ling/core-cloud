//
//  toggle.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/9/14.
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

import { BoolBinding } from "../binding"
import React from "react"
import Image from "./image"

/**
 * A control that toggles between on and off states.
 */
export default function Toggle({
  isOn,
  children,
  style = "checkbox",
  tintClassName = ""
}: {
  /**
   * A binding to a property that indicates whether the toggle is on or off.
   */
  isOn: BoolBinding,
  /**
   * A view that describes the purpose of the toggle.
   */
  children: React.ReactNode
  /**
   * The appearance and behavior of a toggle.
   */
  style?: "checkbox",
  tintClassName?: string
}) {
  return (
    <div
      className="flex items-center"
      onClick={() => isOn.toggle()}
    >
      <div className="relative flex items-center justify-center mr-2.5">
        <input
          className={
            "appearance-none size-4 rounded-[3px] bg-[hsla(0,0%,100%,.8)] " +
              "border-[#86868b] dark:bg-[hsla(0,0%,100%,.04)] " +
              `dark:border-[#6e6e73] border-1 ${tintClassName}`
          }
          checked={isOn.value}
          readOnly={true}
          type={style}
        />
        {
          isOn.value && (
            <div
              className={
                "absolute left-[3.5px] top-[3.5px] pointer-events-none " +
                  "fill-white"
              }
            >
              <Image
                systemName="checkmark"
                weight="semibold"
                widthClassName="w-2.25"
                heightClassName="h-2.25"
              />
            </div>
          )
        }
      </div>
      {children}
    </div>
  )
}
