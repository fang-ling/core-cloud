//
//  binding.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/8/23.
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

import { useState } from "react"

/**
 * A wrapper type that can read and write a value owned by a source of truth.
 */
export type Binding<Value> = {
  value: Value
  setValue: React.Dispatch<React.SetStateAction<Value>>
}

export type BoolBinding = Binding<boolean> & { toggle: () => void }

export function useBinding<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const toggle = () => setValue(!value as unknown as React.SetStateAction<T>)

  return {
    value,
    setValue,
    ...(typeof initialValue === "boolean" && { toggle }),
  } as unknown as T extends boolean ? BoolBinding : Binding<T>
}
