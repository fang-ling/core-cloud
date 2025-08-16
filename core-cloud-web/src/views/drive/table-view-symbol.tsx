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

export default function TableViewSymbol({
  kind,
  className
}: {
  kind: string,
  className?: string
}) {
  switch (kind) {
    case 'Folder': return (
      <svg
        width="27"
        height="18.66"
        viewBox="0 0 27 18.66"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
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
