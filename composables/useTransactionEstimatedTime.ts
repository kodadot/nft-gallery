import { TransactionStatus } from '@/composables/useTransactionStatus'
import { useNow } from '@vueuse/core'

export default (status: Ref) => {
  const now = useNow()
  const estimatedEndDate = ref<Date>()

  const { estimatedTimes } = useBlockTime()

  const isActive = computed<boolean>(
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

  watch(isActive, (active) => {
    if (active) {
      const date = new Date()
      date.setSeconds(now.value.getSeconds() + initialEstimatedTime.value)
      estimatedEndDate.value = date
    }
  })

  return { estimatedTime, isActive }
}
