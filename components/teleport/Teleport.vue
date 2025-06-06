<template>
  <form
    class="mx-auto teleport-container"
    @submit.prevent="checkEDBeforeTeleport"
  >
    <SigningModal
      :title="$t('teleport.bridging', [amountAfterFees.displayValue, currency])"
      :is-loading="isLoading"
      :status="status"
      @try-again="teleport"
    />

    <h1 class="text-3xl font-bold">
      {{ $t('teleport.page') }}
    </h1>

    <h2>{{ $t('teleport.subtitle') }}</h2>
    <a
      class="text-k-blue! hover:text-k-blue-hover!"
      href="https://hello.kodadot.xyz/tutorial/teleport-bridge"
    >{{ $t('teleport.howItWorks') }}
    </a>

    <hr class="my-5">

    <div class="flex items-center justify-between networks">
      <div class="w-full relative">
        <div class="network-title">
          {{ $t('teleport.source') }}
        </div>
        <NetworkDropdown
          :options="fromNetworks"
          :value="fromChain"
          @select="onChainChange"
        />
      </div>

      <div
        class="network-arrow text-text-color hover:text-link-hover flex cursor-pointer py-2"
        @click="switchChains"
      >
        <svg
          viewBox="0 0 39 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            y1="5.5"
            x2="35"
            y2="5.5"
            stroke="currentColor"
          />
          <line
            y1="11.5"
            x2="35"
            y2="11.5"
            stroke="currentColor"
          />
          <line
            x1="30.3536"
            y1="1.14645"
            x2="38.3536"
            y2="9.14645"
            stroke="currentColor"
          />
          <line
            x1="38.3293"
            y1="8.87629"
            x2="30.3293"
            y2="15.8763"
            stroke="currentColor"
          />
        </svg>
      </div>

      <div class="w-full relative">
        <div class="network-title">
          {{ $t('teleport.destination') }}
        </div>
        <NetworkDropdown
          :options="toNetworks"
          :value="toChain"
          @select="(chain) => onChainChange(chain, false)"
        />
      </div>
    </div>

    <NeoField class="mt-5">
      <template #label>
        <div class="font-normal">
          {{ $t('teleport.amount') }}
        </div>
      </template>

      <div class="relative w-full">
        <NeoInput
          v-model="displayAmount"
          root-class="w-full"
          input-class="pr-2"
          min="0.01"
          step="0.00001"
          type="number"
          icon-right-class="hidden!"
          placeholder="Enter Amount"
        />
        <div class="absolute right-8 top-3">
          <span
            v-if="totalFiatValue"
            class="token-value text-xs text-k-grey"
          >~{{ totalFiatValue }} usd</span>
          {{ currency }}
        </div>
      </div>
    </NeoField>

    <div class="text-xs flex justify-content align-items flex-direction">
      <TeleportFundsAtRiskWarning
        v-if="showEDWarning && !isDisabledButton && myBalance"
        :target-existential-deposit="targetExistentialDeposit.displayValue"
        :source-existential-deposit="sourceExistentialDeposit.displayValue"
        :reason="warningReason"
      />
      <div class="flex justify-between w-full">
        <span class="flex items-center">
          <span class="mr-2">{{ $t('general.balance') }}:</span>
          <template v-if="myBalance">
            {{
              withoutDecimals({
                value: myBalance,
                prefix: chainToPrefixMap[fromChain],
              })
            }}{{ currency }}
          </template>
          <NeoSkeleton
            v-else
            no-margin
            width="80px"
          />
        </span>
        <span class="flex items-center text-k-grey whitespace-nowrap">
          <span class="mr-1">{{ $t('transfers.networkFee') }}:</span>
          <template v-if="teleportFee">
            {{ withoutDecimals({
              value: teleportFee,
              prefix: chainToPrefixMap[fromChain],
            }) }}{{ currency }}
          </template>
          <NeoSkeleton
            v-else
            no-margin
            width="60px"
          />
        </span>
        <!-- <NeoButton
          no-shadow
          rounded
          size="small"
          class="ml-2"
          @click="handleMaxClick"
          >{{ $t('teleport.max') }}</NeoButton
        > -->
      </div>
    </div>

    <NeoButton
      :label="teleportLabel"
      size="large"
      class="text-base my-5 capitalize"
      expanded
      :loading="isLoading"
      :disabled="isDisabledButton"
      native-type="submit"
      variant="primary"
    />

    <div>
      {{
        $t('teleport.receiveValue', [
          amountAfterFees.displayValue || 0,
          currency,
          toChainLabel,
        ])
      }}
      <a
        v-safe-href="explorerUrl"
        target="_blank"
        rel="nofollow noopener noreferrer"
        class="text-k-blue! hover:text-k-blue-hover!"
      >
        {{ shortAddress(toAddress) }}
      </a>
      {{ $t('teleport.ownerMessage') }}
    </div>
    <TeleportEDWarningModal
      v-model="insufficientEDModalOpen"
      :target-existential-deposit="targetExistentialDeposit.displayValue"
      :source-existential-deposit="sourceExistentialDeposit.displayValue"
      :reason="warningReason"
      :currency="currency"
      @close="insufficientEDModalOpen = false"
    />
  </form>
