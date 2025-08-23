//
//  menu-item.tsx
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

import useMenuItem from '@/view-models/shared/toolbar/menu-item'

export default function MenuItem({
  text,
  role = 'default',
  onClick,
  children
}: {
  text: string,
  role?: 'default' | 'destructive',
  onClick?: () => void,
  /* Icon */
  children?: React.ReactNode
}) {
  const viewModel = useMenuItem({
    onClick: onClick
  })

  return (
    <button
      className={
        'p-2.5 md:p-1.25 rounded-[10px] flex items-center ' +
          'w-full hover:bg-fillTertiary cursor-pointer group ' + (
            role === 'destructive'
              ? 'active:bg-fillSecondary'
              : 'dark:active:bg-[rgba(0,153,255,.16)] ' +
                'active:bg-[rgba(0,113,227,.16)]'
          )

      }
      onClick={() => viewModel.handleOnClick()}
    >
      <div className="pl-1.25">
        {children}
      </div>
      <span
        className={
          'text-sm leading-5 mx-1.5 ' + (
            role === 'destructive'
              ? 'text-systemRed group-active:opacity-60'
              : 'text-labelPrimary group-active:text-labelQuaternary'
          )
        }
      >
        {text}
      </span>
    </button>
  )
}
