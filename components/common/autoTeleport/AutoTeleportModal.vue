<template>
  <NeoModal
    :value="isModalActive"
    class="z-[1000]"
    @close="onClose"
  >
    <div class="sm:w-[25rem]">
      <ModalBody
        :title="$i18n.t('autoTeleport.signTransactions')"
        @close="onClose"
      >
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

        <hr class="my-4">

        <div class="flex items-start">
          <NeoIcon
            icon="lightbulb"
            size="small"
            class="mr-2 block"
          />
          <p
            v-dompurify-html="$t('autoTeleport.tip')"
            class="text-xs capitalize"
          />
        </div>

        <p class="capitalize text-base mt-4 mb-5">
          {{ $t('autoTeleport.followSteps') }}:
        </p>

        <TransactionSteps
          :steps="steps"
          class="mt-4"
          @active="handleActiveStep"
        />

        <div class="flex justify-between pt-5">
          <NeoButton
            :label="btnLabel"
            variant="primary"
            no-shadow
            :disabled="btnDisabled"
            class="flex flex-grow btn-height"
            @click="submit"
          />
        </div>
      </ModalBody>
    </div>
  </NeoModal>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoModal } from '@kodadot1/brick'
import type { AutoTeleportInteractions } from './utils'
import { getActionDetails } from './utils'
import type { TeleportTransition } from '@/utils/teleport'
import type {
  TransactionStep,
} from '@/components/shared/TransactionSteps/TransactionSteps.vue'
import TransactionSteps from '@/components/shared/TransactionSteps/TransactionSteps.vue'
import { TransactionStepStatus } from '@/components/shared/TransactionSteps/utils'
import { type AutoTeleportTransactions } from '@/composables/autoTeleport/types'
import type { ActionsInteractions } from '@/composables/transaction/types'
import { TransactionStatus } from '@/composables/useTransactionStatus'

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
    earlySuccess?: boolean
  }>(),
  {
    autoClose: false,
    autoCloseDelay: AUTOCLOSE_DEFAULT_DELAY,
    earlySuccess: true,
  },
)

const { $i18n } = useNuxtApp()
const isModalActive = useVModel(props, 'modelValue')

const activeStep = ref(0)
const earlyCompletedActions = ref(new Map<ActionsInteractions, boolean>())
const balanceCheckState = ref<TransactionStepStatus>(
  TransactionStepStatus.WAITING,
)

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

const actionsStatus = computed<Map<ActionsInteractions, TransactionStatus>>(
  () =>
    props.transactions.actions.reduce((map, action) => {
      let status = TransactionStatus.Unknown

      if (hasCompletedActionPreSteps.value) {
        status
          = props.earlySuccess
          && earlyCompletedActions.value.get(action.interaction)
            ? TransactionStatus.Finalized
            : action.status.value
      }

      map.set(action.interaction, status)

      return map
    }, new Map()),
)

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
      stepStatus: balanceCheckState.value,
      stepStatusTextOverride: {
        [TransactionStepStatus.LOADING]: $i18n.t(
          'transactionSteps.noSignatureRequired',
        ),
      },
    },
    props.transactions.actions.map((action) => {
      return {
        title: getActionDetails(action.interaction).title,
        status: actionsStatus.value.get(action.interaction),
        isError: action.isError.value && hasCompletedActionPreSteps.value,
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

const actionsFinalized = computed(
  () =>
    hasActions.value
    && props.transactions.actions
      .map(action => actionsStatus.value.get(action.interaction))
      .every(status => status === TransactionStatus.Finalized),
)

const hasActions = computed(() => Boolean(props.transactions.actions.length))

const isBalanceCheckCompleted = computed(
  () => balanceCheckState.value === TransactionStepStatus.COMPLETED,
)

const isTeleportTransactionFinalized = computed(
  () =>
    props.transactions.teleport.status.value === TransactionStatus.Finalized,
)

const hasCompletedActionPreSteps = computed(
  () => isTeleportTransactionFinalized.value && isBalanceCheckCompleted.value,
)

const autoteleportFinalized = computed(() =>
  hasActions.value
    ? hasCompletedActionPreSteps.value && actionsFinalized.value
    : hasCompletedActionPreSteps.value,
)

const btnLabel = computed<string>(() => {
  if (!hasActions.value && isBalanceCheckCompleted.value) {
    return $i18n.t('redirect.continue')
  }

  if (
    !hasActions.value
    || !isBalanceCheckCompleted.value
    || !activeStepInteraction.value
  ) {
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

const clearModal = () => {
  balanceCheckState.value = TransactionStepStatus.WAITING
  earlyCompletedActions.value = new Map()
}

watch(
  () => props.modelValue,
  (open) => {
    if (open && props.earlySuccess) {
      props.transactions.actions.forEach((action) => {
        const { isTransactionSuccessful } = useTransactionSuccessful({
          isError: action.isError,
          status: action.status,
          isLoading: action.isLoading,
        })

        watch(
          isTransactionSuccessful,
          (active) => {
            if (active) {
              earlyCompletedActions.value.set(action.interaction, true)
            }
          },
          { once: true },
        )
      })
    }
  },
)

watch(
  [isTeleportTransactionFinalized, () => props.canDoAction],
  ([telportFinalized, canDoAction]) => {
    if (!telportFinalized || isBalanceCheckCompleted.value) {
      return
    }

    balanceCheckState.value = canDoAction
      ? TransactionStepStatus.COMPLETED
      : TransactionStepStatus.LOADING
  },
)

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

watchDebounced(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      clearModal()
    }
  },
  { debounce: 500 }, // wait for the modal closing animation to finish
)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.btn-height {
  height: 3.5rem;
}

.limit-height {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
