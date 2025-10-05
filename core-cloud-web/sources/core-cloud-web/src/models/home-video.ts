//
//  home-video.ts
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

namespace HomeVideo {
  export namespace Singular {
    export namespace Input {
      export type Insertion = {
        title: string
        cast: string
        director: string
        genre: string
        tags: string
        date: number
        duration: number
        artworkURLs: string
        width: number
        height: number
        isHDR: boolean
        videoCodec: string
        audioCodec: string
        fileID: number
      }
    }
  }

  export namespace Plural {
    export namespace Input {
      export type Retrieval = {
        fields: string
        filters?: string
      }
    }

    export namespace Output {
      export type Retrieval = {
        id: number
        title?: string
        artworkURLs?: string
        fileID?: number
      }
    }
  }
}
export default HomeVideo
