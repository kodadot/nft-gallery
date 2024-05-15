import { TransactionStatus } from './useTransactionStatus'

export default ({
  isError,
  status,
}: {
  status: Ref<TransactionStatus>
  isError: Ref<boolean>
}) => {
  const isTransactionSuccessful = ref<boolean>(false)

  watchDebounced(
    [status, isError],
    () => {
      isTransactionSuccessful.value =
        TransactionStatus.Block === status.value
          ? !isError.value
          : TransactionStatus.Finalized === status.value
    },
    { debounce: 500 },
  )

  return { isTransactionSuccessful }
}
