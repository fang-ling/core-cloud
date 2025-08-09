//
//  register-dialog.ts
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

import { useRef, useState } from 'react'
import UserService from '../../services/user-service'
import UserTokenService from '../../services/user-token-service'
import { useRouter } from 'next/navigation'

export default function useRegisterDialog({
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
  const textFieldsMaskRef = useRef(0b111_1111)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const router = useRouter()

  /* MARK: - Event handlers */
  function handleFirstNameDeflower() {
    setIsFirstNameVirginal(false)

    if (firstName.length <= 0) {
      textFieldsMaskRef.current &= ~1
    } else {
      textFieldsMaskRef.current |= 1
    }
  }

  function handleFirstNameChange() {
    setIsError(false)
  }

  function handleLastNameDeflower() {
    setIsLastNameVirginal(false)

    if (lastName.length <= 0) {
      textFieldsMaskRef.current &= ~(1 << 1)
    } else {
      textFieldsMaskRef.current |= 1 << 1
    }
  }

  function handleLastNameChange() {
    setIsError(false)
  }

  async function handleUsernameBlur() {
    setIsUsernameVirginal(false) /* Deflower. */

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    let isValid = true
    if (username.length <= 0 || !emailRegex.test(username)) {
      setUsernameMessage(
        'Enter a valid email address to use as your primary email address.'
      )
      isValid = false
    } else {
      const exists = await UserService.peekUser({
        username: username
      })
      if (exists === true) {
        setUsernameMessage(
          'This email address is not available. ' +
            'Choose a different address.'
        )
        isValid = false
      } else if (exists === false) {
        setUsernameMessage('')
        isValid = true
      } else {
        setUsernameMessage('Cannot verify this email address.')
        isValid = false
      }
    }

    if (!isValid) {
      textFieldsMaskRef.current &= ~(1 << 2)
    } else {
      textFieldsMaskRef.current |= 1 << 2
    }
  }

  function handleUsernameChange() {
    setIsError(false)
  }

  function handlePasswordBlur() {
    setIsPasswordVirginal(false) /* Deflower. */

    let isValid = true
    if ((mask & 1) === 0) {
      setPasswordMessage('8 or more characters')
      isValid = false
    } else if (((mask >> 1) & 1) === 0) {
      setPasswordMessage('At least one number')
      isValid = false
    } else if (((mask >> 2) & 1) === 0 || ((mask >> 3) & 1) === 0) {
      setPasswordMessage('Upper & lowercase letters')
      isValid = false
    } else if (((mask >> 4) & 1) === 0) {
      setPasswordMessage('At least one special character')
      isValid = false
    } else {
      setPasswordMessage('')
      isValid = true
    }

    if (!isValid) {
      textFieldsMaskRef.current &= ~(1 << 3)
    } else {
      textFieldsMaskRef.current |= 1 << 3
    }
  }

  function handlePasswordChange(newPassword: string) {
    setIsError(false)

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

  function handleConfirmPasswordBlur() {
    setIsConfirmPasswordVirginal(false) /* Deflower. */

    const hasDigit = DIGIT_REGEX.test(confirmPassword)
    const hasUppercaseLetter = UPPERCASE_LETTER_REGEX.test(confirmPassword)
    const hasLowercaseLetter = LOWERCASE_LETTER_REGEX.test(confirmPassword)
    const hasSpecialCharacter = SPECIAL_CHARACTER_REGEX.test(confirmPassword)

    let isValid = true
    if (confirmPassword.length < 8) {
      setConfimPasswordMessage('8 or more characters')
      isValid = false
    } else if (!hasDigit) {
      setConfimPasswordMessage('At least one number')
      isValid = false
    } else if (!hasUppercaseLetter || !hasLowercaseLetter) {
      setConfimPasswordMessage('Upper & lowercase letters')
      isValid = false
    } else if (!hasSpecialCharacter) {
      setConfimPasswordMessage('At least one special character')
      isValid = false
    } else if (confirmPassword !== password) {
      setConfimPasswordMessage('The passwords you entered do not match.')
      isValid = false
    } else {
      setConfimPasswordMessage('')
      isValid = true
    }

    if (!isValid) {
      textFieldsMaskRef.current &= ~(1 << 4)
    } else {
      textFieldsMaskRef.current |= 1 << 4
    }
  }

  function handleConfirmPasswordChange() {
    setIsError(false)
  }

  function handleMasterPasswordBlur() {
    setIsMasterPasswordVirginal(false)

    const hasDigit = DIGIT_REGEX.test(masterPassword)
    const hasUppercaseLetter = UPPERCASE_LETTER_REGEX.test(masterPassword)
    const hasLowercaseLetter = LOWERCASE_LETTER_REGEX.test(masterPassword)
    const hasSpecialCharacter = SPECIAL_CHARACTER_REGEX.test(masterPassword)

    let isValid = true
    if (masterPassword.length < 8) {
      setMasterPasswordMessage('8 or more characters')
      isValid = false
    } else if (!hasDigit) {
      setMasterPasswordMessage('At least one number')
      isValid = false
    } else if (!hasUppercaseLetter || !hasLowercaseLetter) {
      setMasterPasswordMessage('Upper & lowercase letters')
      isValid = false
    } else if (!hasSpecialCharacter) {
      setMasterPasswordMessage('At least one special character')
      isValid = false
    } else if (masterPassword === password) {
      setMasterPasswordMessage('___')
      isValid = false
    } else {
      setMasterPasswordMessage('')
      isValid = true
    }

    if (!isValid) {
      textFieldsMaskRef.current &= ~(1 << 5)
    } else {
      textFieldsMaskRef.current |= 1 << 5
    }
  }

  function handleMasterPasswordChange() {
    setIsError(false)
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

    let isValid = true
    if (confirmMasterPassword.length < 8) {
      setConfirmMasterPasswordMessage('8 or more characters')
      isValid = false
    } else if (!hasDigit) {
      setConfirmMasterPasswordMessage('At least one number')
      isValid = false
    } else if (!hasUppercaseLetter || !hasLowercaseLetter) {
      setConfirmMasterPasswordMessage('Upper & lowercase letters')
      isValid = false
    } else if (!hasSpecialCharacter) {
      setConfirmMasterPasswordMessage('At least one special character')
      isValid = false
    } else if (confirmMasterPassword !== masterPassword) {
      setConfirmMasterPasswordMessage('The passwords you entered do not match.')
      isValid = false
    } else {
      setConfirmMasterPasswordMessage('')
      isValid = true
    }

    if (!isValid) {
      textFieldsMaskRef.current &= ~(1 << 6)
    } else {
      textFieldsMaskRef.current |= 1 << 6
    }
  }

  function handleConfirmMasterPasswordChange() {
    setIsError(false)
  }

  async function handleViewDisappear() {
    setIsClosing(true)
    await new Promise(resolve => setTimeout(resolve, 200))
    document.body.style.removeProperty('overflow')
    setIsPresented(false)
  }

  async function handleContinueButtonClick() {
    /* Deflower all the textfields unconditionally. */
    handleFirstNameDeflower()
    handleLastNameDeflower()
    await handleUsernameBlur()
    handlePasswordBlur()
    handleConfirmPasswordBlur()
    handleMasterPasswordBlur()
    handleConfirmMasterPasswordBlur()

    if (textFieldsMaskRef.current === 0b111_1111) {
      setIsLoading(true)
      const success = await UserService.insertUser({
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        masterPassword: masterPassword
      })
      setIsError(!success)
      if (success) {
        /* Login and never go back. */
        await UserTokenService.insertUserToken(
          username,
          password,
          { rememberMe: false }
        )
        router.push('/home')
      }
      setIsLoading(false)
    }
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
    isLoading,
    isError,
    handleFirstNameDeflower,
    handleFirstNameChange,
    handleLastNameDeflower,
    handleLastNameChange,
    handleUsernameBlur,
    handleUsernameChange,
    handlePasswordBlur,
    handlePasswordChange,
    handleConfirmPasswordBlur,
    handleConfirmPasswordChange,
    handleMasterPasswordBlur,
    handleMasterPasswordChange,
    handleMasterPasswordQuestionHover,
    handleConfirmMasterPasswordBlur,
    handleConfirmMasterPasswordChange,
    handleViewDisappear,
    handleContinueButtonClick
  }
}
