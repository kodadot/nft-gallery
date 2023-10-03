<template>
  <NeoModal
    :value="modelValue"
    :can-cancel="canCancel"
    :no-shadow="isMobile"
    :content-class="[isMobile ? 'mobile-modal' : '']"
    @close="emit('close')"
    @update:active="updateActive">
    <div :class="{ 'desktop-width': !isMobile }">
      <div v-if="isFinalStep" class="is-flex py-5 px-6 is-align-items-center">
        <div class="is-flex-grow-1 text-align-center">{{ $t('success') }}</div>
        <NeoButton
          variant="text"
          no-shadow
          icon="xmark"
          size="medium"
          @click="emit('close')" />
      </div>
      <div
        v-else
        class="is-flex is-justify-content-space-between is-align-items-center py-5 px-6 border-bottom border-k-shade">
        <span>Tx:</span>
        <div class="is-flex">
          <slot name="action-title">
            <span>{{ `${$t('teleport.send')} ${totalUsdValue}$` }}</span>
            <span class="has-text-grey ml-1 is-uppercase">{{
              `(${totalTokenAmount} ${urlPrefix})`
            }}</span>
          </slot>
        </div>

        <NeoButton
          variant="text"
          no-shadow
          icon="xmark"
          size="medium"
          @click="emit('close')" />
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
        <div v-if="activeStep === 2" class="text-align-center has-text-grey">
          {{ `Est. waiting time ~ ${estmiatedTimeLeft}` }}
        </div>
        <div v-if="isFinalStep" class="is-flex is-justify-content-center mb-4">
          <NeoButton
            v-safe-href="explorerLink"
            tag="a"
            target="_blank"
            class="px-4"
            no-shadow
            rounded
            :label="$i18n.t('transactionLoader.showTransaction')" />

          <NeoButton
            v-clipboard:copy="explorerLink"
            icon="copy"
            class="ml-4 px-4"
            rounded
            no-shadow
            @click="toast($i18n.t('transactionLoader.copyTransactionLink'))" />
        </div>
      </div>
    </div>
  </NeoModal>
</template>

<script lang="ts" setup>
import { NeoButton, NeoModal, NeoStepItem, NeoSteps } from '@kodadot1/brick'
import { TransactionStatus } from '@/composables/useTransactionStatus'
import { chainPropListOf } from '@/utils/config/chain.config'

const props = withDefaults(
  defineProps<{
    status: TransactionStatus
    modelValue: boolean
    totalTokenAmount?: number
    totalUsdValue?: number
    transactionId: string
    canCancel?: boolean
    isMobile?: boolean
  }>(),
  {
    canCancel: true,
    isMobile: false,
  }
)
const emit = defineEmits(['close', 'update:modelValue'])
const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { blocktime } = useBlockTime()
const { toast } = useToast()

const estmiatedTimeLeft = computed(() => {
  switch (props.status) {
    case TransactionStatus.Broadcast:
      return 3 * blocktime.value
    case TransactionStatus.Block:
      return 2 * blocktime.value
    default:
      return 0
  }
})

const explorerLink = computed(() => {
  const explorerBaseUrl = chainPropListOf(urlPrefix.value).blockExplorer
  return `${explorerBaseUrl}extrinsic/${props.transactionId}`
})

const activeStep = computed(() => {
  switch (props.status) {
    case TransactionStatus.Finalized:
      return 3
    case TransactionStatus.Unknown:
      return 1
    default:
      return 2
  }
})

const updateActive = (value: boolean) => {
  emit('update:modelValue', value)
}

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
  activeStep.value > step || activeStep.value === steps.length
    ? 'check'
    : undefined
</script>

<style scoped lang="scss">
.desktop-width {
  width: 27rem;
}
:deep(.mobile-modal) {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0.75rem 0.75rem 0 0;
  border-right: 0 !important;
  border-left: 0 !important;
  border-bottom: 0 !important;
}
</style>