</template>

<script setup lang="ts">
import '@polkadot/api-augment'
import { NeoButton, NeoField, NeoInput, NeoSkeleton } from '@kodadot1/brick'
import {
  existentialDeposit,
  teleportExistentialDeposit,
} from '@kodadot1/static'
import NetworkDropdown from './NetworkDropdown.vue'
import {
  Chain,
  allowedTransitions,
  chainToPrecisionMap,
  chainToPrefixMap,
  getChainCurrency,
  getTransactionFee,
} from '@/utils/teleport'
import formatBalance from '@/utils/format/balance'
import shortAddress from '@/utils/shortAddress'
import { chainIcons, getChainName } from '@/utils/chain'
import { blockExplorerOf } from '@/utils/config/chain.config'
import { useFiatStore } from '@/stores/fiat'
import { BUFFER_FEE_PERCENT } from '@/composables/autoTeleport/useAutoTeleportTransitionDetails'

type ValuePair = {
  value: number
  displayValue: number | string
}

const {
  chainBalances,
  teleport: sendXCM,
  isLoading,
  getAddressByChain,
  getChainTokenDecimals,
  fetchChainsBalances,
  status,
} = useTeleport(true)

const { $i18n } = useNuxtApp()
const { withDecimals, withoutDecimals } = useChain()
const fiatStore = useFiatStore()
const fromChain = ref(Chain.POLKADOT) // Selected origin parachain
const toChain = ref(Chain.ASSETHUBPOLKADOT) // Selected destination parachain
const amount = ref(0) // Required amount to be transferred is stored here
const { urlPrefix } = usePrefix()

const displayAmount = computed({
  get: () =>
    withoutDecimals({
      value: amount.value,
      prefix: chainToPrefixMap[fromChain.value],
    }),
  set: (newValue) => {
    amount.value = withDecimals(newValue, chainToPrefixMap[fromChain.value])
  },
})
const unsubscribeKusamaBalance = ref()
const teleportFee = ref()
const requestId = ref(0)
const insufficientEDModalOpen = ref(false)

const sourceExistentialDeposit: ValuePair = reactive({
  value: computed(
    () => teleportExistentialDeposit[chainToPrefixMap[fromChain.value]],
  ),
  displayValue: computed(() =>
    withoutDecimals({
      value: sourceExistentialDeposit.value,
      prefix: chainToPrefixMap[fromChain.value],
      digits: chainToPrecisionMap[fromChain.value],
    }),
  ),
})

const targetExistentialDeposit: ValuePair = reactive({
  value: computed(() => existentialDeposit[chainToPrefixMap[toChain.value]]),
  displayValue: computed(() =>
    withoutDecimals({
      value: targetExistentialDeposit.value,
      prefix: chainToPrefixMap[toChain.value],
      digits: chainToPrecisionMap[toChain.value],
    }),
  ),
})

const amountAfterFees: ValuePair = reactive({
  value: computed(() => Math.max(amount.value - teleportFee.value, 0)),
  displayValue: computed(() =>
    formatBalance(amountAfterFees.value, currentTokenDecimals.value, false),
  ),
})

const warningReason = computed(() =>
  insufficientExistentialDepositOnTargetChain.value ? 'target' : 'source',
)

const insufficientAmountAfterFees = computed(() => amountAfterFees.value === 0)

const recieverBalance = computed(
  () => Number(chainBalances.value[toChain.value]) || 0,
)

const insufficientExistentialDepositOnTargetChain = computed(() => {
  // any balance in the reciever account indicates that the account already exists
  // and therefore must contain the existential deposit
  if (recieverBalance.value > 0) {
    return false
  }
  return Boolean(
    targetExistentialDeposit.value
    && amountAfterFees.value
    && targetExistentialDeposit.value > amountAfterFees.value,
  )
})
const insufficientExistentialDepositOnSourceChain = computed(() => {
  const remainingBalance = myBalance.value - amount.value
  // allowed to send the entire balance, as this will not result in loss of funds
  // on the source chain due to existential deposit
  if (remainingBalance === 0) {
    return false
  }
  return remainingBalance < sourceExistentialDeposit.value
})

