//
//  application-token-service.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/17.
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

import ApplicationToken from '@/models/application-token'

namespace ApplicationTokenService {
  export async function insertApplicationToken(
    request: ApplicationToken.Singular.Input.Insertion
  ) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/application-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request)
        }
      )
      if (response.status === 201) {
        return true
      } else if (response.status === 401) {
        return false
      } else {
        throw new Error()
      }
    } catch {
      return false
    }
  }

  export async function peekApplicationToken() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/application-token`,
        {
          method: 'HEAD'
        }
      )
      if (response.status === 200) {
        return true
      } else if (response.status === 204) {
        return false
      } else {
        throw new Error()
      }
    } catch {
      return false
    }
  }
}
export default ApplicationTokenService
