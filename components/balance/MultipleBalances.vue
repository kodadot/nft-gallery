<template>
  <div>
    <div class="balance">
      <div class="balance-row has-text-grey is-size-7">
        <div>{{ $t('general.chain') }}</div>
        <div class="has-text-right">{{ $t('general.balance') }}</div>
        <div class="has-text-right">{{ $t('general.token') }}</div>
        <div class="has-text-right">{{ $t('general.usd') }}</div>
      </div>

      <div v-for="(chain, key) in availableChains" :key="key" class="is-size-7">
        <div v-for="token in chain" :key="token.token" class="balance-row">
          <div>{{ key }}</div>
          <div class="has-text-right">
            {{ token.balance }}
          </div>
          <div class="has-text-right">{{ token.token }}</div>
          <div class="has-text-right">${{ delimiter(token.usd) }}</div>
        </div>
      </div>

      <NeoSkeleton v-if="status === 'loading'" animated />
    </div>

    <hr class="my-2" />
    <p
      class="is-flex is-justify-content-space-between is-align-items-center my-1">
      <span class="is-size-7"> {{ $i18n.t('spotlight.total') }}: </span>
      <span>${{ delimiter(sumUsd) }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ApiPromise, WsProvider } from '@polkadot/api'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { CHAINS, ENDPOINT_MAP } from '@kodadot1/static'
import { NeoSkeleton } from '@kodadot1/brick'
import { balanceOf } from '@kodadot1/sub-api'

import format from '@/utils/format/balance'
import { useFiatStore } from '@/stores/fiat'
import { calculateExactUsdFromToken } from '@/utils/calculation'
import { getAssetIdByAccount, getKusamaAssetId } from '@/utils/api/bsx/query'

import type { PalletBalancesAccountData } from '@polkadot/types/lookup'

interface Token {
  token: string
  balance: string
  usd: number
  selected: boolean
}

interface Chain {
  [key: string]: Token[]
}

const { accountId } = useAuth()

const status = ref('loading')
const availableChains = reactive<Chain>({
  Kusama: [],
  Statemine: [],
  Basilisk: [],
  Polkadot: [],
})

const mapToPrefix = {
  Kusama: 'ksm',
  Basilisk: 'bsx',
  Statemine: 'stmn',
  Polkadot: 'dot',
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
const totalUsd = ref([0])
const sumUsd = computed(() => totalUsd.value.reduce((a, b) => a + b, 0))
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

async function getBalance(chainName, token = 'KSM', tokenId = 0) {
  const currentAddress = accountId.value
  const prefix = mapToPrefix[chainName]
  const chain = CHAINS[prefix]

  const publicKey = decodeAddress(currentAddress)
  const prefixAddress = encodeAddress(publicKey, chain.ss58Format)
  const wsProvider = new WsProvider(ENDPOINT_MAP[prefix])

  const api = await ApiPromise.create({
    provider: wsProvider,
  })

  let currentBalance

  if (tokenId) {
    const balance = await api.query.tokens.accounts(prefixAddress, tokenId)
    currentBalance = format(
      (balance as PalletBalancesAccountData).free,
      chain.tokenDecimals,
      false
    )
  } else {
    const balance = await balanceOf(api, prefixAddress)
    currentBalance = format(balance, chain.tokenDecimals, false)
  }

  let selectedTokenId = String(tokenId)
  if (chainName === 'Basilisk') {
    selectedTokenId = await getAssetIdByAccount(api, prefixAddress)
  }

  const balance = delimiter(currentBalance)
  const usd = calculateUsd(balance, token)

  availableChains[chainName].push({
    token,
    balance,
    usd,
    selected: selectedTokenId === String(tokenId),
  })
  totalUsd.value.push(usd)

  await wsProvider.disconnect()
}

onMounted(async () => {
  await fiatStore.fetchFiatPrice()

  Promise.all([
    getBalance('Kusama'),
    getBalance('Statemine'),
    getBalance('Polkadot', 'DOT'),
    getBalance('Basilisk', 'BSX'),
    getBalance('Basilisk', 'KSM', Number(getKusamaAssetId('bsx'))),
  ]).then(() => {
    status.value = 'done'
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
