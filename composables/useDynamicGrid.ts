type UseDynamicGridParams = {
  container: Ref<HTMLDivElement | undefined>
  itemMintWidth: Ref<number>
  gapSize?: Ref<number>
  fillRows?: Ref<number | undefined>
  mobileVariant?: boolean
  persist?: boolean
  mobileCols?: number
}

export default ({
  container,
  itemMintWidth,
  gapSize = ref(16),
  mobileVariant = true,
  persist = false,
  fillRows = undefined,
  mobileCols = 1,
}: UseDynamicGridParams) => {
  const containerWidth = ref(0)

  const isMobileVariant = computed(
    () => mobileVariant && containerWidth.value <= 768,
  )

  const getColsFilledByAllRows = (cols: number): number => {
    if (!fillRows?.value || cols === 1) {
      return cols
    }

    const areRowsFilled = (fillRows.value / cols) % 1 === 0

    return areRowsFilled ? cols : getColsFilledByAllRows(cols - 1)
  }

  const cols = computed(() => {
    const numCols = Math.floor(containerWidth.value / itemMintWidth.value)
    const gapsWidth = (numCols - 1) * gapSize.value
    const availableContainerWidth = containerWidth.value - gapsWidth
    const getCols = Math.floor(availableContainerWidth / itemMintWidth.value)

    if (isMobileVariant.value && !persist) {
      return mobileCols
    }

    return fillRows ? getColsFilledByAllRows(getCols) : getCols
  })

  const isReady = computed(() => Boolean(containerWidth.value))

  onMounted(() => (containerWidth.value = container.value?.clientWidth ?? 0))

  useResizeObserver(container, (entries) => {
    const entry = entries[0]
    containerWidth.value = entry.contentRect.width
  })

  return { cols, isMobileVariant, isReady }
}
