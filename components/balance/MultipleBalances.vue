<template>
  <div class="mb-2">
    <div
      v-if="isEmptyBalanceOnAllChains && !isBalanceLoading"
      class="has-text-grey">
      {{ $t('asset.emptyAsset') }}
    </div>
    <div v-else class="balance">
      <div class="balance-row has-text-grey is-size-7">
        <div class="is-flex-grow-3">{{ $t('general.chain') }}</div>
        <div class="has-text-right is-flex-grow-1">
          {{ $t('general.token') }}
        </div>
        <div class="has-text-right is-flex-grow-2">
          {{ $t('general.balance') }}
        </div>
        <div class="has-text-right is-flex-grow-2">{{ $t('general.usd') }}</div>
      </div>

      <div
        v-for="(data, key) in multiBalancesChainsList"
        :key="key"
        class="is-size-6">
        <div
          v-for="token in filterEmptyBalanceChains(data.chain)"
          :key="token.name"
          class="balance-row">
          <div class="is-capitalized is-flex-grow-3">
            {{ data.key }}
          </div>
          <div class="has-text-right is-flex-grow-1">
            {{ token.name.toUpperCase() }}
          </div>

          <div class="has-text-right is-flex-grow-2">
            {{ formatNumber(token.details?.balance) }}
          </div>
          <div class="has-text-right is-flex-grow-2">
            ${{ formatNumber(token.details?.usd || '0') }}
          </div>
        </div>
      </div>

      <NeoSkeleton
        v-if="isBalanceLoading"
        data-testid="skeleton-multiple-balances"
        animated />
    </div>

    <hr class="my-2" />
    <p class="is-flex is-justify-content-space-between is-align-items-flex-end">
      <span class="is-size-7"> {{ $t('spotlight.total') }}: </span>
      <span class="is-size-6"
        >${{ formatNumber(identityStore.getTotalUsd) }}</span
      >
    </p>
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '@/utils/format/balance'

import { NeoSkeleton } from '@kodadot1/brick'
import { ChainToken, type ChainType, useIdentityStore } from '@/stores/identity'

const displayChainOrder: ChainType[] = [
  'polkadot',
  'polkadotHub',
  'kusama',
  'kusamaHub',
  'basilisk',
]
const identityStore = useIdentityStore()

const { multiBalances } = useMultipleBalance(true)

const multiBalancesChainsList = computed(() => {
  return Object.keys(multiBalances.value.chains)
    .sort(
      (a, b) =>
        displayChainOrder.indexOf(a as ChainType) -
        displayChainOrder.indexOf(b as ChainType),
    )
    .map((key) => ({
      key,
      chain: multiBalances.value.chains[key],
    }))
})

const isBalanceLoading = computed(
  () => identityStore.getStatusMultiBalances === 'loading',
)
const filterEmptyBalanceChains = (chain: ChainToken = {}) => {
  const tokens = Object.keys(chain)
  return tokens
    .filter((token) => chain[token].balance !== '0')
    .map((token) => ({
      name: token,
      details: chain[token],
    }))
}

const isEmptyBalanceOnAllChains = computed(() => {
  const chains = Object.keys(multiBalances.value.chains)
  return !chains.some(
    (chain) =>
      filterEmptyBalanceChains(multiBalances.value.chains[chain]).length !== 0,
  )
})
</script>

<style scoped lang="scss">
.balance {
  &-row {
    display: flex;
    justify-content: space-between;

    & > * {
      flex: 1;
    }
  }
}
</style>
