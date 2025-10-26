//
//  tv-show.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/10/19.
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

namespace TVShow {
  export namespace Singular {
    export namespace Input {
      export type Insertion = {
        title: string
        starring: string
        genre: string
        startYear: number
        endYear: number
        region: string
        description: string
        posterURLs: string
        artworkURLs: string
        titleLogoURLs?: string
        studio: string
      }

      export type Retrieval = {
        id: string
      }
    }

    export namespace Output {
      export type Retrieval = {
        artworkURLs: string
        titleLogoURLs?: string
        title: string
        starring: string
        startYear: number
        endYear: number
        region: string
        description: string
        studio: string
        genre: string
      }
    }
  }

  export namespace Plural {
    export namespace Input {
      export type Retrieval = {
        fields: string
      }
    }

    export namespace Output {
      export type Retrieval = {
        id: number
        posterURLs?: string
      }
    }
  }
}
export default TVShow
