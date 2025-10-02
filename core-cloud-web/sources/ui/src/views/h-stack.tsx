//
//  h-stack.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/27.
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
import VerticalAlignment from "./vertical-alignment"

/**
 * A view that arranges its subviews in a horizontal line.
 */
export default function HStack({
  alignment = VerticalAlignment.center,
  widthClassName = "",
  heightClassName = "",
  shadowClassName = "",
  foregroundStyleClassName = "",
  backgroundStyleClassName = "",
  marginClassName = "",
  paddingClassName = "",
  positionClassName = "",
  borderClassName = "",
  style = undefined,
  visibilityClassName = "",
  opacityClassName = "",
  transitionClassName = "",
  transformationClassName = "",
  overflowClassName = "",
  onClick,
  onDoubleClick,
  children
}: {
  /**
   * The guide for aligning the subviews in this stack.
   */
  alignment?: VerticalAlignment,
  /**
   * A fixed width for the resulting view.
   */
  widthClassName?: string,
  /**
   * A fixed height for the resulting view.
   */
  heightClassName?: string,
  shadowClassName?: string,
  foregroundStyleClassName?: string,
  backgroundStyleClassName?: string,
  marginClassName?: string,
  paddingClassName?: string,
  positionClassName?: string,
  borderClassName?: string,
  style?: React.CSSProperties,
  visibilityClassName?: string,
  opacityClassName?: string,
  transitionClassName?: string,
  transformationClassName?: string,
  overflowClassName?: string,
  onClick?: () => void,
  onDoubleClick?: () => void,
  /**
   * A view builder that creates the content of this stack.
   */
  children?: React.ReactNode
}) {
  return (
    <div
      className={
        `flex ${alignment.className} ${heightClassName} ${shadowClassName} ` +
          `${widthClassName} ${backgroundStyleClassName} ${marginClassName} ` +
          `${paddingClassName} ${foregroundStyleClassName} ` +
          `${positionClassName} ${borderClassName} ${visibilityClassName} ` +
          `${opacityClassName} ${transitionClassName} ` +
          `${transformationClassName} ${overflowClassName}`
      }
      style={style}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </div>
  )
}
