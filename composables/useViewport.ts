import { useWindowSize } from '@vueuse/core'

export default function () {
  const isMobile = computed(() => useWindowSize().width.value <= 768)

  return { isMobile }
}
