//
//  home-app-card-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/6.
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

import Link from 'next/link'
import UIImageView from './ui-image-view'

export default function HomeAppCardView({
  apps
}: {
  apps: {
    urls: string[],
    name: string,
    href: string
  }[]
}) {
  return (
    <div className="w-78.75 lg:w-165 h-78.75 m-3.75">
      <div
        className={
          'w-78.75 lg:w-165 h-78.75 rounded-2xl lg:px-7.5 lg:py-8.75 p-5 ' +
            'backdrop-blur-[15px] backdrop-saturate-86 transition-[width] ' + (
              /* bg gradient */
              'bg-radial-[circle_at_100%_0px] from-[rgba(255,255,255,.85)] ' +
                'to-[rgba(245,245,245,.13)] to-183% ' +
                'dark:bg-radial-[circle_at_97%_3.3%] ' +
                'dark:from-[rgba(0,0,0,.35)] dark:to-[rgba(0,0,0,.6)] ' +
                'dark:to-164% '
            ) +
            'ease-[ease-in-out] duration-300'
        }
      >
        <div
          className={
            'grid grid-cols-4 lg:grid-cols-6 gap-x-4.25 lg:gap-x-7.5 ' +
              'gap-y-2.5 lg:gap-y-7.5'
          }
        >
          {
            apps.map((app, index) => (
              <Link
                key={index}
                href={app.href}
                className={
                  'min-w-14 lg:min-w-17.5 rounded-[10px] p-0.75 ' +
                    'duration-200 ease-[cubic-bezier(.32,.08,.24,1)] ' +
                    'hover:scale-3d hover:scale-x-105 hover:scale-y-105 ' +
                    'hover:scale-z-105 flex transition-transform ' +
                    'drop-shadow-[0_2px_10px_var(--theme-color-boxShadow)] ' +
                    'flex-col items-center'
                }
              >
                <UIImageView
                  urls={app.urls}
                  className="w-12.5 lg:w-17.5 object-contain"
                />
                <div
                  className={
                    'mt-3.75 lg:mt-3.75 text-xs lg:text-sm leading-3.5 ' +
                      'lg:leading-4.5 text-labelPrimary'
                  }
                >
                  {app.name}
                </div>
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  )
}
