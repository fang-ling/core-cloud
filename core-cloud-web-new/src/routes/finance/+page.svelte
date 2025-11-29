<!--
  +page.svelte
  core-cloud-web

  Created by Fang Ling on 2025/11/23.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->

<script lang="ts">
  import { onMount } from "svelte"
  import { AccountService } from "../../services/account-service"

  // MARK: - States
  let accounts: {
    id: number,
    title?: string,
    subtitle?: string,
    number?: String,
    type?: number,
    balance?: string,
    actualBalance?: string,
    currencySymbol?: string,
    currencySymbolPosition?: number,
    logoURLs?: string
  }[] | undefined = $state([])
  let isAccountsLoading = $state(false)

  // MARK: - Lifecycles
 onMount(() => {
   viewDidAppear()
 })

  // MARK: - Event handlers
  async function viewDidAppear() {
    isAccountsLoading = true
    accounts = await AccountService.fetchAccounts({
      fields: [
        "title",
        "subtitle",
        "number",
        "type",
        "balance",
        "actualBalance",
        "currencySymbol",
        "currencySymbolPosition",
        "logoURLs"
      ].join(",")
    })
    isAccountsLoading = false
  }
</script>

{#if isAccountsLoading}
  <p>Loading accounts...</p>
{:else if accounts === undefined}
  <p>Error loading accounts</p>
{:else}
  <ul>
    {#each accounts as account (account.id)}
      <li>
        <img
          width="32"
          height="32"
          src={account.logoURLs?.split(",").pop()}
          alt="Logo of the account."
        />
        <span>Title: {account.title} |</span>
        <span>Subtitle: {account.subtitle} |</span>
        <span>Number: {account.number} |</span>
        <span>Type: {account.type} |</span>
        <span>Balance: {account.balance} |</span>
        <span>ActualBalance: {account.actualBalance} |</span>
        <span>Difference: {
          +(account.actualBalance ?? "0") - +(account.balance ?? "0")
          } |
        </span>
        <span>Symbol: {account.currencySymbol}</span>
      </li>
    {/each}
  </ul>
{/if}
