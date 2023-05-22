<template>
  <div>
    <div class="balance">
      <div class="balance-row has-text-grey is-size-7">
        <div>{{ $t('general.chain') }}</div>
        <div class="has-text-right">{{ $t('general.balance') }}</div>
        <div class="has-text-right">{{ $t('general.token') }}</div>
        <div class="has-text-right">{{ $t('general.usd') }}</div>
      </div>

      <div
        v-for="(chain, key) in multiBalances.chains"
        :key="key"
        class="is-size-7">
        <div v-for="(detail, token) in chain" :key="token" class="balance-row">
          <div>{{ key.toUpperCase() }}</div>
          <div class="has-text-right">
            {{ detail?.balance }}
          </div>
          <div class="has-text-right">{{ token.toUpperCase() }}</div>
          <div class="has-text-right">${{ delimiter(detail?.usd || '0') }}</div>
        </div>
      </div>

      <NeoSkeleton
        v-if="identityStore.getStatusMultiBalances === 'loading'"
        animated />
    </div>

    <hr class="my-2" />
    <p
      class="is-flex is-justify-content-space-between is-align-items-center my-1">
      <span class="is-size-7"> {{ $i18n.t('spotlight.total') }}: </span>
      <span>${{ delimiter(identityStore.getTotalUsd) }}</span>
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

import { useIdentityStore } from '@/stores/identity'

import type { PalletBalancesAccountData } from '@polkadot/types/lookup'

const { accountId } = useAuth()

const identityStore = useIdentityStore()
const { multiBalances, multiBalanceAssets } = storeToRefs(identityStore)

const mapToPrefix = {
  kusama: 'ksm',
  basilisk: 'bsx',
  statemine: 'stmn',
}

function delimiter(amount: string | number) {
  const formatAmount = typeof amount === 'number' ? amount.toString() : amount
  const number = parseFloat(formatAmount.replace(/,/g, ''))

  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
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
    Number(
      token === 'KSM'
        ? fiatStore.getCurrentKSMValue
        : fiatStore.getCurrentBSXValue
    )
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
