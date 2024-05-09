import { TransactionStatus } from '@/composables/useTransactionStatus'

export default (status: Ref<TransactionStatus | undefined>) => {
  const { $i18n } = useNuxtApp()
  const { estimatedTimes } = useBlockTime()

  const isTransactionInProgress = computed<boolean>(() =>
    status.value
      ? ![TransactionStatus.Unknown, TransactionStatus.Finalized].includes(
          status.value,
        )
      : false,
  )

  const initialEstimatedTime = computed<number>(
    () => estimatedTimes.value[TransactionStatus.Block],
  )

  const { estimatedTime, start } = useEstimatedTime()

  const formattedState = computed<string>(() =>
    status.value === TransactionStatus.Broadcast
      ? $i18n.t('transactionSteps.broadcastingTx')
      : estimatedTime.value,
  )

  watch(
    () => status.value === TransactionStatus.Block,
    (inBlock: boolean) => {
      if (inBlock) {
        start(initialEstimatedTime.value)
      }
    },
  )

  return { formattedState, isTransactionInProgress }
}
