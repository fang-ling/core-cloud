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
    "Add to Your Library": {
      "zh-TW": "加入到你的資料庫"
    },
    "Album": {
      "zh-TW": "專輯"
    },
    "Albums": {
      "zh-TW": "專輯"
    },
    "Anime": {
      "zh-TW": "日本動畫"
    },
    "Apple MPEG-4 Audio": {
      "zh-TW": "Apple MPEG-4 音訊"
    },
    "Application Library": {
      "zh-TW": "應用程式庫"
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
    "Audio Codec": {
      "zh-TW": "音訊編碼"
    },
    "Browse millions of songs and collect your favorites here.": {
      "zh-TW": "瀏覽上億首歌曲，並將你的喜好項目收藏於此。"
    },
    "Browse thousands of movies and TV shows.": {
      "zh-TW": "瀏覽上千部電影和電視節目。"
    },
    "Cast": {
      "zh-TW": "演員"
    },
    "Choose a File": {
      "zh-TW": "選擇檔案"
    },
    "Choose an Album": {
      "zh-TW": "選擇專輯"
    },
    "Clear": {
      "zh-TW": "清除"
    },
    "Create": {
      "zh-TW": "建立"
    },
    "Date": { /* Duplicate with the old localizer. */
      "zh-TW": "日期"
    },
    "Description": {
      "zh-TW": "描述"
    },
    "Details": {
      "zh-TW": "詳細資訊"
    },
    "Director": {
      "zh-TW": "導演"
    },
    "Disc Number": {
      "zh-TW": "光碟編號"
    },
    "Disc %lld": {
      "zh-TW": "光碟%lld"
    },
    "Drive": {
      "zh-TW": "雲碟"
    },
    "Duration": {
      "zh-TW": "時長"
    },
    "End Year": {
      "zh-TW": "結束年份"
    },
    "Enter Master Password": {
      "zh-TW": "輸入主密碼"
    },
    "Enter your master password": {
      "zh-TW": "輸入你的主密碼"
    },
    "Episode Number": {
      "zh-TW": "單集"
    },
    "File": {
      "zh-TW": "檔案"
    },
    "Genre": {
      "zh-TW": "類型"
    },
    "Get Info": {
      "zh-TW": "取得資訊"
    },
    "Home Videos": {
      "zh-TW": "本機影片"
    },
    "Height": {
      "zh-TW": "高度"
    },
    "Instrumental": {
      "zh-TW": "演奏曲"
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
    "MPEG-4 Movie": {
      "zh-TW": "MPEG-4 影片"
    },
    "Music": {
      "zh-TW": "音樂"
    },
    "Name": { /* Duplicate with the old localizer. */
      "zh-TW": "名稱"
    },
    "New Album": {
      "zh-TW": "新專輯"
    },
    "New Episode": {
      "zh-TW": "新劇集"
    },
    "New File": {
      "zh-TW": "新檔案"
    },
    "New Home Video": {
      "zh-TW": "新本機影片"
    },
    "New Song": {
      "zh-TW": "新歌曲"
    },
    "New TV Show": {
      "zh-TW": "新電視節目"
    },
    "No upcoming songs.": {
      "zh-TW": "沒有即將播放的歌曲。"
    },
    "Not Playing": {
      "zh-TW": "未在播放"
    },
    "Password incorrect.": {
      "zh-TW": "密碼不正確。"
    },
    "Play": {
      "zh-TW": "播放"
    },
    "Play Count": {
      "zh-TW": "播放次數"
    },
    "Playing Next": {
      "zh-TW": "待播清單"
    },
    "Pop": {
      "zh-TW": "流行樂"
    },
    "Popular": {
      "zh-TW": "熱門"
    },
    "Poster URL": {
      "zh-TW": "海報連結"
    },
    "Regions of Origin": {
      "zh-TW": "製作地區"
    },
    "Sample Rate": {
      "zh-TW": "取樣頻率"
    },
    "Sample Size": {
      "zh-TW": "取樣大小"
    },
    "Season Number": {
      "zh-TW": "季"
    },
    "Shuffle": {
      "zh-TW": "隨機播放"
    },
    "Songs": {
      "zh-TW": "歌曲"
    },
    "Soundtrack": {
      "zh-TW": "原聲帶"
    },
    "Starring": {
      "zh-TW": "主演"
    },
    "Start Year": {
      "zh-TW": "起始年份"
    },
    "Studio": {
      "zh-TW": "製片商"
    },
    "Tag": {
      "zh-TW": "標籤"
    },
    "The file contains HDR content": {
      "zh-TW": "檔案包含 HDR 內容"
    },
    "The song is popular on this album": {
      "zh-TW": "歌曲在專輯中受歡迎"
    },
    "Title": {
      "zh-TW": "名稱"
    },
    "Title Logo URL": {
      "zh-TW": "名稱標誌連結"
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
    "TV": {
      "zh-TW": "TV"
    },
    "TV Show": {
      "zh-TW": "電視節目"
    },
    "TV Shows": {
      "zh-TW": "電視節目"
    },
    "Unable to create album. Try again later.": {
      "zh-TW": "無法建立專輯。請稍後再試。"
    },
    "Unable to create episode. Try again later.": {
      "zh-TW": "無法建立劇集。請稍後再試。"
    },
    "Unable to create home video. Try again later.": {
      "zh-TW": "無法建立本機影片。請稍後再試。"
    },
    "Unable to create song. Try again later.": {
      "zh-TW": "無法建立歌曲。請稍後再試。"
    },
    "Unable to create tv show. Try again later.": {
      "zh-TW": "無法建立電視節目。請稍後再試。"
    },
    "Unable to upload file. Try again later.": {
      "zh-TW": "無法上傳檔案。請稍後再試。"
    },
    "Upload": {
      "zh-TW": "上傳"
    },
    "Uploading...": {
      "zh-TW": "上傳中…"
    },
    "Video Codec": {
      "zh-TW": "影片編碼"
    },
    "Width": {
      "zh-TW": "寬度"
    },
    "Year": {
      "zh-TW": "年份"
    },
    "%lld item(s)": {
      "zh-TW": "%lld個項目"
    }
  }
}
