import { TransactionStatus } from '@/composables/useTransactionStatus'
import { useNow } from '@vueuse/core'

export default (status: Ref) => {
  const { $i18n } = useNuxtApp()
  const now = useNow()
  const estimatedEndDate = ref<Date>()

  const { estimatedTimes } = useBlockTime()

  const isTransactionInProgress = computed<boolean>(
    () =>
      ![TransactionStatus.Unknown, TransactionStatus.Finalized].includes(
        status.value,
      ),
  )

  const initialEstimatedTime = computed<number>(
    () => estimatedTimes.value[TransactionStatus.Block],
  )

  const secondsLeft = computed<number | undefined>(() => {
    if (!estimatedEndDate.value) {
      return undefined
    }

    return Math.round(
      (estimatedEndDate.value?.getTime() - now.value.getTime()) / 1000,
    )
  })

  const estimatedTime = computed<string>(() => {
    const time = secondsLeft.value

    return time && time > 0 ? `${time}s` : 'few seconds'
  })

  const formattedState = computed<string>(() =>
    status.value === TransactionStatus.Broadcast
      ? $i18n.t('transactionSteps.broadcastingTx')
      : `Est. ~ ${estimatedTime.value}`,
  )

  watch(
    () => status.value === TransactionStatus.Block,
    (inBlock: boolean) => {
      if (inBlock) {
        const date = new Date()
        date.setSeconds(now.value.getSeconds() + initialEstimatedTime.value)
        estimatedEndDate.value = date
      }
    },
  )

  return { formattedState, isTransactionInProgress }
}
