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
  import { TransactionService } from "../../services/transaction-service"

  // MARK: - States
  let accounts: {
    id: number,
    title?: string,
    subtitle?: string,
    number?: string,
    type?: number,
    balance?: string,
    actualBalance?: string,
    currencySymbol?: string,
    currencySymbolPosition?: number,
    logoURLs?: string
  }[] | undefined = $state([])
  let transactions: {
    id: number
    description?: string
    date?: number
    type?: number
    outAmount?: string
    outCurrencySymbol?: string
    outCurrencySymbolPosition?: number
    inAmount?: string
    inCurrencySymbol?: string
    inCurrencySymbolPosition?: number
    transactionCategoryName?: string
  }[] | undefined = $state([])
  let isLoading = $state(false)
  let selectedTabID: "accounts" | "transactions" = $state("accounts")
  let searchText = $state("")

  // MARK: - Lifecycles
 onMount(() => {
   viewDidAppear()
 })

  // MARK: - Event handlers
  function viewDidAppear() {
    loadAccounts()
  }

  function showAccountsButtonDidClick() {
    loadAccounts()
    searchText = ""
    selectedTabID = "accounts"
  }

  async function showTransactionsButtonDidClick() {
    isLoading = true
    selectedTabID = "transactions"

    transactions = await TransactionService.fetchTransactions({
      fields: [
        "description",
        "date",
        "type",
        "outAmount",
        "outCurrencySymbol",
        "outCurrencySymbolPosition",
        "inAmount",
        "inCurrencySymbol",
        "inCurrencySymbolPosition",
        "transactionCategoryName"
      ].join(","),
      filters: searchText
    })

    isLoading = false
  }

  // MARK: - Utilities
  async function loadAccounts() {
    isLoading = true

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
    accounts?.sort((lhs, rhs) => {
      return (
        lhs.title?.localeCompare(rhs.title ?? "") ||
        lhs.subtitle?.localeCompare(rhs.subtitle ?? "") ||
        lhs.number?.localeCompare(rhs.number ?? "")
      ) ?? 0
    })

    isLoading = false
  }
</script>

<button onclick={() => showAccountsButtonDidClick()}>Show Accounts</button>
<div>
  <input
    bind:value={searchText}
    placeholder="Search"
  />
  <button onclick={() => showTransactionsButtonDidClick()}>
    Show Transactions
  </button>
</div>

{#if selectedTabID === "accounts"}

  {#if isLoading}
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
          <span
            style={
              +(account.actualBalance ?? "0") - +(account.balance ?? "0") !== 0
                ? "color: red"
                : undefined
            }
          >
            Difference: {
              +(account.actualBalance ?? "0") - +(account.balance ?? "0")
            } |
          </span>
          <span>Symbol: {account.currencySymbol}</span>
        </li>
      {/each}
    </ul>
  {/if}

{:else}

  {#if isLoading}
    <p>Loading transactions...</p>
  {:else if transactions === undefined}
    <p>Error loading transactions</p>
  {:else}
    <ul>
      {#each transactions as transaction (transaction.id)}
        <li
          style={
            transaction.type === 0
              ? "color: green"
              : transaction.type === 1
                ? "color: red"
                : undefined
          }
        >
          <span>{transaction.description} |</span>
          <span>{(new Date(transaction.date ?? 0)).toLocaleString()} |</span>
          {#if transaction.type === 0 || transaction.type === 2}
            {#if transaction.outCurrencySymbolPosition == 0}
              <span>{transaction.outCurrencySymbol}</span>
            {/if}
            <span>{transaction.outAmount}</span>
            {#if transaction.outCurrencySymbolPosition == 1}
              <span>{transaction.outCurrencySymbol}</span>
            {/if}
          {/if}
          {#if transaction.type === 1 || transaction.type === 2}
            {#if transaction.inCurrencySymbolPosition == 0}
              <span>{transaction.inCurrencySymbol}</span>
            {/if}
            <span>{transaction.inAmount}</span>
            {#if transaction.inCurrencySymbolPosition == 1}
              <span>{transaction.inCurrencySymbol}</span>
            {/if}
          {/if}
          {#if transaction.type === 0 || transaction.type === 1}
            <span>| {transaction.transactionCategoryName}</span>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}

{/if}
