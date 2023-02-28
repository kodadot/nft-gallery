<template>
  <div ref="container" :style="gridCols">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'

const defaultWidth = {
  small: 16 * 15, // 15rem
  large: 16 * 20, // 20rem
}

const { $store } = useNuxtApp()

const cols = ref(5)
const containerWidth = ref(0)
const container = ref<HTMLDivElement | null>(null)

const grid = computed(() => $store.getters['preferences/getGridSize'])

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

watch(grid, () => {
  updateColumns()
})

const gridCols = computed(() => ({
  display: 'grid',
  gap: '2rem',
  gridTemplateColumns: `repeat(${cols.value}, minmax(0, 1fr))`,
}))
</script>
