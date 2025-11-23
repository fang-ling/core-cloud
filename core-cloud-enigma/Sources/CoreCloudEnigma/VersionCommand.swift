//
//  VersionCommand.swift
//  core-cloud-enigma
//
//  Created by Fang Ling on 2025/11/16.
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

import Vapor

struct VersionCommand: AsyncCommand {
  struct Signature: CommandSignature { }

  let help = "Prints the version string."

  func run(using context: CommandContext, signature: Signature) async throws {
    context.console.print("6.0")
  }
}
