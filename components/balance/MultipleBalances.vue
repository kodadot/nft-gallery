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
        v-for="(chain, key) in multiBalances.chains"
        :key="key"
        class="is-size-6">
        <div
          v-for="token in filterEmptyBalanceChains(chain)"
          :key="token.name"
          class="balance-row">
          <div class="is-capitalized is-flex-grow-3">
            {{ key }}
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
import { storeToRefs } from 'pinia'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { CHAINS, ENDPOINT_MAP } from '@kodadot1/static'
import { NeoSkeleton } from '@kodadot1/brick'
import { balanceOf } from '@kodadot1/sub-api'
import format, { formatNumber } from '@/utils/format/balance'
import { useFiatStore } from '@/stores/fiat'
import { calculateExactUsdFromToken } from '@/utils/calculation'
import { getAssetIdByAccount } from '@/utils/api/bsx/query'
import { toDefaultAddress } from '@/utils/account'

import { ChainToken, useIdentityStore } from '@/stores/identity'
import type { PalletBalancesAccountData } from '@polkadot/types/lookup'

const { accountId } = useAuth()
const { isTestnet } = usePrefix()
const refetchMultipleBalanceTimer = ref()
const identityStore = useIdentityStore()
const {
  multiBalances,
  multiBalanceAssets,
  multiBalanceAssetsTestnet,
  multiBalanceNetwork,
} = storeToRefs(identityStore)

const networkToPrefix = {
  polkadot: 'dot',
  kusama: 'ksm',
  basilisk: 'bsx',
  kusamaHub: 'ahk',
  'basilisk-testnet': 'snek',
  polkadotHub: 'ahp',
}

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
const currentNetwork = computed(() =>
  isTestnet.value ? 'test-network' : 'main-network',
)

const fiatStore = useFiatStore()
function calculateUsd(amount: string, token = 'KSM') {
  if (!amount) {
    return 0
  }

  const amountToNumber = Number(amount.replace(/\,/g, ''))

  return calculateExactUsdFromToken(
    amountToNumber,
    Number(fiatStore.getCurrentTokenValue(token)),
  )
}

async function getBalance(chainName: string, token = 'KSM', tokenId = 0) {
  const currentAddress = accountId.value
  const prefix = networkToPrefix[chainName]
  const chain = CHAINS[prefix]

  const defaultAddress = toDefaultAddress(currentAddress)
  const publicKey = decodeAddress(currentAddress)
  const prefixAddress = encodeAddress(publicKey, chain.ss58Format)
  const wsProvider = new WsProvider(ENDPOINT_MAP[prefix])

  const api = await ApiPromise.create({
    provider: wsProvider,
  })

  let currentBalance
  let nativeBalance

  if (tokenId) {
    nativeBalance = (
      (await api.query.tokens.accounts(
        prefixAddress,
        tokenId,
      )) as PalletBalancesAccountData
    ).free.toString()
    currentBalance = format(nativeBalance, chain.tokenDecimals, false)
  } else {
    nativeBalance = await balanceOf(api, prefixAddress)
    currentBalance = format(nativeBalance, chain.tokenDecimals, false)
  }

  let selectedTokenId = String(tokenId)
  if (chainName === 'basilisk') {
    selectedTokenId = await getAssetIdByAccount(api, prefixAddress)
  }

  const usd = calculateUsd(currentBalance, token)

  identityStore.setMultiBalances({
    address: defaultAddress,
    chains: {
      [chainName]: {
        [token.toLowerCase()]: {
          address: prefixAddress,
          balance: currentBalance,
          nativeBalance,
          usd,
          selected: selectedTokenId === String(tokenId),
        },
      },
    },
    chainName,
  })

  identityStore.multiBalanceNetwork = currentNetwork.value

  await wsProvider.disconnect()
}

const fetchMultipleBalance = async () => {
  await fiatStore.fetchFiatPrice()
  const assets = isTestnet.value
    ? multiBalanceAssetsTestnet.value
    : multiBalanceAssets.value

  assets.forEach((item) => {
    getBalance(item.chain, item.token, Number(item.tokenId))
  })
}

onMounted(async () => {
  if (currentNetwork.value !== multiBalanceNetwork.value) {
    identityStore.resetMultipleBalances()
  }

  fetchMultipleBalance()
  refetchMultipleBalanceTimer.value = setInterval(() => {
    fetchMultipleBalance()
  }, 30000)
})

onBeforeUnmount(() => {
  clearInterval(refetchMultipleBalanceTimer.value)
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
