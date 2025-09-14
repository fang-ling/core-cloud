//
//  song.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/31.
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

namespace Song {
  export namespace Singular {
    export namespace Input {
      export type Insertion = {
        title: string
        artist: string
        trackNumber: number
        discNumber: number
        playCount: number
        sampleSize: number
        sampleRate: number
        isPopular: boolean
        duration: number
        fileID: number,
        albumID: number
      }

      export type Modification = {
        id: string
        playCount: string
      }

      export type Retrieval = {
        id: string
      }
    }

    export namespace Output {
      export type Retrieval = {
        playCount: number
      }
    }
  }

  export namespace Plural {
    export namespace Output {
      export type Retrieval = {
        id: number
        title: string
        artist: string
        albumName?: string
        artworkURLs?: string
        duration: number
        fileID: number
      }
    }
  }
}
export default Song
