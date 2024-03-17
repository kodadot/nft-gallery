<template>
  <div ref="container" :style="gridCols">
    <slot :is-mobile-variant="isMobileVariant" :grid="grid" />
  </div>
</template>

<script setup lang="ts">
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
    persist?: boolean
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

const container = ref<HTMLDivElement>()

const grid = computed(
  () =>
    props.gridSize ||
    (props.gridSection &&
      preferencesStore.getGridConfigBySection(props.gridSection)?.size),
)

const { cols, isMobileVariant } = useDynamicGrid({
  container,
  itemMintWidth: computed(() => props.defaultWidth[grid.value] || undefined),
  gapSize: computed(() => props.gapSize),
  mobileVariant: props.mobileVariant,
  persist: props.persist,
  fillRows: computed(() => props.fillRows),
  mobileCols: props.mobileCols,
})

const gridCols = computed(() => ({
  display: 'grid',
  gap: `${props.gapSize}px`,
  gridTemplateColumns: `repeat(${cols.value}, minmax(0, 1fr))`,
}))
</script>
