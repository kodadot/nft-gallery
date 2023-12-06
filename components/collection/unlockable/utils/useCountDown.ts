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

  const displayDuration = computed(() => {
    if (minutes.value > 0) {
      return `${minutes.value} minute${minutes.value > 1 ? 's' : ''}${
        seconds.value ? ` ${seconds.value} seconds` : ''
      }`
    }
    return seconds.value >= 0 ? `${seconds.value} seconds` : 'few seconds'
  })

  return {
    hours,
    minutes,
    seconds,
    displayDuration,
  }
}
