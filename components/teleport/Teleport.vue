<template>
  <section class="mx-auto teleport-container">
    <Loader v-model="isLoading" />
    <h1 class="is-size-3 has-text-weight-bold">
      {{ $t('teleport.page') }}
    </h1>

    <h2>{{ $t('teleport.subtitle') }}</h2>
    <a
      class="has-text-grey"
      href="https://hello.kodadot.xyz/tutorial/teleport-bridge"
      >{{ $t('teleport.howItWorks') }}
    </a>

    <hr class="divider my-5" />

    <div
      class="is-flex is-align-items-center is-justify-content-space-between networks">
      <div class="w-full is-relative">
        <div class="network-title">{{ $t('teleport.source') }}</div>
        <NetworkDropdown
          :options="fromNetworks"
          :value="fromChain"
          @select="onChainChange" />
      </div>

      <div class="network-arrow is-flex has-text-color">
        <svg viewBox="0 0 39 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line y1="5.5" x2="35" y2="5.5" stroke="currentColor" />
          <line y1="11.5" x2="35" y2="11.5" stroke="currentColor" />
          <line
            x1="30.3536"
            y1="1.14645"
            x2="38.3536"
            y2="9.14645"
            stroke="currentColor" />
          <line
            x1="38.3293"
            y1="8.87629"
            x2="30.3293"
            y2="15.8763"
            stroke="currentColor" />
        </svg>
      </div>

      <div class="w-full is-relative">
        <div class="network-title">{{ $t('teleport.destination') }}</div>
        <NetworkDropdown
          :options="toNetworks"
          :value="toChain"
          @select="(chain) => onChainChange(chain, false)" />
      </div>
    </div>

    <div class="is-flex is-flex-direction-column">
      <div class="mb-3 mt-5">{{ $t('teleport.amount') }}</div>

      <div class="is-relative amount-input">
        <NeoInput
          v-model="amount"
          class=""
          step="0.01"
          type="number"
          placeholder="Enter Amount"
          :min="0" />

        <div class="is-absolute-right">
          <span
            v-if="totalFiatValue"
            class="token-value is-size-7 has-text-grey"
            >~{{ totalFiatValue }} usd</span
          >
          {{ currency }}
        </div>
      </div>

      <div
        v-if="myBalance !== undefined"
        class="is-size-7 is-flex is-justify-content-end is-align-items-center">
        <span class="is-flex is-align-items-center">
          <span class="mr-2">{{ $t('general.balance') }}:</span
          >{{ myBalanceWithoutDivision.toFixed(4) }}{{ currency }}
        </span>
        <NeoButton
          no-shadow
          rounded
          size="small"
          class="ml-2"
          @click="handleMaxClick"
          >{{ $t('teleport.max') }}</NeoButton
        >
      </div>
    </div>

    <NeoButton
      :label="
        insufficientBalance
          ? $t('teleport.insufficientBalance', [currency])
          : 'Proceed To Confirmation'
      "
      size="large"
      class="is-size-6 submit-button my-5 w-full"
      :loading="isLoading"
      :disabled="isDisabledButton"
      variant="k-accent"
      @click="sendXCM" />

    <div>
      {{ $t('teleport.receiveValue', [amount || 0, currency, toChainLabel]) }}
      <a
        v-safe-href="explorerUrl"
        target="_blank"
        rel="nofollow noopener noreferrer"
        class="has-text-k-blue">
        {{ shortAddress(toAddress) }}
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { web3Enable } from '@polkadot/extension-dapp'
import '@polkadot/api-augment'
import { getss58AddressByPrefix, toDefaultAddress } from '@/utils/account'
import { getAddress } from '@/utils/extension'
import {
  Chain,
  TeleprtType,
  chainToPrefixMap,
  whichTeleportType,
} from '@/utils/teleport'
import { notificationTypes, showNotification } from '@/utils/notification'
import useAuth from '@/composables/useAuth'
import Loader from '@/components/shared/Loader.vue'
import * as paraspell from '@paraspell/sdk'
import { calculateExactUsdFromToken } from '@/utils/calculation'
import shortAddress from '@/utils/shortAddress'
import {
  chainIcons,
  getChainEndpointByPrefix,
  getChainName,
} from '@/utils/chain'
import { txCb } from '@/utils/transactionExecutor'
import NeoInput from '~/libs/ui/src/components/NeoInput/NeoInput.vue'
import NetworkDropdown from './NetworkDropdown.vue'
import { NeoButton } from '@kodadot1/brick'
import { blockExplorerOf } from '@/utils/config/chain.config'
import { simpleDivision } from '@/utils/balance'
import { useFiatStore } from '@/stores/fiat'
import { ApiFactory } from '@kodadot1/sub-api'

const getApi = (from: Chain) => {
  const endpoint = getChainEndpointByPrefix(chainToPrefixMap[from]) as string
  return ApiFactory.useApiInstance(endpoint)
}

