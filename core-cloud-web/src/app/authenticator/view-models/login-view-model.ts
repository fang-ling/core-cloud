//
//  login-view-model.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/7/26.
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

'use client'

import { useState } from 'react'

export default function useLoginViewModel() {
  const [username, setUsername] = useState('')
  const [isUsernameFocused, setIsUsernameFocused] = useState(false)
  const [password, setPassword] = useState('')
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stage, setStage] = useState<'username' | 'password'>('username')
  const [isRegisterFormPresented, setIsRegisterFormPresented] = useState(false)
  const [isRememberMe, setIsRememberMe] = useState(false)

  /* MARK: Event handlers */
  async function handleContinueButtonClick() {
    if (password.length <= 0) {
      setIsLoading(true)

      /* Wait 1s unconditionally. */
      await new Promise(reslove => setTimeout(reslove, 1000))

      setStage('password')
      setIsLoading(false)
    }
  }

  function handleRegisterButtonClick() {
    setIsRegisterFormPresented(true)
  }

  function handleIsRememberMeChange(newValue: boolean) {
    setIsRememberMe(newValue)
  }

  return {
    username,
    setUsername,
    isUsernameFocused,
    setIsUsernameFocused,
    password,
    setPassword,
    isPasswordFocused,
    setIsPasswordFocused,
    isLoading,
    stage,
    isRegisterFormPresented,
    setIsRegisterFormPresented,
    isRememberMe,
    handleContinueButtonClick,
    handleRegisterButtonClick,
    handleIsRememberMeChange
  }
}
