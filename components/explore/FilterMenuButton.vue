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
      <NeoButton
        class="is-hidden-tablet"
        :disabled="disabled"
        icon="bars"
        @click.native="openMobileFilters" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
const route = useRoute()
const { $store } = useNuxtApp()

const disabled = computed(() => {
  const allowedList = ['prefix-explore-items', 'prefix-collection-id']

  return !allowedList.includes(route.name || '')
})

const isSidebarFiltersOpen = computed(
  () => $store.getters['preferences/getsidebarFilterCollapse']
)

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
</style>
