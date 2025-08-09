//
//  ui-progress.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/7/27.
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

export default function UIProgress({
  widthClassName = 'w-[6.8px]',
  heightClassName = 'h-0.5',
  marginClassName = '',
  transformClassName = '',
  translateX = 5.6,
  variant = '12'
}: {
  widthClassName?: string,
  heightClassName?: string,
  marginClassName?: string,
  transformClassName?: string,
  translateX?: number,
  variant?: '8' | '12'
}) {
  switch (variant) {
    case '8':
      const animations8 = [
        'animate-[0.833333s_linear_infinite_opacity-60-25-0-8]',
        'animate-[0.833333s_linear_infinite_opacity-60-25-1-8]',
        'animate-[0.833333s_linear_infinite_opacity-60-25-2-8]',
        'animate-[0.833333s_linear_infinite_opacity-60-25-3-8]',
        'animate-[0.833333s_linear_infinite_opacity-60-25-4-8]',
        'animate-[0.833333s_linear_infinite_opacity-60-25-5-8]',
        'animate-[0.833333s_linear_infinite_opacity-60-25-6-8]',
        'animate-[0.833333s_linear_infinite_opacity-60-25-7-8]'
      ]

      return (
        <div
          className={
            `relative ${marginClassName} ${transformClassName}`
          }
        >
          {
            animations8.map((animation, index) => (
              <div
                key={index}
                className={
                  `absolute ${animation} top-[-2px] opacity-25`
                }
            >
              <div
                className={
                  'absolute w-[10.5px] h-1 origin-[left_center] ' +
                    'rounded-full bg-[#737373] dark:bg-white ' +
                    'shadow-[rgba(0,0,0,0.1)_0px_0px_1px]'
                }
                style={{
                  //boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 1px',
                  transform: `rotate(${index * 45}deg) translate(6.25px, 0px)`
                }}
              />
              </div>
            ))
          }
        </div>
      )

    default:
      const animations12 = [
        'animate-[0.588235s_linear_infinite_opacity-60-25-0-12]',
        'animate-[0.588235s_linear_infinite_opacity-60-25-1-12]',
        'animate-[0.588235s_linear_infinite_opacity-60-25-2-12]',
        'animate-[0.588235s_linear_infinite_opacity-60-25-3-12]',
        'animate-[0.588235s_linear_infinite_opacity-60-25-4-12]',
        'animate-[0.588235s_linear_infinite_opacity-60-25-5-12]',
        'animate-[0.588235s_linear_infinite_opacity-60-25-6-12]',
        'animate-[0.588235s_linear_infinite_opacity-60-25-7-12]',
        'animate-[0.588235s_linear_infinite_opacity-60-25-8-12]',
        'animate-[0.588235s_linear_infinite_opacity-60-25-9-12]',
        'animate-[0.588235s_linear_infinite_opacity-60-25-10-12]',
        'animate-[0.588235s_linear_infinite_opacity-60-25-11-12]'
      ]

      return (
        <div className="realtive">
          {
            animations12.map((animation, index) => (
              <div
                key={index}
                className={`absolute -top-0.25 opacity-25 ${animation}`}
              >
                <div
                  className={
                    `absolute bg-systemBlack ${widthClassName} ` +
                      `origin-[left_center] rounded-[1px] ${heightClassName}`
                  }
                  style={{
                    transform: (
                      `rotate(${index * 30}deg) translate(${translateX}px, 0px)`
                    )
                  }}
                />
              </div>
            ))
          }
        </div>
      )
  }
}
