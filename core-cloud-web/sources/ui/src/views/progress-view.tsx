//
//  progress-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/9/4.
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
 * A view that shows the progress toward completion of a task.
 */
export default function ProgressView({
  size = "regular",
  style = "circular"
}: {
  size?: "mini" | "small" | "regular" | "large",
  style?: "dotted" | "circular"
}) {
  switch (style) {
    case "dotted":
      switch (size) {
        case "large": return (
          <div
            className={
              "animate-[fadeIn_.25s_ease-in-out_forwards] flex items-center"
            }
          >
            {
              [0.25, 0.75, 1.25].map(i => (
                <div
                  key={i}
                  className={
                    'size-2 rounded-full mx-1.25 bg-gray3 ' +
                      'animate-[loading-dots-dot_1.5s_infinite_forwards]'
                  }
                  style={{ animationDelay: `${i}s` }}
                />
              ))
            }
          </div>
        )
      }
  }
}
