import { TransactionStepStatus } from '@/utils/teleport'
import { TransactionStatus } from '@/composables/useTransactionStatus'
import { TransactionStep } from './TransactionSteps.vue'

export const getTransactionStepDetails = (
  step: TransactionStep,
): {
  title: string
  subtitle?: string
  status: TransactionStepStatus
} => {
  const { status, isError, isLoading } = step

  if (status === TransactionStatus.Finalized) {
    return {
      title: 'Completed',
      status: TransactionStepStatus.COMPLETED,
    }
  }

  if (isError) {
    return {
      title: 'Please sign transaction',
      subtitle: 'Failed',
      status: TransactionStepStatus.FAILED,
    }
  }

  if (status !== TransactionStatus.Unknown || isLoading) {
    return {
      title: 'Transaction pending',
      subtitle: '(please wait)',
      status: TransactionStepStatus.LOADING,
    }
  }

  return {
    title: 'Please sign transaction',
    subtitle: '(Waiting for your approval)',
    status: TransactionStepStatus.WAITING,
  }
}
