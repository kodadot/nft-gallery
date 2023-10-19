<template>
  <NeoModal :value="isModalActive" :can-cancel="['outside', 'escape']" scroll="clip" class="top" @close="onClose">

    <div class="modal-width">

      <header class="py-5 pl-6 pr-5 is-flex is-justify-content-space-between is-align-items-center border-bottom">

        <span class="modal-card-title is-size-6 has-text-weight-bold">
          {{ $t('autoTeleport.signTransactions') }}
        </span>

        <NeoButton class="py-1 px-2" variant="text" no-shadow icon="xmark" size="medium" @click="onClose" />

      </header>

      <div class="px-6 pt-4">

        <ModalIdentityItem />

        <p class="py-2" v-dompurify-html="$t('autoTeleport.header', {
          chainName: transition.destination.name,
          amountFormatted: transition.amountFormatted,
          amountUsd: transition.amountUsd,
          sourceNetwork: transition.source?.name
        })" />

        <p>{{ $t('autoTeleport.dontExit') }}</p>

        <hr />

        <p v-dompurify-html="$t('autoTeleport.tip')" />

        <TransactionSteps :steps="steps" class="mt-4" />

      </div>


      <div class="is-flex is-justify-content-space-between py-5 px-6">
        <NeoButton :label="btnLabel" variant="k-accent" no-shadow :disabled="false"
          class="is-flex is-flex-grow-1 btn-height" @click="confirm" />
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoModal } from '@kodadot1/brick'
import { TeleportTransition, TransactionStepStatus } from '@/utils/teleport'
import TransactionSteps, { TransactionStep } from '@/components/shared/TransactionSteps/TransactionSteps.vue';
import { AutoTeleportTransactionStatus } from '@/composables/useAutoTeleport';

const emit = defineEmits(['confirm'])
const props = defineProps<{
  modelValue: boolean,
  transition: TeleportTransition,
  status: AutoTeleportTransactionStatus
}>()

const { $i18n } = useNuxtApp()
const isModalActive = useVModel(props, 'modelValue')


const teleporStepStatus = computed<TransactionStepStatus>(() => {
  const status = props.status.bridge.status.value

  if (status === TransactionStatus.Finalized) {
    return TransactionStepStatus.COMPLETED
  }

  if (props.status.bridge.error.value) {
      return TransactionStepStatus.FAILED
  }

  if (status !== TransactionStatus.Unknown ) {
    return TransactionStepStatus.LOADING
  }

  return TransactionStepStatus.WAITING
})


const steps = computed<TransactionStep[]>(() => {
  return [
    {
      title: $i18n.t('autoTeleport.steps.1.title'),
      subtitle: $i18n.t('autoTeleport.steps.1.subtitle'),
      status: teleporStepStatus,
      children: [
        {
          status: teleporStepStatus,
          title: $i18n.t('autoTeleport.steps.1_1.title'),
          subtitle: $i18n.t('autoTeleport.steps.1_1.subtitle'),
        }
      ]
    },
    {
      title: $i18n.t('autoTeleport.steps.2.title'),
      subtitle: $i18n.t('autoTeleport.steps.2.subtitle'),
      status: computed(() => TransactionStepStatus.WAITING),
    }
  ]
})

const btnLabel = computed(() => {
  return 'Finish All Steps First'
})


const onClose = () => {
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

.shade-border-color {
  @include ktheme() {
    border-color: theme('k-shade');
  }
}

.modal-width {
  width: 25rem;
}

.btn-height {
  height: 3.5rem;
}

:deep(.identity-name-font-weight-regular) {
  .identity-name {
    font-weight: unset !important;
  }
}
</style>
