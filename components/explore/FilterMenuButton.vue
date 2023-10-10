<template>
  <div class="has-addons is-flex is-align-items-center" data-testid="tabs">
    <a
      :class="[
        { disabled: disabled },
        'is-hidden-mobile is-flex is-align-items-center',
      ]"
      @click="toggleSidebarFilters">
      <NeoIcon
        :icon="isSidebarFiltersOpen && !disabled ? 'times' : 'bars'"
        size="medium" />
    </a>
    <div class="is-hidden-tablet is-relative">
      <NeoButton :disabled="disabled" icon="bars" @click="openMobileFilters" />
      <ActiveCount v-if="numOfActiveFilters" :count="numOfActiveFilters" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import ActiveCount from './ActiveCount.vue'
import { usePreferencesStore } from '@/stores/preferences'
import useActiveRouterFilters from '@/composables/useActiveRouterFilters'

const route = useRoute()
const preferencesStore = usePreferencesStore()
const activeFilters = useActiveRouterFilters()

const disabled = computed(() => {
  const allowedList = [
    'prefix-explore-items',
    'prefix-collection-id',
    'prefix-collection-id-activity',
  ]

  return !allowedList.includes(route.name || '')
})

const isSidebarFiltersOpen = computed(
  () => preferencesStore.getsidebarFilterCollapse,
)

const numOfActiveFilters = computed(
  () => Object.keys(activeFilters.value).length,
)

const toggleSidebarFilters = () =>
  preferencesStore.setSidebarFilterCollapse(!isSidebarFiltersOpen.value)

const openMobileFilters = () => preferencesStore.setMobileFilterCollapse(true)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
a.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
