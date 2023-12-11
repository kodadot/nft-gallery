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
import {
  DEFAULT_GRID_SECTION,
  type GridSection,
  type GridSize,
  largeGridLayout,
  smallGridLayout,
  usePreferencesStore,
} from '@/stores/preferences'

type Grid = { icon: string; size: GridSize; class: string }

const props = withDefaults(
  defineProps<{
    sizes?: GridSize[]
    section: GridSection
  }>(),
  {
    sizes: () => ['small', 'large', 'medium'],
    section: DEFAULT_GRID_SECTION,
  },
)

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

const gridSize = computed(
  () => preferencesStore.getGridConfigBySection(props.section)?.size,
)

const changeGridLayout = (layoutClass: string, size: GridSize) => {
  preferencesStore.setGridConfig({
    section: props.section,
    size: size,
    class: layoutClass,
  })
}
</script>
