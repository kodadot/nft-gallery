<template>
  <div class="mb-2">
    <div
      v-if="isEmptyBalanceOnAllChains && !isBalanceLoading"
      class="has-text-grey">
      You've got zero balance on this address across chains we are monitoring.
      If you want to buy small amount of crypto, click on Add funds through our
      verified on-ramp partner.
    </div>
    <div v-else class="balance">
      <div class="balance-row has-text-grey is-size-7">
        <div>{{ $t('general.chain') }}</div>
        <div class="has-text-right">{{ $t('general.token') }}</div>
        <div class="has-text-right">{{ $t('general.balance') }}</div>
        <div class="has-text-right">{{ $t('general.usd') }}</div>
      </div>

      <div
        v-for="(chain, key) in multiBalances.chains"
        :key="key"
        class="is-size-6">
        <div
          v-for="token in filterEmptyBalanceChains(chain)"
          :key="token.name"
          class="balance-row">
          <div class="is-capitalized">{{ key }}</div>
          <div class="has-text-right">{{ token.name.toUpperCase() }}</div>

          <div class="has-text-right">
            {{ token.details?.balance }}
          </div>
          <div class="has-text-right">
            ${{ delimiter(token.details?.usd || '0') }}
          </div>
        </div>
      </div>

      <NeoSkeleton v-if="isBalanceLoading" animated />
    </div>

    <hr class="my-2" />
    <p class="is-flex is-justify-content-space-between is-align-items-flex-end">
      <span class="is-size-7"> {{ $i18n.t('spotlight.total') }}: </span>
      <span class="is-size-6">${{ delimiter(identityStore.getTotalUsd) }}</span>
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

import format from '@/utils/format/balance'
import { useFiatStore } from '@/stores/fiat'
import { calculateExactUsdFromToken } from '@/utils/calculation'
import { getAssetIdByAccount } from '@/utils/api/bsx/query'
import { toDefaultAddress } from '@/utils/account'

import { ChainToken, useIdentityStore } from '@/stores/identity'

import type { PalletBalancesAccountData } from '@polkadot/types/lookup'

const { accountId } = useAuth()

const identityStore = useIdentityStore()
const { multiBalances, multiBalanceAssets } = storeToRefs(identityStore)

const mapToPrefix = {
  polkadot: 'dot',
  kusama: 'ksm',
  basilisk: 'bsx',
  statemine: 'stmn',
}

const isBalanceLoading = computed(
  () => identityStore.getStatusMultiBalances === 'loading'
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
      filterEmptyBalanceChains(multiBalances.value.chains[chain]).length !== 0
  )
})

function delimiter(amount: string | number) {
  const formatAmount = typeof amount === 'number' ? amount.toString() : amount
  const number = parseFloat(formatAmount.replace(/,/g, ''))

  return number.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

const fiatStore = useFiatStore()
function calculateUsd(amount: string, token = 'KSM') {
  if (!amount) {
    return 0
  }

  const amountToNumber = Number(amount.replace(/\,/g, ''))

  return calculateExactUsdFromToken(
    amountToNumber,
    Number(fiatStore.getCurrentTokenValue(token))
  )
}

async function getBalance(chainName: string, token = 'KSM', tokenId = 0) {
  const currentAddress = accountId.value
  const prefix = mapToPrefix[chainName]
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
        tokenId
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

  const balance = delimiter(currentBalance)
  const usd = calculateUsd(balance, token)

  identityStore.setMultiBalances({
    address: defaultAddress,
    chains: {
      [chainName]: {
        [token.toLowerCase()]: {
          address: prefixAddress,
          balance,
          nativeBalance,
          usd,
          selected: selectedTokenId === String(tokenId),
        },
      },
    },
    chainName,
  })

  await wsProvider.disconnect()
}

onMounted(async () => {
  await fiatStore.fetchFiatPrice()

  multiBalanceAssets.value.forEach((item) => {
    getBalance(item.chain, item.token, Number(item.tokenId))
  })
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
