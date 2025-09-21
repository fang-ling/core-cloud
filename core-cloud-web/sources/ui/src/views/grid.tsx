//
//  grid.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/28.
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

import Alignment from "./alignment"
import React from "react"

/**
 * A container view that arranges other views in a two dimensional layout.
 */
export default function Grid({
  alignment = Alignment.center,
  gridTemplateClassName = "",
  widthClassName = "",
  heightClassName = "",
  borderClassName = "",
  backgroundStyleClassName = "",
  positionClassName = "",
  style = undefined,
  isGroup,
  paddingClassName = "",
  marginClassName = "",
  overflowClassName = "",
  visibilityClassName = "",
  horizontalSpacingClassName = "",
  verticalSpacingClassName = "",
  children
}: {
  /**
   * The guide for aligning the child views within the space allocated for a
   * given cell. The default is center.
   */
  alignment?: Alignment,
  gridTemplateClassName?: string,
  widthClassName?: string,
  heightClassName?: string,
  borderClassName?: string,
  backgroundStyleClassName?: string,
  positionClassName?: string,
  style?: React.CSSProperties,
  isGroup?: boolean,
  paddingClassName?: string,
  marginClassName?: string,
  overflowClassName?: string,
  visibilityClassName?: string,
  /**
   * The horizontal distance between each cell.
   */
  horizontalSpacingClassName?: string,
  /**
   * The vertical distance between each cell.
   */
  verticalSpacingClassName?: string,
  children: React.ReactNode
}) {
  return (
    <div
      className={
        `grid ${alignment.className} ${gridTemplateClassName} ` +
          `${widthClassName} ${heightClassName} ${borderClassName} ` +
          `${backgroundStyleClassName} ${positionClassName} ` +
          `${paddingClassName} ${marginClassName} ${overflowClassName} ` +
          `${visibilityClassName} ${horizontalSpacingClassName} ` +
          `${verticalSpacingClassName} ` + (
            isGroup ? "group" : ""
          )
      }
      style={style}
    >
      {children}
    </div>
  )
}
