<template>
  <div class="flex field has-addons flex-grow">
    <TabItem
      :active="selectedTab === TabType.COLLECTION"
      :text="`${$t('collections')}`"
      :to="pathWithSearchQuery(TabType.COLLECTION)" />
    <TabItem
      :active="selectedTab === TabType.ITEMS"
      :text="`${$t('items')}`"
      :to="pathWithSearchQuery(TabType.ITEMS)" />
  </div>
</template>

<script setup lang="ts">
import TabItem from '@/components/shared/TabItem.vue'
import { usePreferencesStore } from '@/stores/preferences'

const route = useRoute()
const preferencesStore = usePreferencesStore()

enum TabType {
  COLLECTION = 'collectibles',
  ITEMS = 'items',
}

const selectedTab = computed(() => route?.name?.split('-')[2])

const pathWithSearchQuery = (path: string) => {
  if (path === selectedTab.value) {
    return route.fullPath
  }
  const searchQuery = route.query.search
  return searchQuery ? `${path}?search=${searchQuery}` : path
}

watch(selectedTab, () => {
  if (selectedTab.value === TabType.COLLECTION) {
    preferencesStore.setSidebarFilterCollapse(false)
  }
})
</script>
