<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    class="top"
    @close="onClose">
    <div class="modal-width">
      <header
        class="py-5 pl-6 pr-5 is-flex is-justify-content-space-between is-align-items-center border-bottom">
        <span class="modal-card-title is-size-6 has-text-weight-bold">
          {{ $t('autoTeleport.signTransactions') }}
        </span>

        <NeoButton
          class="py-1 px-2"
          variant="text"
          no-shadow
          icon="xmark"
          size="medium"
          @click="onClose" />
      </header>

      <div class="px-6 pt-4">
        <ModalIdentityItem />

        <p
          v-dompurify-html="
            $t('autoTeleport.header', {
              chainName: transition.destination.name,
              amountFormatted: transition.amountFormatted,
              amountUsd: transition.amountUsd,
              sourceNetwork: transition.source?.name,
            })
          "
          class="py-2" />

        <p>{{ $t('autoTeleport.dontExit') }}</p>

        <hr />

        <p v-dompurify-html="$t('autoTeleport.tip')" />

        <TransactionSteps :steps="steps" class="mt-4" />
      </div>

      <div class="is-flex is-justify-content-space-between py-5 px-6">
        <NeoButton
          :label="btnLabel"
          variant="k-accent"
          no-shadow
          :disabled="!canDoAction"
          class="is-flex is-flex-grow-1 btn-height"
          @click="confirm" />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoModal } from '@kodadot1/brick'
import { TeleportTransition, TransactionStepStatus } from '@/utils/teleport'
import TransactionSteps, {
  TransactionStep,
} from '@/components/shared/TransactionSteps/TransactionSteps.vue'
import { type AutoTeleportTransactions } from '@/composables/autoTeleport/useAutoTeleport'

const emit = defineEmits(['confirm', 'close', 'telport:retry'])
const props = defineProps<{
  modelValue: boolean
  transition: TeleportTransition
  canDoAction: boolean
  transactions: AutoTeleportTransactions
}>()

const { $i18n } = useNuxtApp()
const isModalActive = useVModel(props, 'modelValue')

const steps = computed<TransactionStep[]>(() => {
  let step2Status = TransactionStepStatus.WAITING

  if (
    props.transactions.teleport.status.value === TransactionStatus.Finalized
  ) {
    if (props.canDoAction) {
      step2Status = TransactionStepStatus.COMPLETED
    } else {
      step2Status = TransactionStepStatus.LOADING
    }
  }

  return [
    {
      title: $i18n.t('autoTeleport.steps.1.title'),
      subtitle: $i18n.t('autoTeleport.steps.1.subtitle'),
      status: props.transactions.teleport.status.value,
      isError: props.transactions.teleport.isError.value,
      txId: props.transactions.teleport.txId.value,
      prefix: props.transition.source?.prefix,
      withAction: true,
      retry: () => emit('telport:retry'),
    },
    {
      title: $i18n.t('autoTeleport.steps.2.title'),
      subtitle: $i18n.t('autoTeleport.steps.2.subtitle'),
      stepStatus: step2Status,
    },
    {
      title: $i18n.t('autoTeleport.steps.3.title'),
      subtitle: $i18n.t('autoTeleport.steps.3.subtitle'),
      status: props.transactions.action.status.value,
      isError: props.transactions.action.isError.value,
      txId: props.transactions.action.txId.value,
      prefix: props.transition.destination?.prefix,
      withAction: true,
    },
  ]
})

const btnLabel = computed(() => {
  if (!props.canDoAction) {
    return $i18n.t('autoTeleport.finishAllStepsFirst')
  }
  return $i18n.t('autoTeleport.buyNFT')
})

const onClose = () => {
  emit('close')
}

const confirm = () => {
  emit('confirm')
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.top {
  z-index: 1000;
}

.modal-width {
  width: 25rem;
}

.btn-height {
  height: 3.5rem;
}
</style>
