//
//  core-cloud-web.ts
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

import Localizer from './localizer'

namespace CoreCloudWeb {
  export const APPS = [
    {
      urls: process.env.NEXT_PUBLIC_DRIVE_ICON_URLS?.split(',') ?? [],
      name: Localizer.default().localize('Drive'),
      href: '/drive'
    }
  ]
}
export default CoreCloudWeb
