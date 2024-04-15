import { useNow } from '@vueuse/core'

export default () => {
  const now = useNow()
  const estimatedEndDate = ref<Date>()

  const secondsLeft = computed<number | undefined>(() =>
    estimatedEndDate.value
      ? Math.round(
          (estimatedEndDate.value?.getTime() - now.value.getTime()) / 1000,
        )
      : undefined,
  )

  const estimatedTime = computed<string>(() => {
    const time = secondsLeft.value
    const formattedTime = time && time > 0 ? `${time}s` : 'few seconds'
    return `Est. ~ ${formattedTime}`
  })

  const start = (duration: number) => {
    const date = new Date()
    date.setSeconds(now.value.getSeconds() + duration)
    estimatedEndDate.value = date
  }

  return {
    start,
    estimatedTime,
  }
}
