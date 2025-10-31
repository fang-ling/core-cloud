//
//  SettingController.swift
//  core-cloud-server
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

import Vapor

struct SettingController: RouteCollection {
  let settingService = SettingService()

  func boot(routes: any RoutesBuilder) throws {
    routes
      .grouped("api")
      .grouped("setting")
      .grouped(AuthenticatorMiddleware())
      .get(use: fetchSettingHandler)

    routes
      .grouped("api")
      .grouped("setting")
      .grouped(AuthenticatorMiddleware())
      .patch(use: modifySettingHandler)
  }

  /**
   * - URL: GET /api/setting
   *
   * - Query Parameters:
   *   - key [String] (required): The setting key to fetch.
   *
   * - Response Codes:
   *   - 200 OK: The corresponding setting value is returned.
   *   - 400 Bad Request: Invalid setting key.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func fetchSettingHandler(request: Request) async -> Response {
    guard let userID = request.userID else {
      return Response(status: .unauthorized)
    }

    var fetchRequest: Setting.Singular.Input.Retrieval
    do {
      fetchRequest = try request.query.decode(
        Setting.Singular.Input.Retrieval.self
      )
    } catch {
      return Response(status: .badRequest)
    }
    if !Setting.Keys.contains(fetchRequest.key) {
      return Response(status: .badRequest)
    }

    do {
      let setting = try await settingService.fetchSetting(
        for: userID,
        on: request.db
      )

      var fetchResponse = Setting.Singular.Output.Retrieval()
      if (fetchRequest.key == Setting.Key.homeBackgroundColor) {
        fetchResponse.homeBackgroundColor = setting/*.homeBackgroundColor*/
      }

      return try Response(
        status: .ok,
        headers: .init([("Content-Type", "application/json")]),
        body: .init(data: CoreCloudServer.encoder.encode(fetchResponse))
      )
    } catch SettingError.noSuchSetting {
      return Response(status: .internalServerError)
    } catch SettingError.databaseError {
      return Response(status: .serviceUnavailable)
    } catch {
      return Response(status: .internalServerError)
    }
  }

  /**
   * - URL: PATCH /api/setting
   *
   * - Query Parameters:
   *   - key [String] (required): The setting's key.
   *   - value [String] (required): The setting's value.
   *
   * - Response Codes:
   *   - 200 OK: The request was successful.
   *   - 400 Bad Request: Invalid setting key.
   *   - 401 Unauthorized: The authentication is required and has failed.
   *   - 500 Internal Server Error: A response indicating an error occurred on
   *                                the server.
   *   - 503 Service Unavailable: A response indicating that the server is not
   *                              ready to handle the request.
   */
  func modifySettingHandler(request: Request) async -> HTTPStatus {
    guard let userID = request.userID else {
      return .unauthorized
    }

    var modifyRequest: Setting.Singular.Input.Modification
    do {
      modifyRequest = try request.query.decode(
        Setting.Singular.Input.Modification.self
      )
    } catch {
      return .badRequest
    }
    if !Setting.Keys.contains(modifyRequest.key) {
      return .badRequest
    }

    do {
      if modifyRequest.key == Setting.Key.homeBackgroundColor {
        guard let value = Int64(modifyRequest.value) else {
          return .badRequest
        }
        try await settingService.modifySetting(
          homeBackgroundColor: value,
          for: userID,
          on: request.db
        )
      }

      return .ok
    } catch SettingError.databaseError {
      return .serviceUnavailable
    } catch {
      return .internalServerError
    }
  }
}
