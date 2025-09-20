//
//  context-menu.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/9/20.
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

import { createPortal } from "react-dom"
import { BoolBinding } from "ui/binding"
import Button from "ui/button"
import HStack from "ui/h-stack"
import Image from "ui/image"
import Spacer from "ui/spacer"
import Text from "ui/text"
import VStack from "ui/v-stack"

export default function ContextMenu({
  isPresented,
  position,
  action
}: {
  isPresented: BoolBinding,
  position: { x: number, y: number },
  action?: () => void
}) {
  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-10"
        onClick={() => isPresented.toggle()}
      />

      {/* Context Menu */}
      <VStack
        widthClassName="w-45"
        paddingClassName="p-1.25"
        borderClassName="rounded-xl"
        shadowClassName={
          "shadow-[0_11px_34px_rgba(0,0,0,.16)] " +
            "dark:shadow-[0_11px_34px_rgba(0,0,0,.65)]"
        }
        backgroundStyleClassName="bg-backgroundPrimary"
        positionClassName="fixed z-10 top-1/2 left-1/2"
        style={{
          top: position.y,
          left: position.x
        }}
      >
        <Button
          widthClassName="w-full"
          action={() => {
            action?.()
            isPresented.toggle()
          }}
        >
          <HStack
            widthClassName="w-full"
            heightClassName="h-7.5"
            borderClassName="rounded-lg"
            backgroundStyleClassName={
              "hover:bg-fillTertiary active:bg-music-keyColor/16"
            }
            foregroundStyleClassName="active:opacity-30 dark:active:opacity-40"
          >
            <Image
              systemName="info.circle"
              foregroundStyleClassName="fill-music-keyColor"
              widthClassName="w-3.25"
              marginClassName="mx-[8.5px]"
            />
            <Text
              textKey="Get Info"
              fontSizeClassName="text-sm"
              foregroundStyleClassName="text-labelPrimary"
              multilineTextAlignmentClassName="text-left"
            />
            <Spacer />
          </HStack>
        </Button>
      </VStack>
    </>,
    document.body
  )
}
