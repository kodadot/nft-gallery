<template>
  <NeoField addons-class="mb-0" class="mb-0">
    <NeoButton
      icon-left="grid-2"
      :active="gridSize === 'large'"
      @click="changeGridLayout(smallGridLayout, 'large')" />
    <NeoButton
      icon-left="grid"
      :active="gridSize === 'medium'"
      @click="changeGridLayout(smallGridLayout, 'medium')" />
    <NeoButton
      icon-left="grid-4"
      :active="gridSize === 'small'"
      @click="changeGridLayout(largeGridLayout, 'small')" />
  </NeoField>
</template>

<script setup lang="ts">
import { NeoButton, NeoField } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'

const preferencesStore = usePreferencesStore()

const gridSize = computed(() => preferencesStore.getGridSize)

const smallGridLayout = ref('is-half-desktop is-half-tablet is-half-mobile')
const largeGridLayout = ref(
  'is-one-quarter-desktop is-one-third-tablet is-half-mobile',
)

const changeGridLayout = (layout: string, grid: string) => {
  preferencesStore.setGalleryLayoutClass(layout)
  preferencesStore.setGridSize(grid)
}
</script>
