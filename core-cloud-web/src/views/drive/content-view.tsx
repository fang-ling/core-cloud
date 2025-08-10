//
//  content-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/10.
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

import CoreCloudWeb from '@/core-cloud-web'
import SharedToolbar from '../shared-toolbar'
import useContentView from '@/view-models/drive/content-view'
import { useEffect } from 'react'
import SharedFooter from '../shared-footer'
import UILoading from '../ui-loading'

export default function ContentView() {
  const viewModel = useContentView({ })

  useEffect(() => {
    viewModel.handleViewAppear1()
    viewModel.handleViewAppear2()
  }, [])

  return (
    <>
      <div className="flex flex-col h-screen">
        <SharedToolbar
          source="drive"
          apps={CoreCloudWeb.APPS}
          firstName={viewModel.firstName}
          lastName={viewModel.lastName}
          username={viewModel.username}
          urls={viewModel.avatarURLs}
        />

        {
          viewModel.isLoading
            ? (
              <>
                <div
                  className={
                    'w-full h-full flex items-center justify-center flex-col'
                  }
                >
                  <UILoading />
                </div>
                <SharedFooter />
              </>
            )
            : null
        }
      </div>
    </>
  )
}
