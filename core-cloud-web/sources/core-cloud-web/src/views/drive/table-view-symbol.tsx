//
//  table-view-symbol.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/16.
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

import UIImage from '../ui-image'

export default function TableViewSymbol({
  kind,
  applicationName,
  className,
  selected
}: {
  kind: string,
  applicationName?: string,
  className?: string,
  selected?: boolean
}) {
  switch (kind) {
    case 'Apple MPEG-4 Audio': return (
      <svg
        width="22"
        height="24"
        viewBox="0 0 22 24"
        className={
          `${className} ` + (
            selected
              ? 'fill-systemWhite'
              : 'fill-systemPink'
          )
        }
      >
        <path
          d={
            'M8.736 0c.667 0 1.19.523 1.19 1.18v20.907c0 .656-.523 1.16' +
              '9-1.19 1.169a1.153 1.153 0 01-1.158-1.17V1.18C7.578.523 ' +
              '8.09 0 8.736 0zm7.578 2.215c.666 0 1.19.533 1.19 1.19v16' +
              '.457c0 .656-.524 1.179-1.19 1.179a1.162 1.162 0 01-1.159' +
              '-1.18V3.405c0-.656.513-1.19 1.159-1.19zM4.953 3.507c.656' +
              ' 0 1.179.533 1.179 1.19V18.56c0 .656-.523 1.179-1.18 1.1' +
              '79a1.164 1.164 0 01-1.168-1.18V4.697c0-.656.512-1.19 1.1' +
              '69-1.19zm7.577 1.59c.657 0 1.18.532 1.18 1.189V16.98a1.1' +
              '7 1.17 0 01-1.18 1.17 1.162 1.162 0 01-1.169-1.17V6.286c' +
              '0-.657.513-1.19 1.17-1.19zM20.108 6.9c.656 0 1.18.533 1.' +
              '18 1.18v7.095c0 .656-.524 1.169-1.18 1.169a1.156 1.156 0' +
              ' 01-1.169-1.17V8.08c0-.646.513-1.18 1.169-1.18zm-18.95.5' +
              '54c.667 0 1.19.533 1.19 1.189v5.978c0 .646-.523 1.169-1.' +
              '19 1.169A1.16 1.16 0 010 14.622V8.644c0-.656.513-1.19 1.' +
              '159-1.19z'
          }
        />
      </svg>
    )

    case 'Application Library': return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="205"
        height="168"
        viewBox="0 0 205 168"
        className={
          `${className} ` + (
            selected
              ? 'fill-systemWhite'
              : (
                applicationName === 'Music'
                  ? 'fill-systemPink'
                  : 'fill-systemCyan'
              )
          )
        }
      >
        <path
          className="folder-icon"
          d={
            'M131.024 64.001c.203 12.008 1.668 16.8 4.25 21.629 2.789 5.214 ' +
              '6.882 9.307 12.096 12.096 5.215 2.789 10.388 4.274 24.652 ' +
              '4.274H205v37.469c0 18.77-9.29 28.339-25.154 ' +
              '28.528l-.482.003H28.344C9.478 168 0 158.52 0 ' +
              '139.469V64ZM50.641 0c8.936 0 13.54 1.645 19.498 6.763l5.506 ' +
              '4.57c4.514 3.929 8.215 5.391 14.353 5.391H131V52H0V27.508C0 ' +
              '9.138 9.117 0 24.914 0Z'
          }
        />
        <foreignObject x="144" y="-30" width="118" height="118">
          <UIImage
            urls={
              applicationName === 'Music'
                ? process.env.NEXT_PUBLIC_MUSIC_ICON_URLS?.split(',') ?? []
                : []
            }
            className="h-full w-full"
          />
        </foreignObject>
      </svg>
    )

    case 'Folder': return (
      <svg
        width="27"
        height="18.66"
        viewBox="0 0 27 18.66"
        xmlns="http://www.w3.org/2000/svg"
        className={
          `${className} ` + (
            selected
              ? 'fill-systemWhite'
              : 'fill-systemPink'
          )
        }
      >
        <path
          d={
            'M0 5.597h22v-.748C22 2.823 20.973 1.8 18.958 1.8h-9.3c-.65' +
              '8 0-1.056-.157-1.54-.58l-.59-.492C6.887.177 6.393 0 5.43' +
              '4 0h-2.76C.978 0 0 .984 0 2.96v2.637zm0 9.354C0 16.987 1' +
              '.017 18 3.042 18h16.207C20.983 18 22 16.977 22 14.95V6.8' +
              '86H0v8.066z'
          }
        />
      </svg>
    )

    default: return null
  }
}
