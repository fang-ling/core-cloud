//
//  empty-view.tsx
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

import Image from "ui/image"
import Spacer from "ui/spacer"
import Text from "ui/text"
import VStack from "ui/v-stack"

export default function EmptyView() {
  return (
    <VStack heightClassName="h-full">
      <Spacer />

      <Image
        systemName="corecloud.applemusic"
        widthClassName="w-11.25"
        heightClassName="h-13.25"
        foregroundStyleClassName="fill-music-systemSecondary"
        marginClassName="mb-10"
      />
      <Text
        textKey="Add Music to Your Library"
        fontSizeClassName="text-[13px]"
        lineHeightClassName="leading-4"
        fontWeightClassName="font-extrabold"
        foregroundStyleClassName="text-music-systemSecondary"
        multilineTextAlignmentClassName="text-center"
      />
      <Text
        textKey="Browse millions of songs and collect your favorites here."
        fontSizeClassName="text-[11px]"
        lineHeightClassName="leading-3.5"
        foregroundStyleClassName="text-music-systemSecondary"
        multilineTextAlignmentClassName="text-center"
      />

      <Spacer />
    </VStack>
  )
}
