//
//  sf-symbol-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/7/26.
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

type SystemName = (
  'icloud.fill'
)

export default function SFSymbolView({
  systemName,
  className
}: {
  systemName: SystemName,
  className?: string
}) {
  switch (systemName) {
    case 'icloud.fill': return (
      <svg
        version="1.1"
        viewBox="0 0 19.6406 13.5781"
        className={className}
      >
        <g>
          <path
            d={
              'm 15.4375,13.5781 c 2.3594,0 4.2031,-1.7265 4.2031,-3.87498 C ' +
                '19.6406,8.0625 18.6953,6.64062 17.1719,6 17.1875,2.51562 ' +
                '14.6797,0 11.4844,0 9.36719,0 7.85938,1.13281 6.92188,2.5 ' +
                '5,1.9375 2.90625,3.39844 2.86719,5.58594 1.10156,5.86719 ' +
                '0,7.44531 0,9.35156 0,11.6484 2.00781,13.5781 ' +
                '4.67969,13.5781 Z'
            }
          />
        </g>
      </svg>
    )
  }
}
