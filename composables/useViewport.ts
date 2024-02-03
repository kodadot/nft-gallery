import { useWindowSize } from '@vueuse/core'

export default function () {
  const { width } = useWindowSize()
  const isMobile = computed(() => width.value <= 768)
  const isDesktop = computed(() => width.value >= 1024)
  const isFullHD = computed(() => width.value >= 1440)

  return { isMobile, isDesktop, isFullHD }
}
