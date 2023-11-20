<template>
  <div>
    <TransactionStepsItem
      v-for="(step, index) in stepsWithActive"
      :key="index"
      class="mb-5"
      :step="getStepItem(step)"
      with-action
      @try-again="tryAgain(step)" />
  </div>
</template>

<script setup lang="ts">
import TransactionStepsItem, {
  type TransactionStepItem,
} from './TransactionStepsItem.vue'
import { TransactionStatus } from '@/composables/useTransactionStatus'
import { TransactionStepStatus, getTransactionStepDetails } from './utils'
import { type Prefix } from '@kodadot1/static'

export type TransactionStep = {
  txId?: string | null
  blockNumber?: string | null
  isError?: boolean
  status?: TransactionStatus
  stepStatus?: TransactionStepStatus
  title: string
  tooltip?: string
  prefix?: Prefix
  retry?: () => void
  stepStatusTextOverride?: Partial<Record<TransactionStepStatus, string>>
}

export type TransactionStepWithActive = TransactionStep & {
  isActive: boolean
}

const emit = defineEmits(['active'])
const props = defineProps<{
  steps: TransactionStep[]
}>()

const { $i18n } = useNuxtApp()

const stepsWithActive = computed<TransactionStepWithActive[]>(() =>
  props.steps.map((step, index, array) => {
    const prevStep = array[index - 1]
    const isStepStatusCompleted =
      prevStep && prevStep.stepStatus === TransactionStepStatus.COMPLETED
    const isStatusFinalized =
      prevStep && prevStep.status === TransactionStatus.Finalized

    return {
      ...step,
      isActive: index === 0 || isStepStatusCompleted || isStatusFinalized,
    }
  }),
)

watch(
  stepsWithActive,
  () => {
    const index = stepsWithActive.value.findLastIndex((step) => step.isActive)
    emit('active', index)
  },
  { immediate: true },
)

const tryAgain = (step: TransactionStepWithActive) => {
  if (step.retry) {
    step.retry()
  }
}

const getStepItem = (step: TransactionStepWithActive): TransactionStepItem => {
  const baseStep = {
    txId: step.txId as string | null,
    blockNumber: step.blockNumber as string | null,
    isError: step.isError,
    prefix: step.prefix,
    isActive: step.isActive,
    tooltip: step.tooltip,
  }

  let { status, text } = getTransactionStepDetails(step, $i18n.t)

  if (step.stepStatusTextOverride?.hasOwnProperty(status)) {
    text = step.stepStatusTextOverride[status] || ''
  }

  return {
    ...baseStep,
    status: step.stepStatus ? step.stepStatus : status,
    title: step.title,
    subtitle: text,
  }
}
</script>
