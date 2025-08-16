//
//  detail-view.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/12.
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

import Localizer from '@/localizer'
import useDetailView from '@/view-models/drive/detail-view'
import { useEffect } from 'react'
import NavigationBarSymbol from './navigation-bar-symbol'
import UIProgress from '../ui-progress'

export default function DetailView({
  title,
  symbolName,
  emptyMessage,
  emptyDescription
}: {
  title?: string,
  symbolName?: string,
  emptyMessage?: string,
  emptyDescription?: string
}) {
  const viewModel = useDetailView({ })

  useEffect(() => {
    viewModel.handleOnAppear()
  }, [])

  return (
    <div className="grow flex flex-col">
      {/* Navigation bar */}
      <div className="flex pl-2.5 pr-3.75 py-1.25 flex-col select-none">
        <div className="flex">
          <div
            className={
              'min-h-8.5 pt-0.5 px-2.25 font-medium text-2xl leading-7.5 ' +
                'text-labelPrimary flex items-center'
            }
          >
            <NavigationBarSymbol
              className="-ml-2.25 fill-labelTertiary"
              symbolName={symbolName}
            />
            {title}
          </div>
        </div>
        {/* status */}
        <h2 className="pl-2.25 mt-0.25 text-sm leading-4 text-labelSecondary">
          {
            viewModel.isLoading
              ? Localizer.default().localize('Loading...')
              : Localizer
                .default()
                .localize('%lld item(s)')
                .replace('%lld', viewModel.files.length + '') +
                Localizer.default().localize(', ') +
                Localizer
                  .default()
                  .localize('%lld GB used')
                  .replace(
                    '%lld',
                    (
                      viewModel
                        .files
                        .reduce((a, f) => a + f.size, 0) / 1_000_000_000
                    ).toFixed(2)
                  )
          }
        </h2>
      </div>
      <div className="grow w-full flex items-center justify-center">
        {
          viewModel.isLoading
            ? <UIProgress variant="8" />
            : viewModel.files.length > 0
              ? null
              : (
                /* Empty */
                <div className="flex flex-col items-center px-5">
                  <h2
                    className={
                      'text-[31px] text-labelTertiary leading-[1.2] ' +
                        'font-bold text-center'
                    }
                  >
                    {emptyMessage}
                  </h2>
                  {
                    emptyDescription && (
                      <p
                        className={
                          'text-base font-light text-labelTertiary leading-5 ' +
                            'mt-5.5 text-center'
                        }
                      >
                        {emptyDescription}
                      </p>
                    )
                  }
                </div>
              )
        }
      </div>
    </div>
  )
}
