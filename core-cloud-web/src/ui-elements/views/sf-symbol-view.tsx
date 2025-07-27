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
  'arrowshape.right.circle' |
  'exclamationmark.circle' |
  'icloud.fill'
)

export default function SFSymbolView({
  systemName,
  variant = 'regular',
  className
}: {
  systemName: SystemName,
  variant?: 'regular' | 'thin',
  className?: string
}) {
  switch (systemName) {
    case 'arrowshape.right.circle':
      switch (variant) {
        case 'thin': return (
          <svg
            className={className}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 15.7306 15.3266"
          >
            <g>
              <path
                d={
                  'M7.65939 15.3188C11.8947 15.3188 15.3244 11.8891 15.3244 ' +
                    '7.65939C15.3244 3.42407 11.8947 0 7.65939 0C3.42969 0 0 ' +
                    '3.42407 0 7.65939C0 11.8891 3.42969 15.3188 7.65939 ' +
                    '15.3188ZM7.65939 14.7219C3.7569 14.7219 0.596905 ' +
                    '11.5619 0.596905 7.65939C0.596905 3.75127 3.7569 ' +
                    '0.59128 7.65939 0.59128C11.5675 0.59128 14.7275 ' +
                    '3.75127 14.7275 7.65939C14.7275 11.5619 11.5675 ' +
                    '14.7219 7.65939 14.7219Z'
                }
              />
              <path
                d={
                  'M12.4184 7.65939C12.4184 7.53564 12.3806 7.40532 12.1625 ' +
                    '7.19283L8.59283 3.88002C8.47532 3.77033 8.36845 3.70127 ' +
                    '8.22157 3.70127C8.00907 3.70127 7.88813 3.85471 7.88813 ' +
                    '4.05721L7.88813 6.07751L3.94064 6.07751C3.3797 6.07751 ' +
                    '3.07095 6.37064 3.07095 6.91814L3.07095 8.4422C3.07095 ' +
                    '8.98751 3.3797 9.28064 3.94064 9.28064L7.88813 ' +
                    '9.28064L7.88813 11.2603C7.88813 11.465 8.00907 11.6175 ' +
                    '8.2172 11.6175C8.36626 11.6175 8.48189 11.5428 8.59283 ' +
                    '11.4419L12.1625 8.12376C12.3806 7.91126 12.4184 7.78095 ' +
                    '12.4184 7.65939Z'
                }
              />
            </g>
          </svg>
        )

        default: return null
      }

    case 'exclamationmark.circle':
      switch (variant) {
        case 'thin': return null

        default: return (
          <svg
            className={className}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 16.3438 15.9453"
          >
            <g>
              <path
                d={
                  'M7.96875 15.9375C12.3672 15.9375 15.9375 12.3672 15.9375 ' +
                    '7.96875C15.9375 3.57031 12.3672 0 7.96875 0C3.57031 0 0 ' +
                    '3.57031 0 7.96875C0 12.3672 3.57031 15.9375 7.96875 ' +
                    '15.9375ZM7.96875 14.6094C4.29688 14.6094 1.32812 ' +
                    '11.6406 1.32812 7.96875C1.32812 4.29688 4.29688 1.32812 ' +
                    '7.96875 1.32812C11.6406 1.32812 14.6094 4.29688 14.6094 ' +
                    '7.96875C14.6094 11.6406 11.6406 14.6094 7.96875 14.6094Z'
                }
              />
              <path
                d={
                  'M7.96094 9.375C8.32812 9.375 8.54688 9.16406 8.55469 ' +
                    '8.75781L8.67188 4.63281C8.67969 4.23438 8.36719 3.9375 ' +
                    '7.95312 3.9375C7.53125 3.9375 7.23438 4.22656 7.24219 ' +
                    '4.625L7.34375 8.75781C7.35156 9.15625 7.57031 9.375 ' +
                    '7.96094 9.375ZM7.96094 11.9141C8.40625 11.9141 8.79688 ' +
                    '11.5547 8.79688 11.1016C8.79688 10.6484 8.41406 10.2891 ' +
                    '7.96094 10.2891C7.5 10.2891 7.11719 10.6562 7.11719 ' +
                    '11.1016C7.11719 11.5469 7.50781 11.9141 7.96094 11.9141Z'
                }
              />
            </g>
          </svg>
        )
      }

    case 'icloud.fill':
      switch (variant) {
        default: return (
          <svg
            version="1.1"
            viewBox="0 0 19.6406 13.5781"
            className={className}
          >
            <g>
              <path
                d={
                  'm 15.4375,13.5781 c 2.3594,0 4.2031,-1.7265 ' +
                    '4.2031,-3.87498 C 19.6406,8.0625 18.6953,6.64062 ' +
                    '17.1719,6 17.1875,2.51562 14.6797,0 11.4844,0 ' +
                    '9.36719,0 7.85938,1.13281 6.92188,2.5 5,1.9375 ' +
                    '2.90625,3.39844 2.86719,5.58594 1.10156,5.86719 ' +
                    '0,7.44531 0,9.35156 0,11.6484 2.00781,13.5781 ' +
                    '4.67969,13.5781 Z'
                }
              />
            </g>
          </svg>
        )
      }
  }
}
