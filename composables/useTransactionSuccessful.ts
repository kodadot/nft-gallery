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
  const isTransactionSuccessful = ref<boolean>(false)

  watch(isLoading, (loading) => {
    if (loading) {
      isTransactionSuccessful.value = false
    }
  })

  watchDebounced(
    [status, isError],
    () => {
      isTransactionSuccessful.value
        = TransactionStatus.Block === status.value
          ? !isError.value
          : TransactionStatus.Finalized === status.value
    },
    { debounce: 500 }, // tx eroror case: status gets updated before errorCb is called and isError is updated
  )

  return { isTransactionSuccessful }
}
