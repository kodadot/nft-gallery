<template>
  <NeoField addons-class="mb-0" class="mb-0">
    <NeoButton
      icon-left="grid-2"
      no-shadow
      :active="gridSize === 'large'"
      @click="changeGridLayout(smallGridLayout, 'large')" />
    <NeoButton
      icon-left="grid"
      no-shadow
      class="no-border-left"
      :active="gridSize === 'medium'"
      @click="changeGridLayout(smallGridLayout, 'medium')" />
  </NeoField>
</template>

<script setup lang="ts">
import { NeoButton, NeoField } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'

const preferencesStore = usePreferencesStore()

const gridSize = computed(() => preferencesStore.getGridSize)

const smallGridLayout = ref('is-half-desktop is-half-tablet is-half-mobile')

const changeGridLayout = (layout: string, grid: string) => {
  preferencesStore.setGalleryLayoutClass(layout)
  preferencesStore.setGridSize(grid)
}
</script>
