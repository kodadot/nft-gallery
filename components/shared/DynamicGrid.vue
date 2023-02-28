<template>
  <div ref="container" :style="gridCols">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'

const defaultWidth = {
  small: 16 * 15,
  large: 16 * 20,
}

const route = useRoute()

const cols = ref(5)
const containerWidth = ref(0)
const container = ref<HTMLDivElement | null>(null)

const grid = computed(() => (route.query.grid as string) || 'small')

const updateColumns = () => {
  if (containerWidth.value) {
    cols.value = Math.floor(containerWidth.value / defaultWidth[grid.value])
  }
}

useResizeObserver(container, (entries) => {
  const entry = entries[0]
  containerWidth.value = entry.contentRect.width
  updateColumns()
})

watch(
  () => route.query.grid,
  () => {
    updateColumns()
  }
)

const gridCols = computed(() => {
  return {
    display: 'grid',
    gap: '2rem',
    gridTemplateColumns: `repeat(${cols.value}, minmax(0, 1fr))`,
  }
})
</script>
