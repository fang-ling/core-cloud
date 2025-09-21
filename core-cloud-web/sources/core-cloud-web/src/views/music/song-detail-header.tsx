//
//  song-detail-header.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/9/21.
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

import { Fragment } from "react"
import Grid from "ui/grid"
import HStack from "ui/h-stack"
import Text from "ui/text"

export default function SongDetailHeader({
  isMobile
}: {
  isMobile: boolean
}) {
  return (
    <Grid
      widthClassName="w-full"
      paddingClassName="pl-10"
      gridTemplateClassName={
        isMobile
          ? "grid-cols-[1fr_auto_80px]"
          : "grid-cols-[1fr_auto_1fr_auto_1fr_auto_80px]"
      }
      borderClassName="border-b border-music-labelDivider"
      marginClassName="mt-3"
      visibilityClassName={
        isMobile
          ? "md:hidden"
          : "not-md:hidden"
      }
    >
      {
        (
          isMobile
            ? ["Name", "Duration"]
            : ["Name", "Artist", "Album", "Duration"]
        ).map(key => (
          <Fragment key={key}>
            <HStack paddingClassName="py-1.5 px-2.25">
              <Text
                textKey={key}
                fontSizeClassName="text-[11px]"
                fontWeightClassName="font-semibold"
                lineHeightClassName="leading-3.5"
                foregroundStyleClassName="text-music-systemPrimary"
                multilineTextAlignmentClassName="text-left"
              />
            </HStack>
            {
              key !== "Duration" && (
                <HStack
                  widthClassName="w-0.25"
                  heightClassName="h-4.75"
                  backgroundStyleClassName="bg-music-labelDivider"
                />
              )
            }
          </Fragment>
        ))
      }
    </Grid>
  )
}
