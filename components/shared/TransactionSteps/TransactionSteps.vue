<template>
  <div>
    <div v-for="(step, index) in steps" :key="index">
      <TransactionStepsItem
        class="mb-3"
        :step="getStepItem(step)"
        :active="false" />

      <template v-if="step.withAction">
        <TransactionStepsItem
          class="mb-3"
          :step="getStepItem(step, true)"
          is-child
          with-action />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TransactionStepStatus } from '@/utils/teleport'
import TransactionStepsItem, {
  type TransactionStepItem,
} from './TransactionStepsItem.vue'
import { TransactionStatus } from '@/composables/useTransactionStatus'
import { getTransactionStepDetails } from './utils'
import { type Prefix } from '@kodadot1/static'

export type TransactionStep = {
  txId?: string | null
  error?: string | null
  status?: TransactionStatus
  stepStatus?: TransactionStepStatus
  title?: string
  subtitle?: string
  withAction?: boolean
  prefix?: Prefix
}

defineProps<{
  steps: TransactionStep[]
}>()

const getStepItem = (
  step: TransactionStep,
  isAction = false,
): TransactionStepItem => {
  const baseStep = {
    txId: step.txId,
    error: step.error,
    prefix: step.prefix,
  }

  const { status, title, subtitle } = getTransactionStepDetails(step)

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
