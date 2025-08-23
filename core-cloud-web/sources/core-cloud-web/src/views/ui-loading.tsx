//
//  ui-loading.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/10.
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

export default function UILoading() {
  return (
    <div
      className="animate-[fadeIn_.25s_ease-in-out_forwards] flex items-center"
    >
      <div
        className={
          'size-2 rounded-full mx-1.25 bg-gray3 ' +
            'animate-[loading-dots-dot_1.5s_infinite_forwards]'
        }
        style={{ animationDelay: '.25s' }}
      />
      <div
        className={
          'size-2 rounded-full mx-1.25 bg-gray3 ' +
            'animate-[loading-dots-dot_1.5s_infinite_forwards]'
        }
        style={{ animationDelay: '.75s' }}
      />
      <div
        className={
          'size-2 rounded-full mx-1.25 bg-gray3 ' +
            'animate-[loading-dots-dot_1.5s_infinite_forwards]'
        }
        style={{ animationDelay: '1.25s' }}
      />
    </div>
  )
}
