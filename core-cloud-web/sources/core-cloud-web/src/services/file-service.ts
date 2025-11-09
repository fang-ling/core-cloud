//
//  file-service.ts
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

import File from "@/models/file"

namespace FileService {
  export async function fetchFiles(
    request: File.Plural.Input.Retrieval
  ) {
    try {
      const queryString = new URLSearchParams(request).toString()

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/files?${queryString}`,
        {
          method: "GET"
        }
      )
      if (response.status === 200) {
        return await response.json() as File.Plural.Output.Retrieval[]
      } else {
        throw new Error()
      }
    } catch {
      return []
    }
  }

  export async function insertFile({
    request,
    file,
    onSuccess
  }: {
    request: File.Singular.Input.Insertion,
    file: File,
    onSuccess: () => void
  }) {
    /* Load wasm */
    const wasmResponse = await fetch("/Crypto_SHA512.wasm")
    const wasmBytes = await wasmResponse.arrayBuffer()
    const { instance: wasmInstance } = await WebAssembly.instantiate(wasmBytes)
    const wasm = wasmInstance.exports

    /* Compute hash */
    const {
      Crypto_SHA512_Init,
      Crypto_SHA512_Update,
      Crypto_SHA512_Finalize,
      malloc,
      memory,
      free
    } = wasm as any
    const contextPointer = malloc(8 * 10 + 128)
    Crypto_SHA512_Init(contextPointer)

    const chunkSize = 4 * 1024 * 1024
    let offset = 0
    while (offset < file.size) {
      const slice = file.slice(offset, offset + chunkSize)
      const arrayBuffer = await slice.arrayBuffer()
      const data = new Uint8Array(arrayBuffer)

      const dataPointer = malloc(data.length)
      new Uint8Array(memory.buffer, dataPointer, data.length).set(data)
      Crypto_SHA512_Update(contextPointer, dataPointer, BigInt(data.length))
      free(dataPointer)

      offset += chunkSize
    }

    const digestPointer = malloc(64)
    Crypto_SHA512_Finalize(contextPointer, digestPointer)
    const digest = new Uint8Array(memory.buffer, digestPointer, 64)
    request.checksum = btoa(String.fromCharCode(...digest))

    free(contextPointer)
    free(digestPointer)

    /* Upload */
    offset = 0

    const webSocket = new WebSocket(
      `${process.env.NEXT_PUBLIC_API_HOST}/ws/file`
    )

    webSocket.onmessage = (event) => {
      const response = JSON.parse(event.data)
      if (
        response.status === "metadata" ||
          response.status === "chunk"
      ) { /* Metadata create successfully. */
        if (offset < file.size) {
          const slice = file.slice(offset, offset + chunkSize)
          webSocket.send(slice)

          offset += chunkSize
        } else {
          webSocket.send(
            JSON.stringify(
              {
                type: "complete"
              }
            )
          )
        }
      } else if (response.status === "ready") {
        const requestData = {
          ...request,
          type: "metadata"
        }
        webSocket.send(JSON.stringify(requestData))
      } else if (response.status === "ok") {
        onSuccess()
      }
    }
  }
}
export default FileService
