<!--
   -  +page.svelte
   -  core-cloud-web
   -
   -  Created by Fang Ling on 2025/11/16.
   -
   -  Licensed under the Apache License, Version 2.0 (the "License");
   -  you may not use this file except in compliance with the License.
   -  You may obtain a copy of the License at
   -
   -    http://www.apache.org/licenses/LICENSE-2.0
   -
   -  Unless required by applicable law or agreed to in writing, software
   -  distributed under the License is distributed on an "AS IS" BASIS,
   -  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   -  See the License for the specific language governing permissions and
   -  limitations under the License.
-->

<script lang="ts">
 import { onMount } from "svelte"
 import { PasswordService } from "../../services/password-service"
 import {
   VerificationCodeService
 } from "../../services/verification-code-service"

 // MARK: - States
 let passwords: {
   id: number,
   label?: string
   username?: string
   verificationCodeID?: number
 }[] | undefined = $state([])
 let isPasswordsLoading = $state(false)
 let label = $state("")
 let username = $state("")
 let key = $state("")
 let notes = $state("")
 let base32EncodedSecret = $state("")
 let digest = $state("sha1")
 let digits = $state("6")
 let interval = $state("30")

 // MARK: - Lifecycles
 onMount(() => {
   viewDidAppear()
 })

 // MARK: - Event handlers
 async function viewDidAppear() {
   isPasswordsLoading = true
   passwords = await PasswordService.fetchPasswords({
     fields: "label,username,verificationCodeID"
   })
   isPasswordsLoading = false
 }

 async function newPasswordButtonDidClick() {
   const newPassword = await PasswordService.insertPassword({
     label: label,
     username: username.length <= 0 ? undefined : username,
     key: key,
     notes: notes.length <= 0 ? undefined : notes
   })
   if (newPassword) {
     passwords?.push({
       id: newPassword.id,
       label: label,
       username: username.length <= 0 ? undefined : username
     })
   } else {
     alert("Error creating password")
   }
 }

 async function showKeyButtonDidClick(id: number) {
   const key = await PasswordService.fetchPassword({
     id: id.toString()
   })
   alert(key ? key.key : "Error fetching password")
 }

 async function newVerificationCodeButtonDidClick(passwordID: number) {
   const newCode = await VerificationCodeService.insertVerificationCode({
     base32EncodedSecret: base32EncodedSecret,
     digest: digest,
     digits: +digits,
     interval: +interval,
     passwordID: passwordID
   })
   if (newCode && passwords) {
     for (let i = 0; i < passwords.length; i += 1) {
       if (passwords[i].id === passwordID) {
         passwords[i].verificationCodeID = newCode.id
       }
     }
   } else {
     alert("Error creating verification code")
   }
 }

 async function showVerificationCodeButtonDidClick(id: number) {
   const code = await VerificationCodeService.fetchVerificationCode({
     id: id.toString()
   })
   alert(code ? code.verificationCode : "Error fetching verification code")
 }
</script>

<input
  bind:value={label}
  placeholder="Website or Label"
/>
<input
  bind:value={username}
  placeholder="User Name"
/>
<input
  bind:value={key}
  placeholder="Password"
/>
<input
  bind:value={notes}
  placeholder="Notes"
/>
<button
  onclick={() => newPasswordButtonDidClick()}
  disabled={label.length <= 0 || key.length <= 0}
>
  Create
</button>

<br />

<input
  bind:value={base32EncodedSecret}
  placeholder="Secret"
/>
<input
  bind:value={digest}
  placeholder="Digest"
/>
<input
  bind:value={digits}
  placeholder="Digits"
/>
<input
  bind:value={interval}
  placeholder="Interval"
/>

<br />

{#if isPasswordsLoading}
  <p>Loading passwords...</p>
{:else if passwords === undefined}
  <p>Error loading passwords</p>
{:else}
  <ul>
    {#each passwords as password (password.id)}
      <li>
        <span>Website or Label: {password.label}</span>
        {#if password.username}
          <span>User Name: {password.username}</span>
        {/if}
        <button
          onclick={() => showKeyButtonDidClick(password.id)}
        >
          Show Password
        </button>
        {#if password.verificationCodeID}
          <button
            onclick={() => {
              showVerificationCodeButtonDidClick(password.verificationCodeID!)
            }}
          >
            Show Verification Code
          </button>
        {:else}
          <button
            onclick={() => newVerificationCodeButtonDidClick(password.id)}
            disabled={
              base32EncodedSecret.length <= 0 ||
              digest.length <= 0 ||
              digits.length <= 0 ||
              interval.length <= 0
            }
          >
            Create Verification Code
          </button>
        {/if}
      </li>
    {/each}
  </ul>
{/if}
