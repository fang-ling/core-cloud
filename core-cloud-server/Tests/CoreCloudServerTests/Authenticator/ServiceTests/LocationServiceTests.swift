//
//  LocationServiceTests.swift
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

@testable import CoreCloudServer
import Fluent
import Testing
import VaporTesting

@Suite("LocationServiceTests")
struct LocationServiceTests {
  @Test
  func testInsertLocation() async throws {
    let locationService = LocationService()

    try await withApp(configure: CoreCloudServer.configure) { app in
      let alice = User(
        firstName: "Alice",
        lastName: "Ou",
        username: "alice@example.com",
        key: Data(),
        salt: Data(),
        masterKeySealedBox: Data(),
        masterKeySealedBoxSalt: Data(),
        avatarURLs: "https://example.com/1.png"
      )
      try await alice.save(on: app.db)

      try await locationService.insertLocation(
        name: "Tank",
        path: "/mnt",
        for: alice.requireID(),
        on: app.db
      )
      let location1 = try await Location.query(on: app.db)
        .filter(\.$user.$id == alice.requireID())
        .first()
      #expect(location1 != nil)
      #expect(location1?.name == "Tank")
      #expect(location1?.path == "/mnt")

      try await locationService.insertLocation(
        name: "Tank2",
        path: "/mnt2",
        for: alice.requireID(),
        on: app.db
      )
      var count = try await Location.query(on: app.db)
        .filter(\.$user.$id == alice.requireID())
        .count()
      #expect(count == 2)

      await #expect(throws: LocationError.databaseError) {
        try await locationService.insertLocation(
          name: "Tank3",
          path: "/mnt2",
          for: alice.requireID(),
          on: app.db
        )
      }

      let lorna = User(
        firstName: "Lorna",
        lastName: "Chu",
        username: "lorna@example.com",
        key: Data(),
        salt: Data(),
        masterKeySealedBox: Data(),
        masterKeySealedBoxSalt: Data(),
        avatarURLs: "https://example.com/1.png"
      )
      try await lorna.save(on: app.db)

      try await locationService.insertLocation(
        name: "Tank",
        path: "/mnt",
        for: lorna.requireID(),
        on: app.db
      )
      count = try await Location.query(on: app.db)
        .filter(\.$user.$id == lorna.requireID())
        .count()
      #expect(count == 1)
    }
  }

  @Test
  func testGetLocations() async throws {
    let locationService = LocationService()

    try await withApp(configure: CoreCloudServer.configure) { app in
      let alice = User(
        firstName: "Alice",
        lastName: "Ou",
        username: "alice@example.com",
        key: Data(),
        salt: Data(),
        masterKeySealedBox: Data(),
        masterKeySealedBoxSalt: Data(),
        avatarURLs: "https://example.com/1.png"
      )
      try await alice.save(on: app.db)

      var locations = try await locationService.getLocations(
        for: alice.requireID(),
        on: app.db
      )
      #expect(locations.isEmpty)

      let location = try Location(
        name: "Tank",
        path: "/mnt",
        userID: alice.requireID()
      )
      try await location.save(on: app.db)

      locations = try await locationService.getLocations(
        for: alice.requireID(),
        on: app.db
      )
      #expect(locations.count == 1)
      #expect(locations.first?.name == "Tank")
      #expect(locations.first?.id == 1)
    }
  }
}
