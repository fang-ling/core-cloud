//
//  shared-bodyguard.tsx
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/11.
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
import useSharedBodyguard from '@/view-models/shared-bodyguard'
import UILoading from './ui-loading'

export default function SharedBodyguard({
  onPass,
  inputClassName
}: {
  onPass: () => void,
  inputClassName?: string
}) {
  const viewModel = useSharedBodyguard({
    onPass: onPass
  })

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {
        viewModel.isLoading
          ? <UILoading />
          : (
            <>
              <svg
                viewBox="0 0 65.239013671875 98.0947265625"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-labelSecondary w-11"
              >
                <g transform="matrix(1 0 0 1 -20.60546386718761 84.27734375)">
                  <path
                    d={
                      'M29.9805 10.9863L76.4648 10.9863C82.7637 10.9863 ' +
                        '85.8398 7.86133 85.8398 ' +
                        '1.02539L85.8398-34.8145C85.8398-40.9668 ' +
                        '83.3008-44.1406 ' +
                        '78.0762-44.6777L78.0762-56.9824C78.0762-75.3906 ' +
                        '66.0156-84.2773 53.2227-84.2773C40.4297-84.2773 ' +
                        '28.3691-75.3906 ' +
                        '28.3691-56.9824L28.3691-44.4336C23.584-43.7012 ' +
                        '20.6055-40.5762 ' +
                        '20.6055-34.8145L20.6055 1.02539C20.6055 7.86133 ' +
                        '23.6816 10.9863 29.9805 ' +
                        '10.9863ZM36.2305-58.0078C36.2305-70.2637 ' +
                        '44.0918-76.7578 53.2227-76.7578C62.3535-76.7578 ' +
                        '70.2148-70.2637 ' +
                        '70.2148-58.0078L70.2148-44.7266L36.2305-44.6777Z'
                    }
                  />
                </g>
              </svg>

              <h2
                className={
                  'mt-4 text-labelPrimary text-base leading-5.25 font-semibold'
                }
              >
                {Localizer.default().localize('Enter your master password')}
              </h2>
              <p
                className={
                  'max-w-75 text-center text-labelSecondary text-[15px] ' +
                    'leading-5 mt-1'
                }
                dangerouslySetInnerHTML={{
                  __html: Localizer
                    .default()
                    .localize(
                      'To allow *X* to access and display your data, ' +
                        'you\'ll need to enter your master password.'
                    )
                    .replace('*X*', process.env.NEXT_PUBLIC_TITLE ?? '')
                }}
              />
              <input
                className={
                  'mt-4 h-8 w-60 px-[7.05px] py-0.75 rounded-lg ' +
                    'text-labelPrimary text-[15px] border border-separator ' +
                    'placeholder:text-center text-ellipsis outline-hidden ' +
                    inputClassName
                }
                value={viewModel.masterPassword}
                onChange={(event) => {
                  viewModel.handleInputChange(event.target.value)
                }}
                type="password"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                placeholder={
                  Localizer.default().localize('Enter Master Password')
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    viewModel.handleInputSubmit()
                  }
                }}
              />
              {
                viewModel.isWrongPassword && (
                  <div
                    className={
                      'relative top-4 max-w-75 w-full mx-auto ' +
                        'animate-[fade-in_.2s_ease-in-out]'
                    }
                  >
                    <div
                      className={
                        'absolute -ml-[50%] left-1/2 w-full bg-[#fae9a3] ' +
                          'rounded-[5px] border border-[rgba(185,149,1,.47)] ' +
                          'shadow-[0_5px_10px_2px_rgba(0,0,0,.1)] mt-1.25 ' +
                          'p-2.75 text-sm leading-5 text-[#503e30] ' +
                          'font-semibold ' +
                          'before:size-3.75 before:bg-[#fae9a3] ' +
                          'before:absolute before:left-[47.2%] ' +
                          'before:rotate-135 before:skew-5 before:-top-2 ' +
                          'before:border-l ' +
                          'before:border-[rgba(185,149,1,.47)] ' +
                          'before:border-b ' +
                      'before:shadow-[-1px_1px_2px_-1px_rgba(185,149,1,.47)] ' +
                          'text-center'
                      }
                    >
                      <p>
                        {Localizer.default().localize('Password incorrect.')}
                      </p>
                      <p>
                        {Localizer.default().localize('Try entering it again.')}
                      </p>
                    </div>
                  </div>
                )
              }
            </>
          )
      }
    </div>
  )
}
