<template>
  <div>
    <NeoField>
      <p class="control">
        <NeoButton
          icon-left="grid-2"
          :active="gridSize === 'large'"
          @click.native="changeGridLayout(smallGridLayout, 'large')" />
      </p>
      <p class="control">
        <NeoButton
          icon-left="grid"
          :active="gridSize === 'medium'"
          @click.native="changeGridLayout(smallGridLayout, 'medium')" />
      </p>
      <p class="control">
        <NeoButton
          icon-left="grid-4"
          :active="gridSize === 'small'"
          @click.native="changeGridLayout(largeGridLayout, 'small')" />
      </p>
    </NeoField>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'
import { NeoField } from '@kodadot1/brick'

const preferencesStore = usePreferencesStore()

const gridSize = computed(() => preferencesStore.getGridSize)

const smallGridLayout = ref('is-half-desktop is-half-tablet is-half-mobile')
const largeGridLayout = ref(
  'is-one-quarter-desktop is-one-third-tablet is-half-mobile'
)

const changeGridLayout = (layout: string, grid: string) => {
  preferencesStore.setGalleryLayoutClass(layout)
  preferencesStore.setGridSize(grid)
}
</script>
