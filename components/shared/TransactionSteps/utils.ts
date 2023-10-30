import { TransactionStatus } from '@/composables/useTransactionStatus'
import { TransactionStep } from './TransactionSteps.vue'

export const getTransactionStepDetails = (
  step: TransactionStep,
  $t,
): {
  title: string
  subtitle?: string
  status: TransactionStepStatus
} => {
  const { status, isError } = step

  if (status === TransactionStatus.Finalized) {
    return {
      title: $t('transactionSteps.completed.title'),
      status: TransactionStepStatus.COMPLETED,
    }
  }

  if (isError) {
    return {
      title: $t('transactionSteps.error.title'),
      subtitle: $t('transactionSteps.error.subtitle'),
      status: TransactionStepStatus.FAILED,
    }
  }

  if (status !== TransactionStatus.Unknown) {
    return {
      title: $t('transactionSteps.loading.title'),
      subtitle: $t('transactionSteps.loading.subtitle'),
      status: TransactionStepStatus.LOADING,
    }
  }

  return {
    title: $t('transactionSteps.waiting.title'),
    subtitle: $t('transactionSteps.waiting.subtitle'),
    status: TransactionStepStatus.WAITING,
  }
}

export enum TransactionStepStatus {
  FAILED = 'failed',
  COMPLETED = 'completed',
  WAITING = 'waiting',
  LOADING = 'loading',
}
