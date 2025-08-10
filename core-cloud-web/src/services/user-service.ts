//
//  user-service.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/7/30.
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

import User from '../models/user'

namespace UserService {
  export async function insertUser(
    request: User.Singular.Input.Insertion
  ) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/user`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request)
        }
      )
      if (response.status === 201) {
        return true
      } else {
        throw new Error()
      }
    } catch {
      return false
    }
  }

  export async function peekUser(
    request: User.Singular.Input.Peek
  ) {
    try {
      const queryString = new URLSearchParams(request).toString()

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/user?${queryString}`,
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
      return 'error'
    }
  }

  export async function fetchUser() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/user`,
        {
          method: 'GET'
        }
      )
      if (response.status === 200) {
        return (await response.json()) as User.Singular.Output.Retrieval
      } else {
        throw new Error()
      }
    } catch {
      return undefined
    }
  }
}
export default UserService
