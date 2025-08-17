//
//  shared-bodyguard.ts
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

import ApplicationTokenService from '@/services/application-token-service'
import { useState } from 'react'

export default function useSharedBodyguard({
  onPass
}: {
  onPass: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isWrongPassword, setIsWrongPassword] = useState(false)
  const [masterPassword, setMasterPassword] = useState('')

  /* MARK: - Event handlers */
  function handleInputChange(newMasterPassword: string) {
    setMasterPassword(newMasterPassword)
    setIsWrongPassword(false)
  }

  async function handleInputSubmit() {
    setIsLoading(true)

    const passes = await ApplicationTokenService.insertApplicationToken({
      masterPassword: masterPassword
    })
    if (passes) {
      onPass()
    } else {
      setIsWrongPassword(true)
    }

    setIsLoading(false)
  }

  return {
    isLoading,
    isWrongPassword,
    masterPassword,
    handleInputChange,
    handleInputSubmit
  }
}
