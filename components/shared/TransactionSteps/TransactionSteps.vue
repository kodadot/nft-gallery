<template>
  <div>
    <div v-for="(step, index) in stepsWithActive" :key="index">
      <TransactionStepsItem
        class="mb-3"
        :step="getStepItem(step)"
        :active="false" />

      <template v-if="step.withAction">
        <TransactionStepsItem
          class="mb-3"
          :step="getStepItem(step, true)"
          is-child
          with-action
          @try-again="tryAgain(step)" />
      </template>
    </div>
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
  isError?: boolean
  status?: TransactionStatus
  stepStatus?: TransactionStepStatus
  title?: string
  subtitle?: string
  withAction?: boolean
  prefix?: Prefix
  retry?: () => void
}

type TransactionStepWithActive = TransactionStep & { isActive: boolean }

const emit = defineEmits(['active'])
const props = defineProps<{
  steps: TransactionStep[]
}>()

const { $i18n } = useNuxtApp()

const stepsWithActive = computed<TransactionStepWithActive[]>(() =>
  props.steps.map((step, index, array) => {
    const prevStep = array[index - 1]
    const status = prevStep && (prevStep.stepStatus || prevStep.status)

    return {
      ...step,
      isActive: index === 0 || status === TransactionStepStatus.COMPLETED,
    }
  }),
)

watch(stepsWithActive, () => {
  const index = stepsWithActive.value.findLastIndex((step) => step.isActive)
  emit('active', index)
})

const tryAgain = (step: TransactionStepWithActive) => {
  if (step.retry) {
    step.retry()
  }
}

const getStepItem = (
  step: TransactionStepWithActive,
  isAction = false,
): TransactionStepItem => {
  const baseStep = {
    txId: step.txId,
    isError: step.isError,
    prefix: step.prefix,
    isActive: step.isActive,
  }

  const { status, title, subtitle } = getTransactionStepDetails(step, $i18n.t)

  if (isAction) {
    return {
      ...baseStep,
      status,
      title,
      subtitle,
    }
  }

  return {
    ...baseStep,
    status: step.stepStatus ? step.stepStatus : status,
    title: step.title,
    subtitle: step.subtitle,
  }
}
</script>
