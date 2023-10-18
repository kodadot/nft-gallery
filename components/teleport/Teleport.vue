<template>
  <section class="is-flex is-justify-content-center">
    <div class="teleport-container">
      <Loader v-model="isLoading" />
      <h1 class="is-size-3 has-text-weight-bold">
        {{ $i18n.t('teleport.page') }}
      </h1>
      <div class="mb-5">
        <h3 class="has-text-weight-bold">{{ $i18n.t('teleport.from') }}</h3>
        <TeleportTabs
          :tabs="fromTabs"
          :value="fromChain"
          @select="onChainChange" />
      </div>

      <div class="mb-5 is-flex is-flex-direction-column">
        <div
          class="is-flex is-justify-content-space-between is-align-items-center input-wrapper">
          <input
            v-model="amount"
            class="transfer-amount is-flex is-align-items-center"
            type="number"
            placeholder="type your amount"
            :min="0" />
          <div
            class="token is-flex is-align-items-center is-justify-content-center">
            <span v-if="totalFiatValue" class="token-value is-size-7"
              >~{{ totalFiatValue }} usd</span
            >
            {{ currency }}
          </div>
        </div>

        <div
          v-if="myBalance !== undefined"
          class="is-size-7 is-flex is-justify-content-end is-align-items-center">
          <span class="is-flex is-align-items-center">
            <span class="mr-2">{{ $i18n.t('balance') }}:</span
            >{{ myBalanceWithoutDivision.toFixed(4) }}{{ currency }}
          </span>
          <a class="max-button ml-2" @click="handleMaxClick">{{
            $i18n.t('teleport.max')
          }}</a>
        </div>
      </div>

      <div class="mb-5">
        <h3 class="has-text-weight-bold">{{ $i18n.t('teleport.to') }}</h3>
        <TeleportTabs
          :tabs="toTabs"
          :value="toChain"
          @select="(chain) => onChainChange(chain, false)" />
      </div>

      <div class="mb-5">
        {{
          $i18n.t('teleport.receiveValue', [
            amount || 0,
            currency,
            toChainLabel,
          ])
        }}
        <a
          v-safe-href="explorerUrl"
          target="_blank"
          rel="nofollow noopener noreferrer"
          class="short-address">
          {{ shortAddress(toAddress) }}
        </a>
      </div>

      <NeoButton
        :label="
          insufficientBalance
            ? $t('teleport.insufficientBalance', [currency])
            : $t('teleport.send')
        "
        size="large"
        class="is-size-6 submit-button"
        :loading="isLoading"
        :disabled="isDisabledButton"
        variant="k-accent"
        @click="sendXCM" />
    </div>
  </section>
</template>

<script setup lang="ts">
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
import { getChainEndpointByPrefix, getChainName } from '@/utils/chain'
import { txCb } from '@/utils/transactionExecutor'
import TeleportTabs from './TeleportTabs.vue'
import { NeoButton } from '@kodadot1/brick'
import { blockExplorerOf } from '@/utils/config/chain.config'
import { simpleDivision } from '@/utils/balance'
import { useFiatStore } from '@/stores/fiat'
import { useIdentityStore } from '@/stores/identity'
import { ApiFactory } from '@kodadot1/sub-api'

const getApi = (from: Chain) => {
  const endpoint = getChainEndpointByPrefix(chainToPrefixMap[from]) as string
  return ApiFactory.useApiInstance(endpoint)
}

const { accountId } = useAuth()
const { assets } = usePrefix()
const { $i18n } = useNuxtApp()
const fiatStore = useFiatStore()
const identityStore = useIdentityStore()
const { decimalsOf } = useChain()
const fromChain = ref(Chain.KUSAMA) //Selected origin parachain
const toChain = ref(Chain.BASILISK) //Selected destination parachain
const amount = ref() //Required amount to be transfered is stored here
const isLoading = ref(false)
const unsubscribeKusamaBalance = ref()
const resetStatus = () => {
  amount.value = undefined
  isLoading.value = false
}

