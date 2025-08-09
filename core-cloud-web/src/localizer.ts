//
//  localizer.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/9.
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

export class Localizer {
  private language: string
  private static _default: Localizer

  private constructor() {
    this.language = navigator.language
  }

  public static default() {
    if (this._default) {
      return this._default
    }
    this._default = new Localizer()
    return this._default
  }

  localize(key: string) {
    return Localizer.catalog[key]?.[this.language] ?? key
  }

  private static catalog: Partial<
    Record<
      string,
      Record<string, string>
    >
  > = {
    'Advanced Data Protection is On.': {
      'zh-TW': '「進階資料保護」已開啟。'
    },
    'All rights reserved.': {
      'zh-TW': '保留一切權利。'
    },
    'doesn\'t have access to display some of your data, including photos, videos, songs and files. Select an app to allow access using your master password.': {
      'zh-TW': '沒有權限顯示你的部分資料（例如照片、影片、歌曲、檔案等）。請選取可透過主密碼來允許存取的 App。'
    },
    'Customize Home Page': {
      'zh-TW': '自訂首頁'
    },
    'Settings': {
      'zh-TW': '設定'
    },
    'Sign Out': {
      'zh-TW': '登出'
    },
    'Version': {
      'zh-TW': '版本'
    }
  }
}
