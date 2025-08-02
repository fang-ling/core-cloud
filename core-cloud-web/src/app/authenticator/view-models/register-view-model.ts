//
//  register-view-model.ts
//  core-cloud-web
//
//  Created by Fang Ling on 2025/7/27.
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

import { useState } from 'react'
import UserService from '../services/user-service'

export default function useRegisterViewModel({
  setIsPresented
}: {
  setIsPresented: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const DIGIT_REGEX = /\d/
  const UPPERCASE_LETTER_REGEX = /[A-Z]/
  const LOWERCASE_LETTER_REGEX = /[a-z]/
  const SPECIAL_CHARACTER_REGEX = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/

  const [firstName, setFirstName] = useState('')
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false)
  const [isFirstNameVirginal, setIsFirstNameVirginal] = useState(true)
  const [lastName, setLastName] = useState('')
  const [isLastNameFocused, setIsLastNameFocused] = useState(false)
  const [isLastNameVirginal, setIsLastNameVirginal] = useState(true)
  const [username, setUsername] = useState('')
  const [isUsernameFocused, setIsUsernameFocused] = useState(false)
  const [isUsernameVirginal, setIsUsernameVirginal] = useState(true)
  const [usernameMessage, setUsernameMessage] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isPasswordVirginal, setIsPasswordVirginal] = useState(true)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [mask, setMask] = useState(0)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(
    false
  )
  const [isConfirmPasswordVirginal, setIsConfirmPasswordVirginal] = useState(
    true
  )
  const [confirmPasswordMessage, setConfimPasswordMessage] = useState('')
  const [masterPassword, setMasterPassword] = useState('')
  const [isMasterPasswordFocused, setIsMasterPasswordFocused] = useState(false)
  const [isMasterPasswordVirginal, setIsMasterPasswordVirginal] = useState(true)
  const [masterPasswordMessage, setMasterPasswordMessage] = useState('')
  const [
    isMasterPasswordQuestionPresented,
    setIsMasterPasswordQuestionPresented
  ] = useState(false)
  const [confirmMasterPassword, setConfirmMasterPassword] = useState('')
  const [
    isConfirmMasterPasswordFocused,
    setIsConfirmMasterPasswordFocused
  ] = useState(false)
  const [
    isConfirmMasterPasswordVirginal,
    setIsConfirmMasterPasswordVirginal
  ] = useState(true)
  const [
    confirmMasterPasswordMessage,
    setConfirmMasterPasswordMessage
  ] = useState('')
  const [isClosing, setIsClosing] = useState(false)

  /* MARK: - Event handlers */
  function handleFirstNameDeflower() {
    setIsFirstNameVirginal(false)
  }

  function handleLastNameDeflower() {
    setIsLastNameVirginal(false)
  }

  async function handleUsernameBlur() {
    setIsUsernameVirginal(false) /* Deflower. */

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (username.length <= 0 || !emailRegex.test(username)) {
      setUsernameMessage(
        'Enter a valid email address to use as your primary email address.'
      )
    } else {
      const exists = await UserService.peekUser({
        username: username
      })
      if (exists === true) {
        setUsernameMessage(
          'This email address is not available. ' +
            'Choose a different address.'
        )
      } else if (exists === false) {
        setUsernameMessage('')
      } else {
        setUsernameMessage('Cannot verify this email address.')
      }
    }
  }

  function handlePasswordChange(newPassword: string) {
    const hasDigit = DIGIT_REGEX.test(newPassword)
    const hasUppercaseLetter = UPPERCASE_LETTER_REGEX.test(newPassword)
    const hasLowercaseLetter = LOWERCASE_LETTER_REGEX.test(newPassword)
    const hasSpecialCharacter = SPECIAL_CHARACTER_REGEX.test(newPassword)

    let newMask = 0b00000
    newMask |= newPassword.length >= 8 ? 1 : 0
    newMask |= (hasDigit ? 1 : 0) << 1
    newMask |= (hasUppercaseLetter ? 1 : 0) << 2
    newMask |= (hasLowercaseLetter ? 1 : 0) << 3
    newMask |= (hasSpecialCharacter ? 1 : 0) << 4
    setMask(newMask)

    const count = newMask.toString(2).split('1').length - 1
    if (count == 0) {
      setPasswordStrength(0)
    } else if (count <= 2) {
      setPasswordStrength(30)
    } else if (count <= 4) {
      setPasswordStrength(60)
    } else {
      if (newPassword.length >= 16) {
        setPasswordStrength(100)
      } else {
        setPasswordStrength(90)
      }
    }
  }

  function handlePasswordBlur() {
    setIsPasswordVirginal(false) /* Deflower. */

    if ((mask & 1) === 0) {
      setPasswordMessage('8 or more characters')
    } else if (((mask >> 1) & 1) === 0) {
      setPasswordMessage('At least one number')
    } else if (((mask >> 2) & 1) === 0 || ((mask >> 3) & 1) === 0) {
      setPasswordMessage('Upper & lowercase letters')
    } else if (((mask >> 4) & 1) === 0) {
      setPasswordMessage('At least one special character')
    } else {
      setPasswordMessage('')
    }
  }

  function handleConfirmPasswordBlur() {
    setIsConfirmPasswordVirginal(false) /* Deflower. */

    const hasDigit = DIGIT_REGEX.test(confirmPassword)
    const hasUppercaseLetter = UPPERCASE_LETTER_REGEX.test(confirmPassword)
    const hasLowercaseLetter = LOWERCASE_LETTER_REGEX.test(confirmPassword)
    const hasSpecialCharacter = SPECIAL_CHARACTER_REGEX.test(confirmPassword)

    if (confirmPassword.length < 8) {
      setConfimPasswordMessage('8 or more characters')
    } else if (!hasDigit) {
      setConfimPasswordMessage('At least one number')
    } else if (!hasUppercaseLetter || !hasLowercaseLetter) {
      setConfimPasswordMessage('Upper & lowercase letters')
    } else if (!hasSpecialCharacter) {
      setConfimPasswordMessage('At least one special character')
    } else if (confirmPassword !== password) {
      setConfimPasswordMessage('The passwords you entered do not match.')
    } else {
      setConfimPasswordMessage('')
    }
  }

  function handleMasterPasswordBlur() {
    setIsMasterPasswordVirginal(false)

    const hasDigit = DIGIT_REGEX.test(masterPassword)
    const hasUppercaseLetter = UPPERCASE_LETTER_REGEX.test(masterPassword)
    const hasLowercaseLetter = LOWERCASE_LETTER_REGEX.test(masterPassword)
    const hasSpecialCharacter = SPECIAL_CHARACTER_REGEX.test(masterPassword)

    if (masterPassword.length < 8) {
      setMasterPasswordMessage('8 or more characters')
    } else if (!hasDigit) {
      setMasterPasswordMessage('At least one number')
    } else if (!hasUppercaseLetter || !hasLowercaseLetter) {
      setMasterPasswordMessage('Upper & lowercase letters')
    } else if (!hasSpecialCharacter) {
      setMasterPasswordMessage('At least one special character')
    } else if (masterPassword === password) {
      setMasterPasswordMessage('___')
    } else {
      setMasterPasswordMessage('')
    }
  }

  function handleMasterPasswordQuestionHover(isEnter: boolean) {
    setIsMasterPasswordQuestionPresented(isEnter)
  }

  function handleConfirmMasterPasswordBlur() {
    setIsConfirmMasterPasswordVirginal(false)

    const hasDigit = DIGIT_REGEX.test(confirmMasterPassword)
    const hasUppercaseLetter = UPPERCASE_LETTER_REGEX.test(
      confirmMasterPassword
    )
    const hasLowercaseLetter = LOWERCASE_LETTER_REGEX.test(
      confirmMasterPassword
    )
    const hasSpecialCharacter = SPECIAL_CHARACTER_REGEX.test(
      confirmMasterPassword
    )

    if (confirmMasterPassword.length < 8) {
      setConfirmMasterPasswordMessage('8 or more characters')
    } else if (!hasDigit) {
      setConfirmMasterPasswordMessage('At least one number')
    } else if (!hasUppercaseLetter || !hasLowercaseLetter) {
      setConfirmMasterPasswordMessage('Upper & lowercase letters')
    } else if (!hasSpecialCharacter) {
      setConfirmMasterPasswordMessage('At least one special character')
    } else if (confirmMasterPassword !== masterPassword) {
      setConfirmMasterPasswordMessage('The passwords you entered do not match.')
    } else {
      setConfirmMasterPasswordMessage('')
    }
  }

  async function handleViewDisappear() {
    setIsClosing(true)
    await new Promise(resolve => setTimeout(resolve, 200))
    setIsPresented(false)
  }

  return {
    firstName,
    setFirstName,
    isFirstNameFocused,
    setIsFirstNameFocused,
    isFirstNameVirginal,
    lastName,
    setLastName,
    isLastNameFocused,
    setIsLastNameFocused,
    isLastNameVirginal,
    username,
    setUsername,
    isUsernameFocused,
    setIsUsernameFocused,
    isUsernameVirginal,
    setIsUsernameVirginal,
    usernameMessage,
    password,
    setPassword,
    isPasswordFocused,
    setIsPasswordFocused,
    isPasswordVirginal,
    setIsPasswordVirginal,
    passwordMessage,
    passwordStrength,
    mask,
    confirmPassword,
    setConfirmPassword,
    isConfirmPasswordFocused,
    setIsConfirmPasswordFocused,
    isConfirmPasswordVirginal,
    setIsConfirmPasswordVirginal,
    confirmPasswordMessage,
    setConfimPasswordMessage,
    masterPassword,
    setMasterPassword,
    isMasterPasswordFocused,
    setIsMasterPasswordFocused,
    isMasterPasswordVirginal,
    setIsMasterPasswordVirginal,
    isMasterPasswordQuestionPresented,
    masterPasswordMessage,
    confirmMasterPassword,
    setConfirmMasterPassword,
    isConfirmMasterPasswordFocused,
    setIsConfirmMasterPasswordFocused,
    isConfirmMasterPasswordVirginal,
    setIsConfirmMasterPasswordVirginal,
    confirmMasterPasswordMessage,
    isClosing,
    handleFirstNameDeflower,
    handleLastNameDeflower,
    handleUsernameBlur,
    handlePasswordChange,
    handlePasswordBlur,
    handleConfirmPasswordBlur,
    handleMasterPasswordBlur,
    handleMasterPasswordQuestionHover,
    handleConfirmMasterPasswordBlur,
    handleViewDisappear
  }
}
