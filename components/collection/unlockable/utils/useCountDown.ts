type Duration = {
  seconds: number
  minutes: number
}

const pluralize = (count: number, singular: string, plural: string): string =>
  count === 1 ? singular : plural

const formatTimeUnit = (value: number, unit: string): string =>
  value > 0 ? `${value} ${pluralize(value, unit, unit + 's')}` : ''

const getFormattedDuration = ({ seconds, minutes }: Duration): string => {
  const formattedMinutes = formatTimeUnit(minutes, 'minute')
  const formattedSeconds = formatTimeUnit(seconds, 'second')

  if (formattedMinutes && formattedSeconds) {
    return `${formattedMinutes} ${formattedSeconds}`
  }

  return formattedMinutes || formattedSeconds || 'few seconds'
}

export const useCountDown = (
  countDownTime: number,
  immediate: boolean = true,
) => {
  const hours = ref(0)
  const minutes = ref(0)
  const seconds = ref(0)
  const timer = ref()
  const countdown = () => {
    // Get today's date and time
    const now = new Date().getTime()

    const distance = countDownTime - now
    hours.value = Math.floor(distance / (1000 * 60 * 60))
    minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    seconds.value = Math.floor((distance % (1000 * 60)) / 1000)
  }

  const start = () => {
    countdown()
    timer.value = setInterval(countdown, 1000)
  }

  onMounted(() => {
    if (immediate) {
      start()
    }
  })

  onBeforeMount(() => {
    clearInterval(timer.value)
  })

  const displayDuration = computed(() =>
    getFormattedDuration({ seconds: seconds.value, minutes: minutes.value }),
  )

  return {
    hours,
    minutes,
    seconds,
    displayDuration,
    start,
  }
}
