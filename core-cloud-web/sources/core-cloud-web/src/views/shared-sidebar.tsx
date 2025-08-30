//
//  shared-sidebar.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/25.
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

import Text from "ui/text"
import Image from "ui/image"
import VStack from "ui/v-stack"
import ContentMode from "ui/content-mode"

export default function SharedSidebar({
  sections,
  selectedItemKey,
  itemForegroundStyleClassName = "",
  itemBackgroundStyleClassName = "",
  onSelectedItemKeyChange
}: {
  sections: {
    header: string,
    items: {
      key: string,
      symbolName: string,
      title: string
    }[]
  }[],
  selectedItemKey: string,
  itemForegroundStyleClassName?: string,
  itemBackgroundStyleClassName?: string,
  onSelectedItemKeyChange: (newSelectedItemKey: string) => void
}) {
  return (
    <>
      {
        sections.map(section => (
          <li key={section.header}>
            <Text
              textKey={section.header}
              marginClassName="ml-1.5 mb-1.5"
              fontSizeClassName="text-sm"
              fontWeightClassName="font-semibold"
              foregroundStyleClassName="text-labelSecondary"
              lineHeightClassName="leading-4.25"
            />
            <ul className="mb-3.25">
              {
                section.items.map(item => (
                  <li
                    key={item.key}
                    className={
                      "w-full h-8 pl-5 pr-2 rounded-[10px] flex items-center " +
                        "cursor-pointer select-none text-labelPrimary " +
                        `${itemBackgroundStyleClassName} ` +
                        `${itemForegroundStyleClassName} ` +
                        "active:fill-systemWhite active:text-systemWhite " + (
                          selectedItemKey === item.key
                            ? "bg-gray5"
                            : "hover:bg-fillQuaternary"
                        )
                    }
                    onClick={() => onSelectedItemKeyChange(item.key)}
                  >
                    <VStack
                      widthClassName="w-5"
                      heightClassName="h-4"
                      marginClassName="ml-1.25 mr-2.25"
                    >
                      <Image
                        systemName={item.symbolName}
                        widthClassName="w-full"
                        heightClassName="h-full"
                        contentMode={ContentMode.fit}
                      />
                    </VStack>
                    <Text
                      textKey={item.title}
                      lineHeightClassName="leading-4.5"
                      fontSizeClassName="text-[15px]"
                    />
                  </li>
                ))
              }
            </ul>
          </li>
        ))
      }
    </>
  )
}
