<template>
  <div ref="container" :style="gridCols">
    <slot :is-mobile-variant="isMobileVariant" />
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    defaultWidth: {
      small: number
      large: number
    }
    mobileVariant: boolean
  }>(),
  {
    defaultWidth: () => ({
      small: 16 * 15, // 15rem
      large: 16 * 20, // 20rem
    }),
    mobileVariant: true,
  }
)

const { $store } = useNuxtApp()

const cols = ref(5)
const containerWidth = ref(0)
const container = ref<HTMLDivElement | null>(null)

const grid = computed(() => $store.getters['preferences/getGridSize'])
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
  gap: '2rem',
  gridTemplateColumns: `repeat(${cols.value}, minmax(0, 1fr))`,
}))
</script>
