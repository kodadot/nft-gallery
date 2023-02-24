import type { Ref } from '#app'

export const useDynamicGrid = (gridRef: Ref<HTMLDivElement | null>) => {
  const route = useRoute()

  const defaultWidth = {
    small: 16 * 15,
    large: 16 * 20,
  }

  const cols = ref(5)
  const width = ref(defaultWidth.small)
  const containerWidth = ref(0)

  const gridCols = computed(() => {
    if (containerWidth) {
      const size = (route.query.grid as string) || 'small'
      width.value = defaultWidth[size]
      cols.value = Math.floor(containerWidth.value / width.value)
    }

    return {
      display: 'grid',
      gap: '2rem',
      gridTemplateColumns: `repeat(${cols.value}, minmax(0, 1fr))`,
    }
  })

  onMounted(() => {
    containerWidth.value = gridRef.value?.clientWidth || 1440
  })

  return { gridCols }
}
