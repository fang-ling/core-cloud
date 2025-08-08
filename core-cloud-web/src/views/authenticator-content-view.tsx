//
//  authenticator-content-view.tsx
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

import AuthenticatorLoginView from './authenticator-login-view'
import SharedFooterView from './shared-footer-view'
import SharedToolbarView from './shared-toolbar-view'

export default function AuthenticatorContentView() {
  return (
    <div className="relative">
      <SharedToolbarView source="authenticator" />
      <AuthenticatorLoginView />
      <SharedFooterView />
    </div>
  )
}
