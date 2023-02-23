<template>
  <div class="field has-addons is-flex is-align-items-center" data-cy="tabs">
    <div class="mr-4">
      <a
        class="is-hidden-mobile"
        :class="{ disabled: disabled }"
        @click="toggleSidebarFilters">
        <b-icon
          :icon="isSidebarFiltersOpen && !disabled ? 'times' : 'bars'"
          size="is-medium" />
      </a>
      <a
        class="is-hidden-tablet"
        :class="{ disabled: disabled }"
        @click="openMobileFilters">
        <b-icon :icon="'bars'" size="is-medium" />
      </a>
    </div>

    <TabOnCollection v-if="route.name?.includes('prefix-collection-id')" />
    <TabOnExplore v-else />
  </div>
</template>

<script setup lang="ts">
import TabOnExplore from './tab/TabOnExplore.vue'
import TabOnCollection from './tab/TabOnCollection.vue'

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
