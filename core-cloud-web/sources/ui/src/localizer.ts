//
//  localizer.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/24.
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

export default class NewLocalizer {
  private language: string
  private static _default: NewLocalizer

  private constructor() {
    this.language = navigator.language
  }

  public static get default(): NewLocalizer {
    if (NewLocalizer._default) {
      return NewLocalizer._default
    }
    NewLocalizer._default = new NewLocalizer()
    return NewLocalizer._default
  }

  public localize(key: string): string {
    return NewLocalizer.catalog[key]?.[this.language] ?? key
  }

  private static catalog: Partial<
    Record<
      string,
      Record<string, string>
    >
  > = {
    "Albums": {
      "zh-TW": "專輯"
    },
    "Artists": {
      "zh-TW": "藝人"
    },
    "Library": {
      "zh-TW": "資料庫"
    },
    "Songs": {
      "zh-TW": "歌曲"
    },
    "Not Playing": {
      "zh-TW": "未在播放"
    }
  }
}
