<template>
  <div ref="container" :style="gridCols">
    <slot :is-mobile-variant="isMobileVariant" :grid="grid" />
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { usePreferencesStore } from '@/stores/preferences'

const props = withDefaults(
  defineProps<{
    defaultWidth?: {
      small: number
      medium: number
      large: number
    }
    gridSize?: 'small' | 'medium' | 'large'
    mobileVariant?: boolean
  }>(),
  {
    defaultWidth: () => ({
      small: 16 * 12, // 12rem
      medium: 16 * 15, // 15rem
      large: 16 * 20, // 20rem
    }),
    mobileVariant: true,
  }
)

const preferencesStore = usePreferencesStore()

const cols = ref(5)
const containerWidth = ref(0)
const container = ref<HTMLDivElement | null>(null)

const grid = computed(() => props.gridSize || preferencesStore.getGridSize)
const isMobileVariant = computed(
  () => props.mobileVariant && containerWidth.value <= 768
)

const updateColumns = () => {
  if (containerWidth.value) {
    const getCols = Math.floor(
      containerWidth.value / props.defaultWidth[grid.value]
    )

    cols.value = isMobileVariant.value ? 2 : getCols
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

const gridCols = computed(() => ({
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: `repeat(${cols.value}, minmax(0, 1fr))`,
}))
</script>
