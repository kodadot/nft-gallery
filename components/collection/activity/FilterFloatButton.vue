<template>
  <div class="fixed -translate-x-2/4 z-[1] left-2/4 bottom-6 min-w-[134px]">
    <NeoButton expanded @click="openMobileFilters">
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
  () => Object.keys(activeFilters.value).length,
)
const openMobileFilters = () => preferencesStore.setMobileFilterCollapse(true)
</script>
