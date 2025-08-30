//
//  z-stack.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/30.
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
import Alignment from "./alignment"

/**
 * A view that overlays its subviews, aligning them in both axes.
 */
export default function ZStack({
  alignment = Alignment.center,
  widthClassName = "",
  heightClassName = "",
  borderClassName = "",
  style,
  backgroundStyleClassName,
  children
}: {
  /**
   * The guide for aligning the subviews in this stack on both the x- and
   * y-axes.
   */
  alignment?: Alignment,
  widthClassName?: string,
  heightClassName?: string,
  borderClassName?: string,
  style?: React.CSSProperties,
  backgroundStyleClassName?: string,
  children: React.ReactNode
}) {
  return (
    <div
      className={
        `relative flex ${alignment.className} ${widthClassName} ` +
          `${heightClassName} ${borderClassName} ${backgroundStyleClassName}`
      }
      style={style}
    >
      {children}
    </div>
  )
}
