import { TransactionStatus } from './useTransactionStatus'

type Params = {
  transaction: {
    status: Ref<TransactionStatus>
    isError: Ref<boolean>
  }
  onSuccess?: () => any
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
  watch([status, isError, ...waitFor], ([status, isError], [prevStatus]) => {
    if (status === TransactionStatus.Cancelled) {
      return onCancel?.()
    }

    if ([TransactionStatus.Unknown, TransactionStatus.Block].includes(status) && isError) {
      return onError?.()
    }

    if (
      successStatus.includes(status)
      && !successStatus.includes(prevStatus)
      && waitFor.every(i => i.value)
    ) {
      onSuccess?.()
    }
  })
}
