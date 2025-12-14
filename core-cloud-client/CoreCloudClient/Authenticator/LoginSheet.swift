//
//  LoginSheet.swift
//  CoreCloudClient
//
//  Created by Fang Ling on 2025/12/12.
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

import SwiftUI

struct LoginSheet: View {
  @FocusState var focusedField: Field?

  @State var username = ""
  @State var password = ""
  @State var isPasswordFieldPresented = false

  var titleText: AttributedString {
    var text = AttributedString("One account for everything CoreCloud.")

    if let range = text.range(of: "CoreCloud") {
      text[range].font = .system(.headline, design: .serif).italic()
    }

    return text
  }

  var subtitleText: AttributedString {
    var text = AttributedString(
      "Sign in to securely access your personal data stored in CoreCloud."
    )

    if let range = text.range(of: "CoreCloud") {
      text[range].font = .system(.subheadline, design: .serif).italic()
    }

    return text
  }

  var createAccountText: AttributedString {
    var text = AttributedString("Create CoreCloud Account")

    if let range = text.range(of: "CoreCloud") {
      text[range].font = .system(.body, design: .serif).italic()
    }

    return text
  }

  var body: some View {
    HStack(alignment: .top) {
      Image("AuthenticatorIcon")
        .resizable()
        .aspectRatio(contentMode: .fit)
        .frame(width: 52, height: 52)
        .padding(.trailing, 6)
        .padding([.top, .leading], 26)

      VStack(alignment: .leading) {
        Text(titleText)
          .font(.headline)
          .padding(.bottom, 1)
          .padding(.leading, 1)

        Text(subtitleText)
          .font(.subheadline)
          .padding(.leading, 1)

        TextField("", text: $username, prompt: Text("Email or Phone Number"))
          .focused($focusedField, equals: .username)
          .frame(minWidth: 370)
          .padding(.top, 1)

        if isPasswordFieldPresented {
          SecureField("", text: $password, prompt: Text("Password"))
            .focused($focusedField, equals: .password)
        }

        Button("Forgot password?") { }
          .disabled(true)
          .font(.subheadline)
          .buttonStyle(.plain)
          .foregroundStyle(.blue)
          .padding(.top, 18)
          .padding(.leading, 3)
          .padding(.bottom, 3)

        HStack {
          Button(action: { }) {
            Text(createAccountText)
          }
          .disabled(true)

          Spacer()

          Button("Cancel") { }

          Button("Sign In") {
            signInButtonDidClick()
          }
          .keyboardShortcut(.defaultAction)
          .disabled(username.isEmpty)
        }
      }
      .padding(.leading, 7)
      .padding(.trailing, 26)
      .padding(.vertical, 20)
    }
    .padding(.vertical, -6)
  }
}

extension LoginSheet {
  enum Field: Hashable {
    case username
    case password
  }
}
