//
//  shared-footer.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/3.
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

import Localizer from "@/localizer"

export default function SharedFooter() {
  return (
    <footer className="w-full py-7.5 bg-gray6 flex justify-center">
      <div
        className={
          "w-full text-[11px] text-labelSecondary leading-[2] flex-wrap " +
            "flex justify-between max-w-86.25 md:max-w-172.5 lg:max-w-258.75"
        }
      >
        <p>
          {Localizer.default().localize("Version")}
          {" 3.3-beta"}
        </p>
        <p>
          {"Copyright © 2025 "}
          <span
            dangerouslySetInnerHTML={{
              __html: process.env.NEXT_PUBLIC_TITLE ?? ""
            }}
          />
          {". "}
          {Localizer.default().localize("All rights reserved.")}
        </p>
      </div>
    </footer>
  )
}
