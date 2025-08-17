//
//  ApplicationTokenService.swift
//  core-cloud-server
//
//  Created by Fang Ling on 2025/8/17.
//

import Crypto
import Vapor

struct ApplicationTokenService {
  /**
   * Creates a new application token.
   *
   * - Parameter masterKey: The main key the derivation function uses to
   *                        derive a key.
   */
  func createApplicationToken(masterKey: SymmetricKey) -> SymmetricKey {
    return HKDF<SHA512>.deriveKey(
      inputKeyMaterial: masterKey,
      /* ASCII values for "app-token" */
      info: Data([97, 112, 112, 45, 116, 111, 107, 101, 110]),
      outputByteCount: 256 / 8
    )
  }
}
