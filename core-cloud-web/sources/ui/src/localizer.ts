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
    "Add Music to Your Library": {
      "zh-TW": "將音樂加入資料庫"
    },
    "Album": {
      "zh-TW": "專輯"
    },
    "Albums": {
      "zh-TW": "專輯"
    },
    "Artist": {
      "zh-TW": "藝人"
    },
    "Artists": {
      "zh-TW": "藝人"
    },
    "Artwork URL": {
      "zh-TW": "插圖連結"
    },
    "Browse millions of songs and collect your favorites here.": {
      "zh-TW": "瀏覽上億首歌曲，並將你的喜好項目收藏於此。"
    },
    "Choose a File": {
      "zh-TW": "選擇檔案"
    },
    "Create": {
      "zh-TW": "建立"
    },
    "Details": {
      "zh-TW": "詳細資訊"
    },
    "Disc Number": {
      "zh-TW": "光碟編號"
    },
    "Duration": {
      "zh-TW": "時長"
    },
    "Enter Master Password": {
      "zh-TW": "輸入主密碼"
    },
    "Enter your master password": {
      "zh-TW": "輸入你的主密碼"
    },
    "Genre": {
      "zh-TW": "類型"
    },
    "Get Info": {
      "zh-TW": "取得資訊"
    },
    "Keep me signed in": {
      "zh-TW": "讓我保持登入"
    },
    "Library": {
      "zh-TW": "資料庫"
    },
    "Loading...": {
      "zh-TW": "正在載入…"
    },
    "Name": { /* Duplicate with the old localizer. */
      "zh-TW": "名稱"
    },
    "New Album": {
      "zh-TW": "新專輯"
    },
    "New File": {
      "zh-TW": "新檔案"
    },
    "New Song": {
      "zh-TW": "新歌曲"
    },
    "Not Playing": {
      "zh-TW": "未在播放"
    },
    "Password incorrect.": {
      "zh-TW": "密碼不正確。"
    },
    "Play Count": {
      "zh-TW": "播放次數"
    },
    "Popular": {
      "zh-TW": "熱門"
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
    "The song is popular on this album": {
      "zh-TW": "歌曲在專輯中受歡迎"
    },
    "Title": {
      "zh-TW": "名稱"
    },
    "To allow *X* to access and display your data, you'll need to enter your \
master password.": {
       "zh-TW": "若要允許 *X* 存取並顯示你的資料，請輸入你的主密碼。"
    },
    "Track Number": {
      "zh-TW": "音軌編號"
    },
    "Try entering it again.": {
      "zh-TW": "請嘗試再輸入一次。"
    },
    "Year": {
      "zh-TW": "年份"
    },
    "Unable to create album. Try again later.": {
      "zh-TW": "無法建立專輯。請稍後再試。"
    },
    "Unable to create song. Try again later.": {
      "zh-TW": "無法建立歌曲。請稍後再試。"
    },
    "Unable to upload file. Try again later.": {
      "zh-TW": "無法上傳檔案。請稍後再試。"
    },
    "Upload": {
      "zh-TW": "上傳"
    },
    "Uploading...": {
      "zh-TW": "上傳中…"
    }
  }
}
