//
//  password-service.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/11/16.
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

import type { Password } from "../models/password"

export namespace PasswordService {
  export async function insertPassword(
    request: Password.Singular.Input.Insertion
  ) {
    try {
      const response = await fetch(
        "/api/password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(request)
        }
      )
      if (response.status === 201) {
        return (await response.json()) as Password.Singular.Output.Insertion
      } else {
        throw new Error()
      }
    } catch {
      return undefined
    }
  }

  export async function fetchPasswords(
    request: Password.Plural.Input.Retrieval
  ) {
    try {
      const queryString = new URLSearchParams(request).toString()

      const response = await fetch(
        `/api/passwords?${queryString}`,
        { method: "GET" }
      )
      if (response.status === 200) {
        return (await response.json()) as Password.Plural.Output.Retrieval[]
      } else {
        throw new Error()
      }
    } catch {
      return undefined
    }
  }

  export async function fetchPassword(
    request: Password.Singular.Input.Retrieval
  ) {
    try {
      const queryString = new URLSearchParams(request).toString()

      const response = await fetch(
        `/api/password?${queryString}`,
        { method: "GET" }
      )
      if (response.status === 200) {
        return (await response.json()) as Password.Singular.Output.Retrieval
      } else {
        throw new Error()
      }
    } catch {
      return undefined
    }
  }
}
