<template>
  <NeoField addons-class="mb-0" class="mb-0">
    <template v-for="grid in grids">
      <NeoButton
        v-if="sizes.includes(grid.size)"
        :key="grid.size"
        :icon-left="grid.icon"
        :active="gridSize === grid.size"
        @click="changeGridLayout(grid.class, grid.size)" />
    </template>
  </NeoField>
</template>

<script setup lang="ts">
import { NeoButton, NeoField } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'

type GridSize = 'large' | 'medium' | 'small'
type Grid = { icon: string; size: GridSize; class: string }

withDefaults(
  defineProps<{
    sizes: GridSize[]
  }>(),
  {
    sizes: () => ['small', 'large', 'medium'],
  },
)

const smallGridLayout = 'is-half-desktop is-half-tablet is-half-mobile'
const largeGridLayout =
  'is-one-quarter-desktop is-one-third-tablet is-half-mobile'

const grids: Grid[] = [
  {
    icon: 'grid-2',
    size: 'large',
    class: smallGridLayout,
  },
  {
    icon: 'grid',
    size: 'medium',
    class: smallGridLayout,
  },
  {
    icon: 'grid-4',
    size: 'small',
    class: largeGridLayout,
  },
]

const preferencesStore = usePreferencesStore()

const gridSize = computed(() => preferencesStore.getGridSize)

const changeGridLayout = (layout: string, grid: GridSize) => {
  preferencesStore.setGalleryLayoutClass(layout)
  preferencesStore.setGridSize(grid)
}
</script>
