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
import { AutoTeleportTransactionStatus } from '@/composables/useAutoTeleport'

const emit = defineEmits(['confirm', 'close', 'telport:retry'])
const props = defineProps<{
  modelValue: boolean
  transition: TeleportTransition
  canDoAction: boolean
  status: AutoTeleportTransactionStatus
}>()

const { $i18n } = useNuxtApp()
const isModalActive = useVModel(props, 'modelValue')

const steps = computed<TransactionStep[]>(() => {
  return [
    {
      title: $i18n.t('autoTeleport.steps.1.title'),
      subtitle: $i18n.t('autoTeleport.steps.1.subtitle'),
      status: props.status.teleport.status.value,
      error: props.status.teleport.error.value,
      txId: props.status.teleport.txId.value,
      prefix: props.transition.source?.prefix,
      withAction: true,
      retry: () => emit('telport:retry'),
    },
    {
      title: $i18n.t('autoTeleport.steps.2.title'),
      subtitle: $i18n.t('autoTeleport.steps.2.subtitle'),
      stepStatus: props.canDoAction
        ? TransactionStepStatus.COMPLETED
        : TransactionStepStatus.WAITING,
    },
    {
      title: $i18n.t('autoTeleport.steps.3.title'),
      subtitle: $i18n.t('autoTeleport.steps.3.subtitle'),
      status: props.status.action.status.value,
      error: props.status.action.error.value,
      txId: props.status.action.txId.value,
      prefix: props.transition.destination?.prefix,
      withAction: true,
    },
  ]
})

const btnLabel = computed(() => {
  return 'Finish All Steps First'
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
