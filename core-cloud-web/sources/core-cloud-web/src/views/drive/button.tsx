//
//  button.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/12.
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

import useButton from '@/view-models/drive/button'

export default function Button({
  children,
  className,
  disabled,
  onClick
}: {
  children: React.ReactNode,
  className?: string,
  disabled?: boolean,
  onClick?: () => void
}) {
  const viewModel = useButton({
    onClick: onClick
  })

  return (
    <button
      className={
        'h-7 min-w-7 px-1.5 fill-appTint rounded-lg flex items-center ' +
          'justify-center hover:bg-fillTertiary active:fill-appTint/30 ' +
          'active:bg-appTint/16 ' +
          `${className} ` + (
            disabled
              ? 'opacity-30 dark:opacity-40 pointer-events-none cursor-default'
              : 'cursor-pointer'
          )
      }
      onClick={() => viewModel.handleButtonClick()}
    >
      {children}
    </button>
  )
}
