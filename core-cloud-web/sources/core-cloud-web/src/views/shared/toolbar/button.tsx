//
//  button.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/9.
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

import useButton from '@/view-models/shared/toolbar/button'

export default function Button({
  children,
  onClick,
  isOpen = false
}: {
  children: React.ReactNode,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  isOpen?: boolean
}) {
  const viewModel = useButton({
    onClick: onClick
  })

  return (
    <button
      className={
        'size-9 min-w-9 mx-1 rounded-lg flex items-center justify-center ' +
          'cursor-pointer group ' + (
            isOpen
              ? 'bg-[hsla(240,4.7,79,.5)] dark:bg-[hsl(240,1.4,29)] ' +
                'text-backgroundPrimary'
              : 'hover:bg-fillSecondary active:bg-fillPrimary ' +
                'active:text-labelQuaternary text-labelPrimary'
          )
      }
      onClick={(event) => viewModel.handleOnClick(event)}
    >
      {children}
    </button>
  )
}
