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
    { debounce: 500 }, // tx eroror case: status gets updated before errorCb is called and isError is updated
  )

  return { isTransactionSuccessful }
}
