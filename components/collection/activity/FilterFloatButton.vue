<template>
  <div class="fixed-bottom-middle has-min-width">
    <NeoButton expanded @click.native="openMobileFilters">
      {{ $t('general.filters')
      }}<span v-if="numOfActiveFilters">: {{ numOfActiveFilters }}</span>
    </NeoButton>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'
import useActiveRouterFilters from '@/composables/useActiveRouterFilters'

const preferencesStore = usePreferencesStore()
const activeFilters = useActiveRouterFilters()

const numOfActiveFilters = computed(
  () => Object.keys(activeFilters.value).length
)
const openMobileFilters = () => preferencesStore.setMobileFilterCollapse(true)
</script>

<style lang="scss" scoped>
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
