//
//  icon.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/3.
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

import UIImage from '@/views/ui-image'
import UISFSymbol from '@/views/ui-sf-symbol'

export default function Icon({
  urls
}: {
  urls?: string[]
}) {
  if (urls && urls.filter(url => url !== '').length > 0) {
    return (
      <UIImage
        urls={urls}
        className="size-6 mr-0.5"
      />
    )
  } else {
    return (
      <UISFSymbol
        systemName="icloud"
        className="fill-systemBlack h-3.5 mr-0.5"
      />
    )
  }
}