const { accountId } = useAuth()
const { assets } = usePrefix()
const fiatStore = useFiatStore()
const { decimalsOf } = useChain()
const fromChain = ref(Chain.POLKADOT) //Selected origin parachain
const toChain = ref(Chain.ASSETHUBPOLKADOT) //Selected destination parachain
const amount = ref() //Required amount to be transfered is stored here
const isLoading = ref(false)
const unsubscribeKusamaBalance = ref()
const { multiBalances } = useMultipleBalance()

const resetStatus = () => {
  amount.value = undefined
  isLoading.value = false
}

const currency = computed(() => {
  switch (fromChain.value) {
    case Chain.KUSAMA:
    case Chain.BASILISK:
    case Chain.ASSETHUBKUSAMA:
      return 'KSM'
    case Chain.POLKADOT:
    case Chain.ASSETHUBPOLKADOT:
      return 'DOT'
  }
})

const tokenFiatValue = computed(() => {
  switch (currency.value) {
    case 'KSM':
      return fiatStore.getCurrentKSMValue
    case 'DOT':
      return fiatStore.getCurrentDOTValue
  }
  return 0
})

const allowedTransitiosn = {
  [Chain.KUSAMA]: [Chain.BASILISK, Chain.ASSETHUBKUSAMA],
  [Chain.BASILISK]: [Chain.KUSAMA],
  [Chain.ASSETHUBKUSAMA]: [Chain.KUSAMA],
  [Chain.POLKADOT]: [Chain.ASSETHUBPOLKADOT],
  [Chain.ASSETHUBPOLKADOT]: [Chain.POLKADOT],
}
const chainBalances = {
  [Chain.KUSAMA]: () => multiBalances.value.chains.kusama?.ksm?.nativeBalance,
  [Chain.BASILISK]: () =>
    multiBalances.value.chains.basilisk?.ksm?.nativeBalance,
  [Chain.ASSETHUBKUSAMA]: () =>
    multiBalances.value.chains.kusamaHub?.ksm?.nativeBalance,
  [Chain.POLKADOT]: () =>
    multiBalances.value.chains.polkadot?.dot?.nativeBalance,
  [Chain.ASSETHUBPOLKADOT]: () =>
    multiBalances.value.chains.polkadotHub?.dot?.nativeBalance,
}

const isDisabled = (chain: Chain) => {
  return !allowedTransitiosn[fromChain.value].includes(chain)
}

const fromNetworks = [
  {
    label: getChainName('rmrk'),
    value: Chain.KUSAMA,
    icon: chainIcons.rmrk,
  },
  {
    label: getChainName('bsx'),
    value: Chain.BASILISK,
    icon: chainIcons.bsx,
  },
  {
    label: getChainName('ahk'),
    value: Chain.ASSETHUBKUSAMA,
    icon: chainIcons.ahk,
  },
  {
    label: getChainName('dot'),
    value: Chain.POLKADOT,
    icon: chainIcons.dot,
  },
  {
    label: getChainName('ahp'),
    value: Chain.ASSETHUBPOLKADOT,
    icon: chainIcons.ahp,
  },
]
const toNetworks = [
  {
    label: getChainName('rmrk'),
    value: Chain.KUSAMA,
    disabled: computed(() => isDisabled(Chain.KUSAMA)),
    icon: chainIcons.rmrk,
  },
  {
    label: getChainName('bsx'),
    value: Chain.BASILISK,
    disabled: computed(() => isDisabled(Chain.BASILISK)),
    icon: chainIcons.bsx,
  },
  {
    label: getChainName('ahk'),
    value: Chain.ASSETHUBKUSAMA,
    disabled: computed(() => isDisabled(Chain.ASSETHUBKUSAMA)),
    icon: chainIcons.ahk,
  },
  {
    label: getChainName('dot'),
    value: Chain.POLKADOT,
    disabled: computed(() => isDisabled(Chain.POLKADOT)),
    icon: chainIcons.dot,
  },
  {
    label: getChainName('ahp'),
    value: Chain.ASSETHUBPOLKADOT,
    disabled: computed(() => isDisabled(Chain.ASSETHUBPOLKADOT)),
    icon: chainIcons.ahp,
  },
]

const currentTokenDecimals = computed(() => {
  switch (fromChain.value) {
    case Chain.KUSAMA:
    case Chain.BASILISK:
    case Chain.ASSETHUBKUSAMA:
      return assets(5).decimals
    case Chain.POLKADOT:
      return decimalsOf('dot')
    case Chain.ASSETHUBPOLKADOT:
      return decimalsOf('ahp')
  }
})
const toChainLabel = computed(() =>
  getChainName(chainToPrefixMap[toChain.value]),
)

const myBalance = computed(() => {
  const getBalance = chainBalances[fromChain.value]
  if (!getBalance) {
    throw new Error(`Unsupported chain: ${fromChain.value}`)
  }
  const balance = Number(getBalance()) || 0

  return balance
})

const explorerUrl = computed(() => {
  return `${blockExplorerOf(chainToPrefixMap[toChain.value])}account/${
    toAddress.value
  }`
})
const getFirstAllowedDestination = (chain: Chain) => {
  return allowedTransitiosn[chain][0]
}

