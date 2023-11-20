import { TransactionStatus } from '@/composables/useTransactionStatus'
import { type TransactionStepWithActive } from './TransactionSteps.vue'

export const getTransactionStepDetails = (
  step: TransactionStepWithActive,
  $t,
): {
  text: string
  status: TransactionStepStatus
} => {
  const { status, isError, isActive } = step

  if (
    status === TransactionStatus.Finalized ||
    step.stepStatus === TransactionStepStatus.COMPLETED
  ) {
    return {
      status: TransactionStepStatus.COMPLETED,
      text: $t('transactionSteps.completed'),
    }
  }

  if (isError || step.stepStatus === TransactionStepStatus.FAILED) {
    return {
      text: $t('transactionSteps.error'),
      status: TransactionStepStatus.FAILED,
    }
  }

  if (status == TransactionStatus.IPFS) {
    return {
      text: $t('transactionSteps.uploading'),
      status: TransactionStepStatus.LOADING,
    }
  }

  if (
    (status !== TransactionStatus.Unknown &&
      step.stepStatus !== TransactionStepStatus.WAITING) ||
    step.stepStatus === TransactionStepStatus.LOADING
  ) {
    return {
      text: $t('transactionSteps.loading'),
      status: TransactionStepStatus.LOADING,
    }
  }

  return {
    text: !isActive
      ? $t('transactionSteps.finishAbove')
      : $t('transactionSteps.waiting'),
    status: TransactionStepStatus.WAITING,
  }
}

export enum TransactionStepStatus {
  FAILED = 'failed',
  COMPLETED = 'completed',
  WAITING = 'waiting',
  LOADING = 'loading',
}
