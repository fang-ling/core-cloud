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

import ApplicationTokenService from "@/services/application-token-service"
import { useState } from "react"
import { BoolBinding, useBinding } from "ui/binding"

export default function useSharedBodyguard({
  isPassed
}: {
  isPassed: BoolBinding
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isWrongPassword, setIsWrongPassword] = useState(false)
  const masterPassword = useBinding("")

  /* MARK: - Event handlers */
  function masterPasswordDidChange() {
    setIsWrongPassword(false)
  }

  async function masterPasswordDidSubmit() {
    setIsLoading(true)

    const passes = await ApplicationTokenService.insertApplicationToken({
      masterPassword: masterPassword.value
    })
    if (passes) {
      isPassed.setValue(true)
    } else {
      setIsWrongPassword(true)
    }

    setIsLoading(false)
  }

  async function viewDidAppear() {
    setIsLoading(true)

    const passed = await ApplicationTokenService.peekApplicationToken()
    setIsLoading(false)

    if (passed) {
      isPassed.setValue(true)
    }
  }

  return {
    isLoading,
    isWrongPassword,
    masterPassword,
    masterPasswordDidChange,
    masterPasswordDidSubmit,
    viewDidAppear
  }
}