const onChainChange = (selectedChain, setFrom = true) => {
  if (setFrom) {
    fromChain.value = selectedChain
    toChain.value = getFirstAllowedDestination(selectedChain)
  } else {
    toChain.value = selectedChain
    fromChain.value = getFirstAllowedDestination(selectedChain)
  }
}
const getFromChain = (): Chain => {
  return Chain[fromChain.value.toUpperCase()] as Chain
}
const getToChain = (): Chain => {
  return Chain[toChain.value.toUpperCase()] as Chain
}

const getAddressByChain = (chain) => {
  return getss58AddressByPrefix(accountId.value, chainToPrefixMap[chain])
}
const fromAddress = computed(() => getAddressByChain(fromChain.value))
const toAddress = computed(() => getAddressByChain(toChain.value))

const totalFiatValue = computed(() =>
  calculateExactUsdFromToken(amount.value, Number(tokenFiatValue.value)),
)

const insufficientBalance = computed(
  () => Number(amount.value) > myBalanceWithoutDivision.value,
)

const myBalanceWithoutDivision = computed(() =>
  simpleDivision(myBalance.value, currentTokenDecimals.value),
)

const isDisabledButton = computed(() => {
  return !amount.value || amount.value <= 0 || insufficientBalance.value
})

const handleMaxClick = () => {
  amount.value =
    Math.floor((myBalanceWithoutDivision.value || 0) * 10 ** 4) / 10 ** 4
}

onBeforeUnmount(() => {
  unsubscribeKusamaBalance.value && unsubscribeKusamaBalance.value()
})

const getTransaction = async () => {
  const amountValue = amount.value * Math.pow(10, currentTokenDecimals.value)

  const api = await getApi(getFromChain())
  const telportType = whichTeleportType({
    from: getFromChain(),
    to: getToChain(),
  })
  if (telportType === TeleprtType.RelayToPara) {
    return paraspell
      .Builder(api)
      .to(Chain[toChain.value.toUpperCase()])
      .amount(amountValue)
      .address(toAddress.value)
      .build()
  }
  if (telportType === TeleprtType.ParaToRelay) {
    return paraspell
      .Builder(api)
      .from(Chain[fromChain.value.toUpperCase()])
      .amount(amountValue)
      .address(toAddress.value)
      .build()
  }

  if (telportType === TeleprtType.ParaToPara) {
    return paraspell
      .Builder(api)
      .from(Chain[fromChain.value.toUpperCase()])
      .to(Chain[toChain.value.toUpperCase()])
      .currency(currency.value)
      .amount(amountValue)
      .address(toAddress.value)
      .build()
  }
}

//Used to create XCM transfer
const sendXCM = async () => {
  if (!amount.value || amount.value < 0) {
    return
  }
  await web3Enable('Kodadot')
  let isFirstStatus = true
  isLoading.value = true
  const transactionHandler = txCb(
    (blockHash) => {
      showNotification(
        `Transaction finalized at blockHash ${blockHash}`,
        notificationTypes.success,
      )
      resetStatus()
    },
    (dispatchError) => {
      showNotification(dispatchError.toString(), notificationTypes.warn)
      isLoading.value = false
    },
    ({ txHash }) => {
      if (isFirstStatus) {
        showNotification(
          `Transaction hash is ${txHash.toHex()}`,
          notificationTypes.info,
        )
        isFirstStatus = false
      }
    },
  )

  const errorHandler = () => {
    showNotification('Cancelled', notificationTypes.warn)
    isLoading.value = false
  }

  const promise = await getTransaction()
  if (promise === undefined) {
    return
  }

  const injector = await getAddress(toDefaultAddress(fromAddress.value))
  promise
    .signAndSend(
      fromAddress.value,
      { signer: injector.signer },
      transactionHandler,
    )
    .catch(errorHandler)
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.teleport-container {
  @include tablet {
    width: 454px;
    margin-top: 80px;
    margin-bottom: 94px;
  }

  @include mobile {
    padding-top: 40px;
    padding-bottom: 40px;
  }
}

.is-absolute-right {
  position: absolute;
  right: 2rem;
  top: 0.75rem;
}

.amount-input {
  margin-bottom: 10px;
}

.divider {
  @include ktheme() {
    background: theme('k-shade');
  }

  @include mobile {
    width: 254px;
  }
}

.networks {
  @include tablet {
    margin-top: 52px;
    flex-direction: row;
  }

  @include mobile {
    margin-top: 52px;
    flex-direction: column;
  }
}

.network-title {
  position: absolute;
  left: 0;
  top: -28px;
  line-height: 1;
}

.network-arrow {
  min-width: 32px;
  line-height: 1;

  @include tablet {
    margin: 0 1rem;
  }

  @include mobile {
    position: relative;
    transform: rotate(90deg);
    height: 32px;
    margin-top: 2px;
    margin-bottom: 40px;

    &:before {
      content: '';
      position: absolute;
      top: 12px;
      left: 0;
      width: 8px;
      height: 8px;
      background: $white;
    }
  }
}

.dark-mode {
  .network-arrow:before {
    background: $background-dark;
  }
}
</style>
