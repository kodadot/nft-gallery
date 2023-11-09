<template>
  <form class="mx-auto teleport-container" @submit.prevent="teleport">
    <Loader v-model="isLoading" :status="status" />
    <h1 class="is-size-3 has-text-weight-bold">
      {{ $t('teleport.page') }}
    </h1>

    <h2>{{ $t('teleport.subtitle') }}</h2>
    <a
      class="has-text-grey"
      href="https://hello.kodadot.xyz/tutorial/teleport-bridge"
      >{{ $t('teleport.howItWorks') }}
    </a>

    <hr class="my-5" />

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

    <NeoField class="mt-5">
      <template #label>
        <div class="has-text-weight-normal">{{ $t('teleport.amount') }}</div>
      </template>

      <div class="is-relative w-full">
        <NeoInput
          v-model="amount"
          root-class="w-full"
          input-class="pr-2"
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
    </NeoField>

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

    <NeoButton
      :label="
        insufficientBalance
          ? $t('teleport.insufficientBalance', [currency])
          : 'Proceed To Confirmation'
      "
      size="large"
      class="is-size-6 my-5"
      expanded
      :loading="isLoading"
      :disabled="isDisabledButton"
      native-type="submit"
      variant="k-accent" />

    <div>
      {{ $t('teleport.receiveValue', [amount || 0, currency, toChainLabel]) }}
      <a
        v-safe-href="explorerUrl"
        target="_blank"
        rel="nofollow noopener noreferrer"
        class="has-text-k-blue">
        {{ shortAddress(toAddress) }}
      </a>
      {{ $t('teleport.ownermessage') }}
    </div>
  </form>
</template>

<script setup lang="ts">
import '@polkadot/api-augment'
import {
  Chain,
  allowedTransitions,
  chainToPrefixMap,
  getChainCurrency,
} from '@/utils/teleport'
import Loader from '@/components/shared/Loader.vue'
import shortAddress from '@/utils/shortAddress'
import { chainIcons, getChainName } from '@/utils/chain'
import NeoInput from '~/libs/ui/src/components/NeoInput/NeoInput.vue'
import NetworkDropdown from './NetworkDropdown.vue'
import { NeoButton, NeoField } from '@kodadot1/brick'
import { blockExplorerOf } from '@/utils/config/chain.config'
import { simpleDivision } from '@/utils/balance'
import { useFiatStore } from '@/stores/fiat'

const {
  chainBalances,
  teleport: sendXCM,
  isLoading,
  getAddressByChain,
  getChainTokenDecimals,
  status,
} = useTeleport(true)

const fiatStore = useFiatStore()
const fromChain = ref(Chain.POLKADOT) //Selected origin parachain
const toChain = ref(Chain.ASSETHUBPOLKADOT) //Selected destination parachain
const amount = ref() //Required amount to be transfered is stored here
const unsubscribeKusamaBalance = ref()

const resetStatus = () => {
  amount.value = undefined
}

const currency = computed(() => getChainCurrency(fromChain.value))

const tokenFiatValue = computed(() => {
  switch (currency.value) {
    case 'KSM':
      return fiatStore.getCurrentKSMValue
    case 'DOT':
      return fiatStore.getCurrentDOTValue
    default:
      return 0
  }
})

const isDisabled = (chain: Chain) => {
  return !allowedTransitions[fromChain.value].includes(chain)
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

const currentTokenDecimals = computed(() =>
  getChainTokenDecimals(fromChain.value),
)

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
  return allowedTransitions[chain][0]
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

const teleport = async () => {
  const amountValue = amount.value * Math.pow(10, currentTokenDecimals.value)

  await sendXCM({
    amount: amountValue,
    from: fromChain.value,
    to: toChain.value,
    toAddress: toAddress.value,
    fromAddress: fromAddress.value,
    currency: currency.value,
    onSuccess: () => resetStatus(),
  })
}

onBeforeUnmount(() => {
  unsubscribeKusamaBalance.value && unsubscribeKusamaBalance.value()
})
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
