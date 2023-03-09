<template>
  <div class="is-flex field has-addons is-flex-grow-1">
    <TabItem
      :active="selectedTab === TabType.COLLECTION"
      :text="`${$t('collections')}`"
      :to="pathWithSearchQuery('collectibles')" />
    <TabItem
      :active="selectedTab === TabType.ITEMS"
      :text="`${$t('items')}`"
      :to="pathWithSearchQuery('items')" />
  </div>
</template>

<script setup lang="ts">
import TabItem from './TabItem.vue'

const route = useRoute()
const { $store } = useNuxtApp()

enum TabType {
  COLLECTION = 'collectibles',
  ITEMS = 'items',
}

const selectedTab = computed(() => route?.name?.split('-')[2])

const pathWithSearchQuery = (path: string) => {
  const searchQuery = route.query.search
  return searchQuery ? `${path}?search=${searchQuery}` : path
}

watch(selectedTab, () => {
  if (selectedTab.value === TabType.COLLECTION) {
    $store.dispatch('preferences/setSidebarFilterCollapse', false)
  }
})
</script>
