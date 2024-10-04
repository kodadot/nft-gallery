import { TransactionStatus } from './useTransactionStatus'

type TransactionSuccessfulParams = {
  isError: Ref<boolean>
  status: Ref<TransactionStatus>
  isLoading: Ref<boolean>
}

export default ({
  isError,
  status,
  isLoading,
}: TransactionSuccessfulParams) => {
  const isSuccessful = ref<boolean>(false)

  const isTransactionSuccessful = (status: TransactionStatus, isError: boolean) => {
    if ([
      TransactionStatus.Unknown,
      TransactionStatus.Casting,
      TransactionStatus.Broadcast,
    ].includes(status)) {
      return false
    }

    return TransactionStatus.Block === status ? !isError : TransactionStatus.Finalized === status
  }

  watch(isLoading, (loading) => {
    if (loading) {
      isSuccessful.value = false
    }
  })

  watchDebounced(
    [status, isError],
    ([status, isError]) => {
      isSuccessful.value = isTransactionSuccessful(status, isError)
    },
    { debounce: 500 }, // tx eroror case: status gets updated before errorCb is called and isError is updated
  )

  return { isTransactionSuccessful: isSuccessful }
}