const insufficientBalance = computed(() => amount.value > myBalance.value)

const showEDWarning = computed(
  () =>
    insufficientExistentialDepositOnTargetChain.value
    || insufficientExistentialDepositOnSourceChain.value,
)

const teleportLabel = computed(() => {
  if (insufficientBalance.value) {
    return $i18n.t('teleport.insufficientBalance', [currency.value])
  }

  if (insufficientAmountAfterFees.value && amount.value !== 0) {
    return $i18n.t('teleport.insufficientAmountAfterFees')
  }

  return $i18n.t('teleport.proceedToConfirmation')
})

const resetStatus = () => {
  amount.value = 0
}

const handleTeleportSuccess = () => {
  fetchChainsBalances([fromChain.value, toChain.value])
  resetStatus()
}

const switchChains = () => {
  const temp = fromChain.value
  fromChain.value = toChain.value
  toChain.value = temp
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
    label: getChainName('ksm'),
    value: Chain.KUSAMA,
    icon: chainIcons.ksm,
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
    label: getChainName('ksm'),
    value: Chain.KUSAMA,
    disabled: computed(() => isDisabled(Chain.KUSAMA)),
    icon: chainIcons.ksm,
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

const myBalance = computed(
  () => Number(chainBalances.value[fromChain.value]) || 0,
)

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
  }
  else {
    toChain.value = selectedChain
    fromChain.value = getFirstAllowedDestination(selectedChain)
  }
}

const setRelatedChain = () => {
  const relatedFromChain = prefixToChainMap[urlPrefix.value] || Chain.POLKADOT
  onChainChange(relatedFromChain, true)
}

watch(
  urlPrefix,
  () => {
    setRelatedChain()
  },
  {
    immediate: true,
  },
)

const fromAddress = computed(() => getAddressByChain(fromChain.value))
const toAddress = computed(() => getAddressByChain(toChain.value))

const totalFiatValue = computed(() =>
  calculateExactUsdFromToken(displayAmount.value, Number(tokenFiatValue.value)),
)

const isDisabledButton = computed(() => {
  return (
    !amount.value
    || amount.value <= 0
    || insufficientBalance.value
    || insufficientAmountAfterFees.value
    || !teleportFee.value
  )
})

// const handleMaxClick = () => {
//   amount.value = myBalance.value
// }

const checkEDBeforeTeleport = () => {
  if (showEDWarning.value) {
    insufficientEDModalOpen.value = true
  }
  else {
    teleport()
  }
}

const teleport = async () => {
  await sendXCM({
    amount: amountAfterFees.value,
    from: fromChain.value,
    to: toChain.value,
    toAddress: toAddress.value,
    fromAddress: fromAddress.value,
    currency: currency.value,
    onSuccess: handleTeleportSuccess,
  })
}

const fetchTransactionFee = async () => {
  const currentRequestId = ++requestId.value

  const fee = await getTransactionFee({
    amount: amount.value || 10000000,
    from: fromChain.value,
    to: toChain.value,
    toAddress: toAddress.value,
    fromAddress: fromAddress.value,
    currency: currency.value,
  })

  if (currentRequestId === requestId.value) {
    teleportFee.value = Math.ceil(Number(fee) * (1 + BUFFER_FEE_PERCENT))
  }
}

watch(fromChain, fetchTransactionFee)
watch(amount, () => teleportFee.value = undefined)
watchDebounced(amount, fetchTransactionFee, { debounce: 500, immediate: true })

onBeforeUnmount(() => {
  unsubscribeKusamaBalance.value && unsubscribeKusamaBalance.value()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/mixins';
$xs-breakpoint: 400px;

.flex-direction {
  @media (max-width: $xs-breakpoint) {
    flex-direction: column;
    gap: 0.25rem;
  }
}

.align-items {
  align-items: center;

  @media (max-width: $xs-breakpoint) {
    align-items: flex-start;
  }
}

.teleport-container {
  @include bulma-tablet {
    width: 454px;
    margin-top: 80px;
    margin-bottom: 94px;
  }

  @include bulma-mobile {
    padding-top: 40px;
    padding-bottom: 40px;
  }
}

.justify-content {
  justify-content: space-between;

  @media (max-width: $xs-breakpoint) {
    justify-content: flex-end;
  }
}

.networks {
  @include bulma-tablet {
    margin-top: 52px;
    flex-direction: row;
  }

  @include bulma-mobile {
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

  @include bulma-tablet {
    margin: 0 1rem;
  }

  @include bulma-mobile {
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
      background: var(--white);
    }
  }
}

.dark {
  .network-arrow:before {
    background: var(--background-color);
  }
}
</style>
