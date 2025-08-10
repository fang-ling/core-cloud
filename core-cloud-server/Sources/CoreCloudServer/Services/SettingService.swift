//
//  SettingService.swift
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

import Fluent
import Vapor

struct SettingService {
  /**
   * Adds a new setting for the user.
   *
   * - Parameters:
   *   - homeBackgroundColor: The background color of the home page.
   *   - userID: The id of the user.
   *   - database: The database to insert for the setting.
   *
   * - Throws:
   *   - ``SettingError/databaseError``: if there is an issue accessing the
   *                                      database.
   */
  func insertSetting(
    homeBackgroundColor: Int64,
    for userID: User.IDValue,
    on database: Database
  ) async throws {
    let setting = Setting(
      userID: userID,
      homeBackgroundColor: homeBackgroundColor
    )

    do {
      try await setting.save(on: database)
    } catch {
      throw SettingError.databaseError
    }
  }

  /**
   * Returns the setting of given user.
   *
   * - Parameters:
   *   - userID: The id of the user.
   *   - database: The database to query for the setting
   *
   * - Throws:
   *   - ``SettingError/noSuchSetting``: if the setting is not found.
   *   - ``SettingError/databaseError``: if there is an issue accessing the
   *                                     database.
   */
  func fetchSetting(
    for userID: User.IDValue,
    on database: Database
  ) async throws -> (
    /* Use tuple with an element label when element count > 1. */
    /*backgroundColor: */Int64
  ) {
    do {
      guard let setting = try await Setting.query(on: database)
        .filter(\.$user.$id == userID)
        .first()
      else {
        throw SettingError.noSuchSetting
      }

      return (
        /*homeBackgroundColor: */setting.homeBackgroundColor
      )
    } catch SettingError.noSuchSetting {
      throw SettingError.noSuchSetting
    } catch {
      throw SettingError.databaseError
    }
  }

  /**
   * Updates the setting of given user.
   *
   * - Parameters:
   *   - homeBackgroundColor: The background color of the home page.
   *   - userID: The id of the user.
   *   - database: The database to query for the setting
   *
   * - Throws:
   *   - ``SettingError/databaseError``: if there is an issue accessing the
   *                                     database.
   */
  func modifySetting(
    homeBackgroundColor: Int64? = nil,
    for userID: User.IDValue,
    on database: Database
  ) async throws {
    do {
      let query = Setting.query(on: database)
        .filter(\.$user.$id == userID)

      if let homeBackgroundColor {
        query.set(\.$homeBackgroundColor, to: homeBackgroundColor)
      }

      try await query.update()
    } catch {
      throw SettingError.databaseError
    }
  }
}
