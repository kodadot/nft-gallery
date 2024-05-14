import { TransactionStatus } from './useTransactionStatus'

type Params = {
  transaction: {
    status: Ref<TransactionStatus>
    isError: Ref<boolean>
  }
  onSuccess: () => any
  onCancel?: () => void
  onError?: () => void
  successStatus?: TransactionStatus[]
  waitFor?: Array<Ref<boolean>>
}

export default ({
  transaction: { status, isError },
  onSuccess,
  onError,
  onCancel,
  successStatus = [TransactionStatus.Block, TransactionStatus.Finalized],
  waitFor = [],
}: Params) => {
  watch([status, ...waitFor], ([curStatus], [prevStatus]) => {
    if (curStatus === TransactionStatus.Cancelled) {
      return onCancel?.()
    }

    if (curStatus === TransactionStatus.Block && isError.value) {
      return onError?.()
    }

    if (
      successStatus.includes(curStatus) &&
      !successStatus.includes(prevStatus) &&
      waitFor.every((i) => i.value)
    ) {
      onSuccess()
    }
  })
}
