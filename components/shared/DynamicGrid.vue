<template>
  <div
    ref="container"
    :class="[
      'grid',
      `gap-[${props.gapSize}px]`,
      `grid-cols-[repeat(${cols},_minmax(0,_1fr))]`,
    ]">
    <slot :is-mobile-variant="isMobileVariant" :grid="grid" />
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import {
  DEFAULT_GRID_SECTION,
  GridSection,
  type GridSize,
  usePreferencesStore,
} from '@/stores/preferences'

const props = withDefaults(
  defineProps<{
    defaultWidth?: {
      small: number
      medium: number
      large: number
    }
    gridSize?: GridSize
    mobileVariant?: boolean
    gridSection?: GridSection
    mobileCols?: number
    gapSize?: number
    persist: boolean
    fillRows?: number // total amount of items in grid
  }>(),
  {
    defaultWidth: () => ({
      small: 16 * 12, // 12rem
      medium: 16 * 15, // 15rem
      large: 16 * 20, // 20rem
    }),
    mobileVariant: true,
    gridSection: DEFAULT_GRID_SECTION,
    mobileCols: 1,
    gapSize: 16, // 1rem
    persist: false,
  },
)

const preferencesStore = usePreferencesStore()

const cols = ref(5)
const containerWidth = ref(0)
const container = ref<HTMLDivElement | null>(null)

const grid = computed(
  () =>
    props.gridSize ||
    (props.gridSection &&
      preferencesStore.getGridConfigBySection(props.gridSection)?.size),
)
const isMobileVariant = computed(
  () => props.mobileVariant && containerWidth.value <= 768,
)

const getColsFilledByAllRows = (cols: number): number => {
  if (!props.fillRows || cols === 1) {
    return cols
  }

  const areRowsFilled = (props.fillRows / cols) % 1 === 0

  return areRowsFilled ? cols : getColsFilledByAllRows(cols - 1)
}

const updateColumns = () => {
  if (containerWidth.value) {
    const currentGridItemMinWidth = props.defaultWidth[grid.value]
    const numCols = Math.floor(containerWidth.value / currentGridItemMinWidth)
    const gapsWidth = (numCols - 1) * props.gapSize
    const availableContainerWidth = containerWidth.value - gapsWidth
    const getCols = Math.floor(
      availableContainerWidth / currentGridItemMinWidth,
    )

    if (isMobileVariant.value && !props.persist) {
      cols.value = props.mobileCols
      return
    }

    cols.value = props.fillRows ? getColsFilledByAllRows(getCols) : getCols
  }
}

useResizeObserver(container, (entries) => {
  const entry = entries[0]
  containerWidth.value = entry.contentRect.width
  updateColumns()
})

watch(grid, () => {
  updateColumns()
})
</script>
