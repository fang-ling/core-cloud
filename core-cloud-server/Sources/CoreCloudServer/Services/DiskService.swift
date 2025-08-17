//
//  DiskService.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/17.
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

import Fluent
import Vapor

struct DiskService {
  /**
   * Returns disk paths from the environment.
   *
   * - Returns: An array of disk paths. If no disks are found, an empty array
   *            is returned.
   */
  func getDisks() -> [String] {
    let disksString = Environment.get(CoreCloudServer.Keys.disks) ?? ""
    return disksString.components(separatedBy: ",").filter({ !$0.isEmpty })
  }
}
