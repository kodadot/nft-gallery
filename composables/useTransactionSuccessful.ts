import { TransactionStatus } from './useTransactionStatus'

export default ({
  isError,
  status,
}: {
  status: Ref<TransactionStatus>
  isError: Ref<boolean>
}) => {
  const isTransactionSuccessful = computed<boolean>(() =>
    TransactionStatus.Block === status.value
      ? !isError.value
      : TransactionStatus.Finalized === status.value,
  )

  return { isTransactionSuccessful }
}
