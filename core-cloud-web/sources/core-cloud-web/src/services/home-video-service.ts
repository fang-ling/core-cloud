//
//  home-video-service.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/10/5.
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

import HomeVideo from "@/models/home-video"

namespace HomeVideoService {
  export async function insertHomeVideo(
    request: HomeVideo.Singular.Input.Insertion
  ) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/home-video`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
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

  export async function fetchHomeVideos(
    request: HomeVideo.Plural.Input.Retrieval
  ) {
    try {
      const queryString = new URLSearchParams(request).toString()

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/home-videos?${queryString}`,
        { method: "GET" }
      )
      if (response.status === 200) {
        return (await response.json()) as HomeVideo.Plural.Output.Retrieval[]
      } else {
        throw new Error()
      }
    } catch {
      return []
    }
  }
}
export default HomeVideoService
