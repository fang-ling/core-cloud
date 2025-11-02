//
//  Route.swift
//  core-cloud-enigma
//
//  Created by Fang Ling on 2025/10/24.
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

struct Route: RouteCollection {
  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped(AuthenticatorMiddleware())
      .get(":filename", use: getHandler)

    routes
      .grouped("api")
      .grouped("key")
      .grouped(AuthenticatorMiddleware())
      .post(use: insertKeyHandler)
  }

  func getHandler(request: Request) async -> Response {
    guard let filename = request.parameters.get("filename") else {
      return Response(status: .badRequest)
    }

    let components = filename.components(separatedBy: ".")
    guard components.count == 2,
          let name = components.first?.uppercased(),
          let kind = components.last?.lowercased()
    else {
      return Response(status: .badRequest)
    }

    let host = Environment.get(CoreCloudEnigma.Keys.targetHost) ?? ""
    let ciphertext: Data
    do {
      let url: URI = "https://\(host)/\(name).\(kind).sealedbox"
      request.logger.notice("Accessing \(url)")
      let clientResponse = try await request.client.get(url)
      guard let buffer = clientResponse.body else {
        return Response(status: .serviceUnavailable)
      }
      ciphertext = Data(buffer: buffer)
    } catch {
      return Response(status: .serviceUnavailable)
    }

    let cleartext: Data
    do {
      let keyData = try await Key.query(on: request.db)
        .filter(\.$name == name)
        .first()?
        .data
      let key = SymmetricKey(data: keyData ?? Data())

      cleartext = try AES.GCM.open(.init(combined: ciphertext), using: key)
    } catch {
      return Response(status: .unauthorized)
    }

    let response = Response(status: .ok)
    response.headers.contentType = HTTPMediaType.fileExtension(kind)
    response.headers.cacheControl = .init(
      isPublic: true,
      immutable: true,
      maxAge: 31536000
    )
    response.body = .init(data: cleartext)

    return response
  }

  func insertKeyHandler(request: Request) async -> HTTPStatus {
    guard
      let input = try? request.content.decode(
        Key.Singular.Input.Insertion.self
      ),
      let data = Data(base64Encoded: input.base64EncodedData)
    else {
      return .badRequest
    }

    let key = Key(name: input.name, data: data)
    guard (try? await key.save(on: request.db)) != nil else {
      return .serviceUnavailable
    }

    return .created
  }
}
