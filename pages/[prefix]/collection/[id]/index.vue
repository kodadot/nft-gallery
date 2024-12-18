<template>
  <div
    class="container is-fluid"
    :class="{ 'sidebar-padding-left': isSidebarOpen }"
  >
    <Items :key="collectionid" />
  </div>
</template>

<script lang="ts" setup>
import { usePreferencesStore } from '@/stores/preferences'

const route = useRoute()
definePageMeta({
  layout: 'explore-layout',
})

const collectionid = (route.params?.id ?? '') as string

const preferencesStore = usePreferencesStore()
const isSidebarOpen = computed(() => preferencesStore.getsidebarFilterCollapse)
</script>
