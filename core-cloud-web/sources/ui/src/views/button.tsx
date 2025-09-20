//
//  button.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/9/16.
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

import React from "react"

/**
 * A control that initiates an action.
 */
export default function Button({
  action,
  widthClassName = "",
  children
}: {
  /**
   * The action to perform when the user triggers the button.
   */
  action: (clickPosition?: { x: number, y: number }) => void,
  widthClassName?: string,
  /**
   * A view that describes the purpose of the button's action.
   */
  children: React.ReactNode
}) {
  return (
    <button
      className={
        `cursor-pointer ${widthClassName}`
      }
      onClick={(event) => {
        action({
          x: event.clientX,
          y: event.clientY
        })
      }}
    >
      {children}
    </button>
  )
}
