import { TransactionStatus } from '@/composables/useTransactionStatus'
import { type TransactionStepWithActive } from './TransactionSteps.vue'

export const getTransactionStepDetails = (
  step: TransactionStepWithActive,
  $t,
): {
  subtitle: string
  status: TransactionStepStatus
} => {
  const { status, isError, isLast, isActive } = step

  if (
    status === TransactionStatus.Finalized ||
    step.stepStatus === TransactionStepStatus.COMPLETED
  ) {
    return {
      status: TransactionStepStatus.COMPLETED,
      subtitle: $t('transactionSteps.completed'),
    }
  }

  if (isError || step.stepStatus === TransactionStepStatus.FAILED) {
    return {
      subtitle: $t('transactionSteps.error'),
      status: TransactionStepStatus.FAILED,
    }
  }

  if (status == TransactionStatus.IPFS) {
    return {
      subtitle: $t('transactionSteps.uploading'),
      status: TransactionStepStatus.LOADING,
    }
  }

  if (step.withOuthSignature) {
    const isNotLoading = step.stepStatus !== TransactionStepStatus.LOADING
    return {
      subtitle: isNotLoading
        ? $t('transactionSteps.noSignatureRequired')
        : $t('transactionSteps.loading'),
      status: isNotLoading
        ? TransactionStepStatus.WAITING
        : TransactionStepStatus.LOADING,
    }
  }

  if (status !== TransactionStatus.Unknown) {
    return {
      subtitle: $t('transactionSteps.loading'),
      status: TransactionStepStatus.LOADING,
    }
  }

  return {
    subtitle:
      isLast && !isActive
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
