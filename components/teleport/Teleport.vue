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
        @click="teleport" />
    </div>
  </section>
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
import { getChainName } from '@/utils/chain'
import TeleportTabs from './TeleportTabs.vue'
import { NeoButton } from '@kodadot1/brick'
import { blockExplorerOf } from '@/utils/config/chain.config'
import { simpleDivision } from '@/utils/balance'
import { useFiatStore } from '@/stores/fiat'

const { $i18n } = useNuxtApp()
const {
  chainBalances,
  teleport: sendXCM,
  isLoading,
  getAddressByChain,
  getChainTokenDecimals,
} = useTeleport(true)

const fiatStore = useFiatStore()
const fromChain = ref(Chain.KUSAMA) //Selected origin parachain
const toChain = ref(Chain.BASILISK) //Selected destination parachain
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
    value: Chain.ASSETHUBKUSAMA,
  },
  {
    label: getChainName('dot'),
    value: Chain.POLKADOT,
  },
  {
    label: getChainName('ahp'),
    value: Chain.ASSETHUBPOLKADOT,
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
    value: Chain.ASSETHUBKUSAMA,
    disabled: computed(() => isDisabled(Chain.ASSETHUBKUSAMA)),
  },
  {
    label: getChainName('dot'),
    value: Chain.POLKADOT,
    disabled: computed(() => isDisabled(Chain.POLKADOT)),
  },
  {
    label: getChainName('ahp'),
    value: Chain.ASSETHUBPOLKADOT,
    disabled: computed(() => isDisabled(Chain.ASSETHUBPOLKADOT)),
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

onBeforeUnmount(() => {
  unsubscribeKusamaBalance.value && unsubscribeKusamaBalance.value()
})

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
