<template>
  <div class="field has-addons is-flex is-align-items-center" data-cy="tabs">
    <div>
      <a
        class="is-hidden-mobile"
        :class="{ disabled: disabled }"
        @click="toggleSidebarFilters">
        <b-icon
          :icon="isSidebarFiltersOpen && !disabled ? 'times' : 'bars'"
          size="is-medium" />
      </a>
      <div class="is-hidden-tablet position-relative">
        <NeoButton
          :disabled="disabled"
          icon="bars"
          @click.native="openMobileFilters" />
        <ActiveCount :count="numOfActiveFilters" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import ActiveCount from './ActiveCount.vue'
const route = useRoute()
const { $store } = useNuxtApp()

const disabled = computed(() => {
  const allowedList = ['prefix-explore-items', 'prefix-collection-id']

  return !allowedList.includes(route.name || '')
})

const isSidebarFiltersOpen = computed(
  () => $store.getters['preferences/getsidebarFilterCollapse']
)

const numOfActiveFilters = computed(() => {
  const query = { ...route.query, redesign: undefined }
  const activeFilters = Object.entries(query).filter(
    ([key, value]) =>
      (key === 'search' && value !== undefined) || value === 'true'
  )

  return activeFilters.length
})

const toggleSidebarFilters = () => {
  $store.dispatch(
    'preferences/setSidebarFilterCollapse',
    !isSidebarFiltersOpen.value
  )
}
const openMobileFilters = () => {
  $store.dispatch('preferences/setMobileFilterCollapse', true)
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
a.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}
.position-relative {
  position: relative;
}
</style>
