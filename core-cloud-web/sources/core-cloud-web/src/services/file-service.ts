//
//  file-service.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/23.
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

import File from "@/models/file"

namespace FileService {
  export async function fetchFiles(
    request: File.Plural.Input.Retrieval
  ): Promise<File.Plural.Output.Retrieval> {
    try {
      const queryString = new URLSearchParams(request).toString()

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/files?${queryString}`,
        {
          method: "GET"
        }
      )
      if (response.status === 200) {
        return await response.json()
      } else {
        throw new Error()
      }
    } catch {
      return []
    }
  }

  export async function insertFile() {

  }
}
export default FileService
