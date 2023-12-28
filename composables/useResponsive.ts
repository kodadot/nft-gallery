import { useResizeObserver } from '@vueuse/core'

export default function (container: Ref<HTMLDivElement | null>) {
  const desktop = ref(true)
  const desktopBreakPoint = 1024
  const variant = computed(() => (desktop.value ? 'Desktop' : 'Touch'))

  useResizeObserver(container, (entry) => {
    if (entry[0].contentRect.width >= desktopBreakPoint) {
      desktop.value = true
    } else {
      desktop.value = false
    }
  })

  return { variant, desktop }
}
