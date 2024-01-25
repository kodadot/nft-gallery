import { useWindowSize } from '@vueuse/core'

export default function () {
  const { width } = useWindowSize()
  const isTouch = computed(() => width.value < 1024)
  const isMobile = computed(() => width.value <= 768)
  const isTinyMobile = computed(() => width.value < 480)

  return {
    isTouch,
    isMobile,
    isTinyMobile,
  }
}
