<template>
  <div class="fixed-bottom-middle has-min-width">
    <NeoButton expanded @click.native="openMobileFilters">
      {{ $t('general.filters') }}
      <span v-if="numOfActiveFilters">: {{ numOfActiveFilters }}</span>
    </NeoButton>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'

const route = useRoute()
const preferencesStore = usePreferencesStore()

const numOfActiveFilters = computed(() => {
  const query = { ...route.query, redesign: undefined }
  const activeFilters = Object.entries(query).filter(
    ([key, value]) => (key === 'search' && Boolean(value)) || value === 'true'
  )

  return activeFilters.length
})
const openMobileFilters = () => preferencesStore.setMobileFilterCollapse(true)
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

a.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

.fixed-bottom-middle {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.has-min-width {
  min-width: 134px;
}
</style>
