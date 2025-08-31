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
    "Artist": {
      "zh-TW": "藝人"
    },
    "Artists": {
      "zh-TW": "藝人"
    },
    "Create": {
      "zh-TW": "建立"
    },
    "Disc Number": {
      "zh-TW": "光碟編號"
    },
    "Genre": {
      "zh-TW": "類型"
    },
    "Library": {
      "zh-TW": "資料庫"
    },
    "Loading...": {
      "zh-TW": "正在載入…"
    },
    "New Song": {
      "zh-TW": "新歌曲"
    },
    "Not Playing": {
      "zh-TW": "未在播放"
    },
    "Play Count": {
      "zh-TW": "播放次數"
    },
    "Sample Rate": {
      "zh-TW": "取樣頻率"
    },
    "Sample Size": {
      "zh-TW": "取樣大小"
    },
    "Songs": {
      "zh-TW": "歌曲"
    },
    "Soundtrack": {
      "zh-TW": "原聲帶"
    },
    "Title": {
      "zh-TW": "名稱"
    },
    "Track Number": {
      "zh-TW": "音軌編號"
    },
    "Year": {
      "zh-TW": "年份"
    },
    "Unable to create song. Try again later.": {
      "zh-TW": "無法建立歌曲。請稍後再試。"
    }
  }
}
