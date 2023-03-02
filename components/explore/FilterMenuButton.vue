<template>
  <div class="field has-addons is-flex is-align-items-center" data-cy="tabs">
    <div>
      <a
        class="is-hidden-mobile"
        :class="{ disabled: disabledTab }"
        @click="toggleSidebarFilters">
        <b-icon
          :icon="isSidebarFiltersOpen && !disabledTab ? 'times' : 'bars'"
          size="is-medium" />
      </a>
      <a
        class="is-hidden-tablet"
        :class="{ disabled: disabledTab }"
        @click="openMobileFilters">
        <b-icon :icon="'bars'" size="is-medium" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { $store } = useNuxtApp()

const disabledTab = computed(() => {
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
