//
//  setting-service.ts
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

import Setting from '@/models/setting'

namespace SettingService {
  export async function fetchSetting(
    request: Setting.Singular.Input.Retrieval
  ) {
    try {
      const queryString = new URLSearchParams(request).toString()

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/setting?${queryString}`,
        {
          method: 'GET'
        }
      )
      if (response.status === 200) {
        return (await response.json()) as Setting.Singular.Output.Retrieval
      } else {
        throw new Error()
      }
    } catch {
      return undefined
    }
  }

  export async function modifySetting(
    request: Setting.Singular.Input.Modification
  ) {
    try {
      const queryString = new URLSearchParams(request).toString()

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/setting?${queryString}`,
        {
          method: 'PATCH'
        }
      )
      if (response.status === 200) {
        return true
      } else {
        throw new Error()
      }
    } catch {
      return false
    }
  }
}
export default SettingService
