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

      <div class="px-6 pt-4 pb-5 limit-height">
        <ModalIdentityItem />

        <p class="py-2 is-capitalized">
          <strong>
            {{ $t('bridging') }} {{ transition.amountFormatted }}
          </strong>
          {{ $t('general.to') }}
          <strong>{{ mainActionDetails.action }}</strong>
          {{ mainActionDetails.item }} {{ $t('general.on') }}
          {{ transition.destination?.name }}
        </p>

        <p class="is-size-7 has-text-k-grey">
          {{ $t('autoTeleport.dontExit') }}
        </p>

        <hr class="my-4" />

        <div class="is-flex is-align-items-flex-start">
          <NeoIcon icon="lightbulb" size="small" class="mr-2 is-block" />
          <p
            v-dompurify-html="$t('autoTeleport.tip')"
            class="is-size-7 is-capitalized" />
        </div>

        <p class="is-capitalized is-size-6 mt-4 mb-5">
          {{ $t('autoTeleport.followSteps') }}:
        </p>

        <TransactionSteps
          :steps="steps"
          class="mt-4"
          @active="handleActiveStep" />

        <div class="is-flex is-justify-content-space-between pt-5">
          <NeoButton
            :label="btnLabel"
            variant="k-accent"
            no-shadow
            :disabled="btnDisabled"
            class="is-flex is-flex-grow-1 btn-height"
            @click="submit" />
        </div>
      </div>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoModal } from '@kodadot1/brick'
import { TeleportTransition } from '@/utils/teleport'
import TransactionSteps, {
  TransactionStep,
} from '@/components/shared/TransactionSteps/TransactionSteps.vue'
import { TransactionStepStatus } from '@/components/shared/TransactionSteps/utils'
import { type AutoTeleportTransactions } from '@/composables/autoTeleport/types'

export type ActionDetails = {
  title: string
  subtitle: string
  submit: string
}

const AUTOCLOSE_DEFAULT_DELAY = 3000

const emit = defineEmits([
  'close',
  'completed',
  'telport:retry',
  'action:start',
  'action:retry',
])
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    transition: TeleportTransition
    canDoAction: boolean
    transactions: AutoTeleportTransactions
    autoClose?: boolean
    autoCloseDelay?: number
  }>(),
  {
    autoClose: false,
    autoCloseDelay: AUTOCLOSE_DEFAULT_DELAY,
  },
)

const activeStep = ref(0)
const { $i18n } = useNuxtApp()
const isModalActive = useVModel(props, 'modelValue')

const checkBalanceState = computed<TransactionStepStatus>(() => {
  let status = TransactionStepStatus.WAITING

  if (
    props.transactions.teleport.status.value === TransactionStatus.Finalized
  ) {
    if (props.canDoAction) {
      status = TransactionStepStatus.COMPLETED
    } else {
      status = TransactionStepStatus.LOADING
    }
  }

  return status
})

const mainActionDetails = computed(() => {
  const interaction =
    props.transactions.actions[0].interaction?.toLocaleLowerCase()
  return {
    action: $i18n.t(`autoTeleport.steps.${interaction}.action`),
    item: $i18n.t(`autoTeleport.steps.${interaction}.item`),
  }
})

const steps = computed<TransactionStep[]>(() => {
  return [
    {
      title: $i18n.t('autoTeleport.steps.1.title'),
      tooltip: $i18n.t('autoTeleport.steps.1.tooltip'),
      status: props.transactions.teleport.status.value,
      isError: props.transactions.teleport.isError.value,
      txId: props.transactions.teleport.txId.value,
      prefix: props.transition.source?.prefix,
      retry: () => emit('telport:retry'),
    },
    {
      title: $i18n.t('autoTeleport.steps.2.title'),
      tooltip: $i18n.t('autoTeleport.steps.2.tooltip'),
      stepStatus: checkBalanceState.value,
      stepStatusTextOverride: {
        [TransactionStepStatus.LOADING]: $i18n.t(
          'transactionSteps.noSignatureRequired',
        ),
      },
    },
    props.transactions.actions.map((action) => {
      const { title } = getActionDetails(action.interaction)
      return {
        title,
        status: action.status.value,
        isError: action.isError.value,
        txId: action.txId.value,
        blockNumber: action.blockNumber?.value,
        isLoading: action.isLoading.value,
        prefix: props.transition.destination?.prefix,
        retry: () => emit('action:retry', action.interaction),
      }
    }),
  ].flat()
})

const handleActiveStep = (step) => {
  activeStep.value = step
}

const btnDisabled = computed(() => {
  return !actionsFinalized.value
})

const actionsFinalized = computed(() =>
  props.transactions.actions
    .map((action) => action.status)
    .every((status) => status.value === TransactionStatus.Finalized),
)

const btnLabel = computed(() => {
  if (!props.canDoAction || !activeStepInteraction.value) {
    return $i18n.t('autoTeleport.completeAllRequiredSteps')
  }

  if (!actionsFinalized.value) {
    return getActionDetails(activeStepInteraction.value).submit
  }

  return $i18n.t('autoTeleport.close')
})

const getActionDetails = (interaction: string) => {
  const i = interaction.toLocaleLowerCase()
  return {
    title: $i18n.t(`autoTeleport.steps.${i}.title`),
    submit: $i18n.t(`autoTeleport.steps.${i}.submit`),
  }
}

const FIRST_ACTION_STEP = 2
const activeStepInteraction = computed(
  () =>
    props.transactions.actions[activeStep.value - FIRST_ACTION_STEP]
      ?.interaction,
)

watch(activeStep, () => {
  const isActionStep = activeStep.value >= FIRST_ACTION_STEP
  if (isActionStep) {
    emit('action:start', activeStepInteraction.value)
  }
})

const submit = () => {
  if (actionsFinalized.value) {
    onClose()
  }
}

const onClose = () => {
  emit('close')
}

watch(actionsFinalized, () => {
  if (actionsFinalized.value) {
    emit('completed')

    if (props.autoClose) {
      setTimeout(() => {
        onClose()
      }, props.autoCloseDelay)
    }
  }
})
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

.limit-height {
  max-height: 80vh;
  overflow-y: auto;
}

@include mobile() {
  .modal-width {
    width: unset;
  }
}
</style>
