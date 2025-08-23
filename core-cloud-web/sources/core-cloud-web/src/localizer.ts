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

export default class Localizer {
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

  public localize(key: string) {
    return Localizer.catalog[key]?.[this.language] ?? key
  }

  public nameOrder() {
    let order: "firstNameLastName" | "lastNameFirstName" = "firstNameLastName"
    if (this.language === "zh-TW") {
      order = "lastNameFirstName"
    }
    return order
  }

  private static catalog: Partial<
    Record<
      string,
      Record<string, string>
    >
  > = {
    "8 or more characters": {
      "zh-TW": "必須包含 8 個以上字元"
    },
    "Advanced Data Protection is On.": {
      "zh-TW": "「進階資料保護」已開啟。"
    },
    "All rights reserved.": {
      "zh-TW": "保留一切權利。"
    },
    "Already have a *X* Account?": {
      "zh-TW": "已經有 *X* 帳號？"
    },
    "Apple MPEG-4 Audio": {
      "zh-TW": "Apple MPEG-4 音訊"
    },
    "Application Library": {
      "zh-TW": "應用程式庫"
    },
    "At least 1 lowercase letter": {
      "zh-TW": "至少 1 個小寫字母"
    },
    "At least 1 number": {
      "zh-TW": "至少 1 個數字"
    },
    "At least 1 uppercase letter": {
      "zh-TW": "至少 1 個大寫字母"
    },
    "At least 8 characters": {
      "zh-TW": "至少 8 個字元"
    },
    "At least one number": {
      "zh-TW": "必須包含至少一個數字"
    },
    "At least one special character": {
      "zh-TW": "至少一個特殊字元"
    },
    "Avoid using a password that you use with other websites or that might be easy for someone else to guess.": {
      "zh-TW": "請避免使用容易猜到的密碼，或是已用於其他網站的密碼。"
    },
    "Cancel": {
      "zh-TW": "取消"
    },
    "Cannot verify this email address.": {
      "zh-TW": "無法驗證電子郵件地址。"
    },
    "Check the account information you entered and try again.": {
      "zh-TW": "請檢查輸入的帳號資訊，然後再試一次。"
    },
    "Choose a Disk": {
      "zh-TW": "選擇磁碟"
    },
    "Choose a File": {
      "zh-TW": "選擇檔案"
    },
    "Confirm Master Password": {
      "zh-TW": "確認主密碼"
    },
    "Confirm Password": {
      "zh-TW": "確認密碼"
    },
    "Continue": {
      "zh-TW": "繼續"
    },
    "Create": {
      "zh-TW": "建立"
    },
    "Create Your *X* Account": {
      "zh-TW": "建立你的 *X* 帳號"
    },
    "Create *X* Account": {
      "zh-TW": "建立 *X* 帳號"
    },
    "Customize Home Page": {
      "zh-TW": "自訂首頁"
    },
    "Date": {
      "zh-TW": "日期"
    },
    "Done": {
      "zh-TW": "完成"
    },
    "Drive": {
      "zh-TW": "雲碟"
    },
    "Enter a valid email address to use as your primary email address.": {
      "zh-TW": "請輸入有效的電子郵件地址，來作為你的主要電子郵件地址。"
    },
    "Enter Master Password": {
      "zh-TW": "輸入主密碼"
    },
    "Enter your first name.": {
      "zh-TW": "輸入你的名字。"
    },
    "Enter your last name.": {
      "zh-TW": "輸入你的姓氏。"
    },
    "Enter your master password": {
      "zh-TW": "輸入你的主密碼"
    },
    "Email or Phone Number": {
      "zh-TW": "電子郵件地址或電話號碼"
    },
    "Files which you've opened recently will appear here.": {
      "zh-TW": "最近開啟的檔案會顯示於此處。"
    },
    "First Name": {
      "zh-TW": "名字"
    },
    "Folder": {
      "zh-TW": "檔案夾"
    },
    "Forgot password?": {
      "zh-TW": "忘記密碼？"
    },
    "Keep me signed in": {
      "zh-TW": "讓我保持登入"
    },
    "Kind": {
      "zh-TW": "種類"
    },
    "Last Name": {
      "zh-TW": "姓氏"
    },
    "Loading…": {
      "zh-TW": "載入中"
    },
    "Loading...": {
      "zh-TW": "正在載入…"
    },
    "Locations": {
      "zh-TW": "位置"
    },
    "Location Name": {
      "zh-TW": "位置名稱"
    },
    "Master Password": {
      "zh-TW": "主密碼"
    },
    "Music": {
      "zh-TW": "音樂"
    },
    "Name": {
      "zh-TW": "名稱"
    },
    "New File": {
      "zh-TW": "新檔案"
    },
    "New Location": {
      "zh-TW": "新位置"
    },
    "No items": {
      "zh-TW": "沒有項目"
    },
    "One *X* Account is all you need to access all *X* services.": {
      "zh-TW": "只要有 *X* 帳號，就能取得 *X* 所有服務。"
    },
    "Password": {
      "zh-TW": "密碼"
    },
    "Password incorrect.": {
      "zh-TW": "密碼不正確。"
    },
    "Password Requirements": {
      "zh-TW": "密碼要求"
    },
    "Recently Deleted": {
      "zh-TW": "最近刪除"
    },
    "Recents": {
      "zh-TW": "最近項目"
    },
    "Select Background Color": {
      "zh-TW": "選取背景顏色"
    },
    "Settings": {
      "zh-TW": "設定"
    },
    "Shared": {
      "zh-TW": "已共享"
    },
    "Shared files will appear here.": {
      "zh-TW": "共享的檔案會顯示於此處。"
    },
    "Sign In": {
      "zh-TW": "登入"
    },
    "Sign in with *X* Account": {
      "zh-TW": "使用 *X* 帳號登入"
    },
    "Sign Out": {
      "zh-TW": "登出"
    },
    "Size": {
      "zh-TW": "大小"
    },
    "Strength: ": {
      "zh-TW": "密碼強度："
    },
    "The master password cannot be the same as the *X* Account password.": {
      "zh-TW": "主密碼不能與 *X* 帳號密碼相同。"
    },
    "This folder is empty.": {
      "zh-TW": "此檔案夾是空的"
    },
    "This password will be used to derive the encryption keys for the majority of your *X* data, thereby protecting it using end-to-end encryption.": {
      "zh-TW": "這個密碼用於衍生出大部分 *X* 資料的加密密鑰，藉此採取端對端加密方式保護資料。"
    },
    "The passwords you entered do not match.": {
      "zh-TW": "你輸入的密碼不相符。"
    },
    "This email address is not available. Choose a different address.": {
      "zh-TW": "已有帳號使用此電子郵件地址。請選擇其他電子郵件地址。"
    },
    "This will be your new *X* Account.": {
      "zh-TW": "這將是你的新 *X* 帳號。"
    },
    "To allow *X* to access and display your data, you'll need to enter your master password.": {
      "zh-TW": "若要允許 *X* 存取並顯示你的資料，請輸入你的主密碼。"
    },
    "Try entering it again.": {
      "zh-TW": "請嘗試再輸入一次。"
    },
    "Upload": {
      "zh-TW": "上傳"
    },
    "Upper & lowercase letters": {
      "zh-TW": "必須包含大寫字母和小寫字母"
    },
    "Unable to create location. Try again later.": {
      "zh-TW": "無法建立位置。請稍後再試。"
    },
    "Unable to upload file. Try again later.": {
      "zh-TW": "無法上傳檔案。請稍後再試。"
    },
    "Version": {
      "zh-TW": "版本"
    },
    "*X* doesn't have access to display some of your data, including photos, videos, songs and files. Select an app to allow access using your master password.": {
      "zh-TW": "*X* 沒有權限顯示你的部分資料（例如照片、影片、歌曲、檔案等）。請選取可透過主密碼來允許存取的 App。"
    },
    "Your account cannot be created at this time.": {
      "zh-TW": "目前無法建立你的帳號。"
    },
    "Your *X* Account information is used to allow you to sign in securely and access your data. *X* records certain data for security, support and reporting purposes. The majority of your *X* data — including photos, videos, files and more — is protected using end-to-end encryption. No one else can access your end-to-end encrypted data, not even *X*, and this data remains secure even in the case of a data breach in the cloud.": {
      "zh-TW": "*X* 帳號資訊讓你能安全地登入並存取你的資料。*X* 會記錄與安全、支援和報告用途相關的特定資料。你的大部分 *X* 資料（包括照片、影片、檔案等等）均會使用端對端加密保護。其他人，甚至是 *X*，都無法取用端對端加密的資料。即使雲端出現資料外洩，這些資料仍能安全無虞。"
    },
    "%lld item(s)": {
      "zh-TW": "%lld 個項目"
    },
    "%lld used": {
      "zh-TW": "已使用 %lld"
    },
    ", ": {
      "zh-TW": "，"
    }
  }
}
