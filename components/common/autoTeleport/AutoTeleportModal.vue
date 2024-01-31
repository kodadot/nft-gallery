<template>
  <NeoModal
    :value="isModalActive"
    :can-cancel="['outside', 'escape']"
    scroll="clip"
    class="z-[1000]"
    @close="onClose">
    <div class="modal-width">
      <header class="py-5 pl-6 pr-5 flex justify-between items-center border-b">
        <span class="modal-card-title is-size-6 font-bold">
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

        <p class="py-2 capitalize">
          <strong>
            {{ $t('bridging') }} {{ transition.amountFormatted }}
          </strong>
          {{ $t('general.to') }}
          <strong>{{ mainActionDetails.action }}</strong>
          {{ mainActionDetails.item }} {{ $t('general.on') }}
          {{ transition.destination?.name }}
        </p>

        <p class="text-xs text-k-grey">
          {{ $t('autoTeleport.dontExit') }}
        </p>

        <hr class="my-4" />

        <div class="flex items-start">
          <NeoIcon icon="lightbulb" size="small" class="mr-2 block" />
          <p
            v-dompurify-html="$t('autoTeleport.tip')"
            class="text-xs capitalize" />
        </div>

        <p class="capitalize is-size-6 mt-4 mb-5">
          {{ $t('autoTeleport.followSteps') }}:
        </p>

        <TransactionSteps
          :steps="steps"
          class="mt-4"
          @active="handleActiveStep" />

        <div class="flex justify-between pt-5">
          <NeoButton
            :label="btnLabel"
            variant="k-accent"
            no-shadow
            :disabled="btnDisabled"
            class="flex flex-grow btn-height"
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
import { AutoTeleportInteractions, getActionDetails } from './utils'

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
    interaction?: AutoTeleportInteractions
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

const mainInteraction = computed(
  () => props.interaction || props.transactions.actions[0].interaction,
)

const mainActionDetails = computed(() => {
  const details = getActionDetails(mainInteraction.value)

  return {
    action: details.action,
    item: details.item,
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
      return {
        title: getActionDetails(action.interaction).title,
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
  return !autoteleportFinalized.value
})

const actionsFinalized = computed(() =>
  props.transactions.actions
    .map((action) => action.status)
    .every((status) => status.value === TransactionStatus.Finalized),
)

const hasActions = computed(() => props.transactions.actions.length)

const hasCompletedBalanceCheck = computed(
  () => steps.value[1].stepStatus === TransactionStepStatus.COMPLETED,
)

const autoteleportFinalized = computed(() =>
  hasActions.value ? actionsFinalized.value : hasCompletedBalanceCheck.value,
)

const btnLabel = computed<string>(() => {
  if (!hasActions.value && hasCompletedBalanceCheck.value) {
    return $i18n.t('redirect.continue')
  }

  if (!hasActions.value || !props.canDoAction || !activeStepInteraction.value) {
    return $i18n.t('autoTeleport.completeAllRequiredSteps')
  }

  if (!actionsFinalized.value) {
    return getActionDetails(activeStepInteraction.value).submit
  }

  return $i18n.t('autoTeleport.close')
})

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
  if (autoteleportFinalized.value) {
    onClose()
  }
}

const onClose = () => {
  emit('close', autoteleportFinalized.value)
}

watch(autoteleportFinalized, () => {
  if (autoteleportFinalized.value) {
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
