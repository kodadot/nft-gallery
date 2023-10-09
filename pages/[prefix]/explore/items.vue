<template>
  <div
    class="container is-fluid"
    :class="{ 'sidebar-padding-left': isSidebarOpen }">
    <Items />
  </div>
</template>

<script lang="ts" setup>
import { usePreferencesStore } from '@/stores/preferences'
import { explorerVisible } from '@/utils/config/permission.config'

const preferencesStore = usePreferencesStore()
const { urlPrefix } = usePrefix()
const isSidebarOpen = computed(() => preferencesStore.getsidebarFilterCollapse)

const checkRouteAvailability = () => {
  if (!explorerVisible(urlPrefix.value)) {
    navigateTo('/')
  }
}

watch(urlPrefix, () => checkRouteAvailability())

onBeforeMount(() => checkRouteAvailability())

definePageMeta({
  layout: 'explore-layout',
})

useSeoMeta({
  title: 'Explore NFTs',
  description: 'Buy Carbonless NFTs on KodaDot',
  ogUrl: `/${urlPrefix.value}/explore/items`,
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.sidebar-padding-left {
  padding-left: 0;
}

// this cover the edge case where sidebar is open and then screen size changes to mobile
// for exmpale on rotation of tablet device
// in that case the padding need to match that of the fluid container
@include mobile {
  .sidebar-padding-left {
    padding-left: $fluid-container-padding-mobile;
  }
}
</style>
