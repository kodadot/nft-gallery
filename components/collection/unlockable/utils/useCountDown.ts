const getFormattedDuration = ({
  seconds,
  minutes,
}: {
  seconds: number
  minutes: number
}) => {
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}${
      seconds ? ` ${seconds} seconds` : ''
    }`
  }
  return seconds >= 0 ? `${seconds} seconds` : 'few seconds'
}

export const useCountDown = (countDownTime: number) => {
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

  countdown()
  onMounted(() => {
    timer.value = setInterval(countdown, 1000)
  })

  onBeforeMount(() => {
    clearInterval(timer.value)
  })

  const displayDuration = computed(() =>
    getFormattedDuration({ seconds: seconds.value, minute$: minutes.value }),
  )

  return {
    hours,
    minutes,
    seconds,
    displayDuration,
  }
}
