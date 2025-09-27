//
//  async-image.tsx
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
import ContentMode from "./content-mode"

/**
 * A view that asynchronously loads and displays an image.
 */
export default function AsyncImage({
  urls = [],
  widthClassName = "",
  heightClassName = "",
  marginClassName = "",
  contentMode,
  borderClassName = "",
  shadowClassName = "",
  positionClassName = ""
}: {
  /**
   * The URL of the image to display.
   */
  urls?: string[],
  widthClassName?: string,
  heightClassName?: string,
  marginClassName?: string,
  contentMode?: ContentMode,
  borderClassName?: string,
  shadowClassName?: string,
  positionClassName?: string
}) {
  return (
    <picture>
      {
        urls.slice(0, -1).map((url, index) => (
          <source
            key={index}
            srcSet={url}
            type={`image/${url.split('.').pop()?.toLowerCase()}`}
          />
        ))
      }
      <img
        src={urls[urls.length - 1]}
        className={
          `${widthClassName} ${heightClassName} ${marginClassName} ` +
            `${borderClassName} select-none ${shadowClassName} ` +
            `${positionClassName} ` + (
              contentMode === ContentMode.fit ? "object-contain" : ""
            )
        }
      />
    </picture>
  )
}
