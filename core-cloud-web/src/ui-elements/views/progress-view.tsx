//
//  progress-view.tsx
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

export default function ProgressView({
  widthClassName = 'w-[6.8px]',
  heightClassName = 'h-0.5',
  translateX = 5.6,
  variant = '12'
}: {
  widthClassName?: string,
  heightClassName?: string,
  translateX?: number,
  variant?: '12'
}) {
  switch (variant) {
    default:
      const animations = [
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
            animations.map((animation, index) => (
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
