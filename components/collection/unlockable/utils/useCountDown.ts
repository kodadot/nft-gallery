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

export const getCountDownTime = (seconds: number) =>
  new Date().getTime() + seconds * 1000

export const useCountDown = ({
  countDownTime,
  immediate = true,
}: {
  countDownTime?: number
  immediate?: boolean
}) => {
  const distance = ref(0)
  const hours = ref(0)
  const minutes = ref(0)
  const seconds = ref(0)
  const timer = ref()

  const cdTime = ref<number>(0)

  const countdown = () => {
    // Get today's date and time
    const now = new Date().getTime()

    distance.value = cdTime.value - now
    hours.value = Math.floor(distance.value / (1000 * 60 * 60))
    minutes.value = Math.floor(
      (distance.value % (1000 * 60 * 60)) / (1000 * 60),
    )
    seconds.value = Math.floor((distance.value % (1000 * 60)) / 1000)
  }

  const startCountDown = (time: number) => {
    cdTime.value = time
    countdown()
    timer.value = setInterval(countdown, 1000)
  }

  onMounted(() => {
    if (immediate && countDownTime) {
      startCountDown(countDownTime)
    }
  })

  const stop = () => clearInterval(timer.value)

  onBeforeMount(stop)

  const displayDuration = computed(() =>
    getFormattedDuration({ seconds: seconds.value, minutes: minutes.value }),
  )

  watch(distance, () => {
    if (distance.value <= 0) {
      stop()
    }
  })

  return {
    hours,
    minutes,
    seconds,
    displayDuration,
    distance,
    startCountDown,
  }
}