const currency = computed(() => {
  switch (fromChain.value) {
    case Chain.KUSAMA:
    case Chain.BASILISK:
    case Chain.STATEMINE:
      return 'KSM'
    case Chain.POLKADOT:
    case Chain.STATEMINT:
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
  [Chain.KUSAMA]: [Chain.BASILISK, Chain.STATEMINE],
  [Chain.BASILISK]: [Chain.KUSAMA],
  [Chain.STATEMINE]: [Chain.KUSAMA],
  [Chain.POLKADOT]: [Chain.STATEMINT],
  [Chain.STATEMINT]: [Chain.POLKADOT],
}
const chainBalances = {
  [Chain.KUSAMA]: () =>
    identityStore.multiBalances.chains.kusama?.ksm?.nativeBalance,
  [Chain.BASILISK]: () =>
    identityStore.multiBalances.chains.basilisk?.ksm?.nativeBalance,
  [Chain.STATEMINE]: () =>
    identityStore.multiBalances.chains.kusamaHub?.ksm?.nativeBalance,
  [Chain.POLKADOT]: () =>
    identityStore.multiBalances.chains.polkadot?.dot?.nativeBalance,
  [Chain.STATEMINT]: () =>
    identityStore.multiBalances.chains.polkadotHub?.dot?.nativeBalance,
}

const isDisabled = (chain: Chain) => {
  return !allowedTransitiosn[fromChain.value].includes(chain)
}

const fromTabs = [
  {
    label: getChainName('rmrk'),
    value: Chain.KUSAMA,
  },
  {
    label: getChainName('bsx'),
    value: Chain.BASILISK,
  },
  {
    label: getChainName('ahk'),
    value: Chain.STATEMINE,
  },
  {
    label: getChainName('dot'),
    value: Chain.POLKADOT,
  },
  {
    label: getChainName('ahp'),
    value: Chain.STATEMINT,
  },
]
const toTabs = [
  {
    label: getChainName('rmrk'),
    value: Chain.KUSAMA,
    disabled: computed(() => isDisabled(Chain.KUSAMA)),
  },
  {
    label: getChainName('bsx'),
    value: Chain.BASILISK,
    disabled: computed(() => isDisabled(Chain.BASILISK)),
  },
  {
    label: getChainName('ahk'),
    value: Chain.STATEMINE,
    disabled: computed(() => isDisabled(Chain.STATEMINE)),
  },
  {
    label: getChainName('dot'),
    value: Chain.POLKADOT,
    disabled: computed(() => isDisabled(Chain.POLKADOT)),
  },
  {
    label: getChainName('ahp'),
    value: Chain.STATEMINT,
    disabled: computed(() => isDisabled(Chain.STATEMINT)),
  },
]

const currentTokenDecimals = computed(() => {
  switch (fromChain.value) {
    case Chain.KUSAMA:
    case Chain.BASILISK:
    case Chain.STATEMINE:
      return assets(5).decimals
    case Chain.POLKADOT:
      return decimalsOf('dot')
    case Chain.STATEMINT:
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
  if (process.client) {
    const { web3Enable } = await import('@polkadot/extension-dapp')
    await web3Enable('Kodadot')
  }
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
@import '@/assets/styles/abstracts/variables.scss';

.teleport-container {
  max-width: 50rem;

  .submit-button {
    width: 100%;
    height: 3.5rem;
  }

  .short-address,
  .max-button {
    @include ktheme() {
      color: theme('k-blue');
    }
  }
}

.input-wrapper {
  @include ktheme() {
    border: 1px solid theme('border-color');
  }

  .token {
    width: 16rem;
    position: relative;

    .token-value {
      position: absolute;
      left: 0;
      transform: translateX(-110%);

      @include ktheme() {
        color: theme('k-grey');
      }
    }
  }

  .transfer-amount {
    border: none;

    @include ktheme() {
      color: theme('text-color');
      border-right: 1px solid theme('border-color');
      background: theme('background-color');
    }

    background: transparent;
    padding: 0 0.5rem;
    height: 54px;
    outline: none;
    width: 100%;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
    }
    -moz-appearance: textfield;
  }
}
</style>
