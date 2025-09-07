//
//  shared-bodyguard.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/11.
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

import useSharedBodyguard from "@/view-models/shared-bodyguard"
import { BoolBinding } from "ui/binding"
import VStack from "ui/v-stack"
import Spacer from "ui/spacer"
import Text from "ui/text"
import Image from "ui/image"
import ProgressView from "ui/progress-view"
import HStack from "ui/h-stack"
import NewLocalizer from "ui/localizer"
import SecureField from "ui/secure-field"
import { useEffect } from "react"
import ZStack from "ui/z-stack"

export default function SharedBodyguard({
  isPassed,
  secureFieldTintClassName
}: {
  isPassed: BoolBinding,
  secureFieldTintClassName?: string
}) {
  const viewModel = useSharedBodyguard({
    isPassed: isPassed
  })

  useEffect(() => {
    viewModel.viewDidAppear()
  }, [])

  return (
    <VStack
      widthClassName="w-full"
      heightClassName="h-full"
    >
      <Spacer />

      {viewModel.isLoading && <ProgressView size="large" style="dotted" />}

      {
        !viewModel.isLoading && (
          <>
            <Image
              systemName="lock.fill"
              widthClassName="w-11 fill-labelSecondary"
            />

            <Text
              textKey="Enter your master password"
              marginClassName="mt-4"
              foregroundStyleClassName="text-labelPrimary"
              fontSizeClassName="text-base"
              lineHeightClassName="leading-5.25"
              fontWeightClassName="font-semibold"
              multilineTextAlignmentClassName="text-center"
            />

            <HStack widthClassName="max-w-75">
              <Text
                verbatimContent={
                  NewLocalizer
                    .default
                    .localize(
                      "To allow *X* to access and display your data, " +
                        "you'll need to enter your master password."
                    )
                    .replace("*X*", process.env.NEXT_PUBLIC_TITLE ?? "")
                }
                foregroundStyleClassName="text-labelSecondary"
                multilineTextAlignmentClassName="text-center"
                fontSizeClassName="text-[15px]"
                lineHeightClassName="leading-5"
                marginClassName="mt-1"
              />
            </HStack>

            <SecureField
              text={viewModel.masterPassword}
              prompt="Enter Master Password"
              marginClassName="mt-4"
              widthClassName="w-60"
              heightClassName="h-8"
              paddingClassName="px-[7.05px] py-0.75"
              borderClassName={
                "rounded-lg border border-separator outline-hidden"
              }
              foregroundStyleClassName="text-labelPrimary"
              fontSizeClassName="text-[15px]"
              promptMultilineTextAlignmentClassName="placeholder:text-center"
              tintClassName={secureFieldTintClassName}
              onChange={() => viewModel.masterPasswordDidChange()}
              autocompletionDisabled={true}
              autocapitalizationDisabled={true}
              autocorrectionDisabled={true}
              onSubmit={() => viewModel.masterPasswordDidSubmit()}
            />

            {
              viewModel.isWrongPassword && (
                <ZStack
                  positionClassName="top-14"
                  widthClassName="max-w-75 w-full"
                  marginClassName="mx-auto"
                  animationClassName="animate-[fade-in_.2s_ease-in-out]"
                >
                  <VStack
                    positionClassName="absolute left-1/2"
                    marginClassName="-ml-[50%] mt-1.25"
                    paddingClassName="p-2.75"
                    widthClassName="w-full"
                    backgroundStyleClassName="bg-[#fae9a3]"
                    borderClassName="rounded-[5px] border border-[#b9950178]"
                    shadowClassName="shadow-[0_5px_10px_2px_rgba(0,0,0,.1)]"
                  >
                    <HStack
                      widthClassName="w-3.75"
                      heightClassName="h-3.75"
                      positionClassName="absolute left-[47.2%] -top-2"
                      backgroundStyleClassName="bg-[#fae9a3]"
                      transformationClassName="rotate-135 skew-5"
                      borderClassName="border-l border-[#b9950178] border-b"
                      shadowClassName="shadow-[-1px_1px_2px_-1px_#b9950178]"
                    />
                    <Text
                      textKey="Password incorrect."
                      multilineTextAlignmentClassName="text-center"
                      fontWeightClassName="font-semibold"
                      fontSizeClassName="text-sm"
                      lineHeightClassName="leading-5"
                      foregroundStyleClassName="text-[#503e30]"
                    />
                    <Text
                      textKey="Try entering it again."
                      multilineTextAlignmentClassName="text-center"
                      fontWeightClassName="font-semibold"
                      fontSizeClassName="text-sm"
                      lineHeightClassName="leading-5"
                      foregroundStyleClassName="text-[#503e30]"
                    />
                  </VStack>
                </ZStack>
              )
            }
          </>
        )
      }

      <Spacer />

    </VStack>
  )
}
