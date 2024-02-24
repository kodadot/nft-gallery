<template>
  <div>
    <div
      v-if="isEmptyBalanceOnAllChains && !isBalanceLoading"
      class="text-xs py-4 flex flex-col items-center">
      <div class="mb-3 text-center">
        {{ $t('asset.emptyAsset') }}
      </div>
      <NeoButton
        variant="pill"
        size="small"
        class="px-4 py-1"
        data-testid="button-add-funds-empty"
        @click="openRampModal"
        >+ {{ $t('addFunds') }}</NeoButton
      >
    </div>
    <div v-else class="balance">
      <div class="balance-row text-k-grey text-xs">
        <div class="flex-grow-[3]">{{ $t('general.chain') }}</div>
        <div class="text-right flex-grow">
          {{ $t('general.token') }}
        </div>
        <div class="text-right flex-grow-[2]">
          {{ $t('general.balance') }}
        </div>
        <div class="text-right flex-grow-[2]">{{ $t('general.usd') }}</div>
      </div>

      <div
        v-for="(data, key) in multiBalancesChainsList"
        :key="key"
        class="text-base">
        <div
          v-for="token in filterEmptyBalanceChains(data.chain)"
          :key="token.name"
          class="balance-row">
          <div class="capitalize flex-grow-[3]">
            {{ data.key }}
          </div>
          <div class="text-right flex-grow">
            {{ token.name.toUpperCase() }}
          </div>

          <div class="text-right flex-grow-[2]">
            {{ formatNumber(token.details?.balance) }}
          </div>
          <div class="text-right flex-grow-[2]">
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
    <p class="flex justify-between items-end">
      <span class="text-xs"> {{ $t('spotlight.total') }}: </span>
      <span class="text-base"
        >${{ formatNumber(identityStore.getTotalUsd) }}</span
      >
    </p>

    <div
      v-if="!isEmptyBalanceOnAllChains && !isBalanceLoading"
      class="mt-4 flex items-center justify-end">
      <a
        class="text-k-grey text-xs"
        data-testid="button-add-funds-not-empty"
        @click="openRampModal"
        >+ {{ $t('addFunds') }}</a
      >
    </div>

    <OnRampModal v-model="rampActive" @close="rampActive = false" />
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '@/utils/format/balance'

import { NeoButton, NeoSkeleton } from '@kodadot1/brick'
import { ChainToken, type ChainType, useIdentityStore } from '@/stores/identity'

const displayChainOrder: ChainType[] = [
  'polkadot',
  'polkadotHub',
  'kusama',
  'kusamaHub',
]
const identityStore = useIdentityStore()
const rampActive = ref(false)

const { multiBalances } = useMultipleBalance(true)

const openRampModal = () => {
  rampActive.value = true
}

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
      flex-shrink: 1;
      flex-basis: 0%;
    }
  }
}
</style>
