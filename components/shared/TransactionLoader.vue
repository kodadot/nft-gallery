<template>
  <NeoModal
    v-model="isModalActive"
    :can-cancel="canCancel"
    mobile-breakpoint="400px"
    @close="emit('close')">
    <div class="transaction-loader-container">
      <div v-if="isFinalStep" class="is-flex py-5 px-6 is-align-items-center">
        <div class="is-flex-grow-1 text-align-center">{{ $t('success') }}</div>
        <NeoButton
          variant="text"
          no-shadow
          icon="xmark"
          icon-pack="fa-sharp"
          size="medium"
          @click.native="emit('close')" />
      </div>
      <div
        v-else
        class="is-flex is-justify-content-space-between is-align-items-center py-5 px-6 border-bottom border-k-shade">
        <span>Tx:</span>
        <div class="is-flex">
          <span>{{ `${$t('teleport.send')} ${totalUsdValue}$` }}</span>
          <span class="has-text-grey ml-4">{{
            `(${totalTokenAmount} ${token})`
          }}</span>
        </div>

        <NeoButton
          variant="text"
          no-shadow
          icon="xmark"
          icon-pack="fa-sharp"
          size="medium"
          @click.native="emit('close')" />
      </div>
      <figure class="px-6 pb-4">
        <img
          class="px-6"
          :class="{ 'py-6': isFinalStep }"
          :src="isFinalStep ? congrats : loading"
          alt="loading" />
      </figure>
      <div class="pb-4">
        <NeoSteps v-model="activeStep" step-size="0.5rem">
          <NeoStepItem
            v-for="i in 3"
            :key="i"
            :icon="checkIconForStep(i)"
            :clickable="false"
            :label="steps[i - 1].label"
            :variant="i == 3 ? 'last' : undefined">
            <div class="px-4 text-align-center">
              {{ steps[i - 1].tip }}
            </div>
          </NeoStepItem>
        </NeoSteps>
        <div class="is-flex is-justify-content-center">
          <NeoButton
            v-if="isFinalStep"
            tag="a"
            target="_blank"
            no-shadow
            rounded
            :href="explorerLink"
            :label="$i18n.t('transactionLoader.showTransaction')" />
        </div>
      </div>
    </div>
  </NeoModal>
</template>

<script lang="ts" setup>
import { NeoButton, NeoModal, NeoStepItem, NeoSteps } from '@kodadot1/brick'
import { TransactionStatus } from '@/composables/useTransactionStatus'
import { Prefix } from '@kodadot1/static'
import { chainPropListOf } from '@/utils/config/chain.config'

const props = withDefaults(
  defineProps<{
    status: TransactionStatus
    value: boolean
    totalTokenAmount: number
    token: string
    totalUsdValue: number
    transactionId: string
    canCancel?: boolean
  }>(),
  {
    canCancel: true,
  }
)
const emit = defineEmits(['close'])
const { $i18n } = useNuxtApp()

//  Transfer component reset the token to 'KSM' at the end of the transaction
//  this causes the explorer url to become wrong
//  this is a work around until
//  https://github.com/kodadot/nft-gallery/issues/6944
//  gets merged

const internalToken = ref('')

// preserve to token as it was before the transaction finalized
watch(
  () => props.token,
  () => {
    if (props.status !== TransactionStatus.Finalized) {
      internalToken.value = props.token.toLocaleLowerCase()
    }
  },
  { immediate: true }
)

const explorerLink = computed(() => {
  const explorerBaseUrl = chainPropListOf(
    internalToken.value as Prefix
  ).blockExplorer
  return `${explorerBaseUrl}extrinsic\\${props.transactionId}`
})

const activeStep = computed(() => {
  switch (props.status) {
    case TransactionStatus.Finalized:
      return 3
    case TransactionStatus.Unkonwn:
      return 1
    default:
      return 2
  }
})

const isModalActive = useVModel(props, 'value')
const steps = [
  {
    label: $i18n.t('transactionLoader.sign'),
    tip: $i18n.t('transactionLoader.signTip'),
  },
  {
    label: $i18n.t('transactionLoader.pending'),
    tip: $i18n.t('transactionLoader.pendingTip'),
  },
  {
    label: $i18n.t('transactionLoader.completed'),
    tip: $i18n.t('transactionLoader.completedTip'),
  },
]

const loading = '/preloader.svg'
const congrats = '/congrats-message-header.svg'

const isFinalStep = computed(() => activeStep.value === steps.length)

const checkIconForStep = (step: number) =>
  activeStep.value > step || step === steps.length ? 'check' : undefined
</script>

<style scoped lang="scss">
.transaction-loader-container {
  width: 27rem;
}
</style>
