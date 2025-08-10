//
//  content-view.ts
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

import UserService from '@/services/user-service'
import { useState } from 'react'

export default function useContentView({

}: {

}) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [avatarURLs, setAvatarURLs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  /* MARK: - Event handlers */
  async function handleViewAppear1() {
    const user = await UserService.fetchUser()
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setUsername(user.username)
      setAvatarURLs(user.avatarURLs)
    }
  }

  async function handleViewAppear2() {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return {
    firstName,
    lastName,
    username,
    avatarURLs,
    isLoading,
    handleViewAppear1,
    handleViewAppear2
  }
}
