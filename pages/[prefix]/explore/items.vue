<template>
  <div
    class="w-full px-[1.25rem] md:px-[2.5rem]"
    :class="{ 'sidebar-padding-left': isSidebarOpen }">
    <Items />
  </div>
</template>

<script lang="ts" setup>
import { usePreferencesStore } from '@/stores/preferences'
import { explorerVisible } from '@/utils/config/permission.config'
import { assetHub, chainNameSeoMap, getSeoPrefixName } from '@/utils/seo'

const preferencesStore = usePreferencesStore()
const { urlPrefix } = usePrefix()
const isSidebarOpen = computed(() => preferencesStore.getsidebarFilterCollapse)

const checkRouteAvailability = () => {
  if (!explorerVisible(urlPrefix.value)) {
    navigateTo('/ahp/explore/items')
  }
}

const getSeoMeta = computed(() => {
  const prefix = urlPrefix.value
  const isAssetHub =
    Object.keys(chainNameSeoMap).includes(prefix) && assetHub.includes(prefix)

  return {
    title: isAssetHub
      ? `Items on Asset Hub ${getSeoPrefixName(prefix)}`
      : 'Explore NFTs',
    description: isAssetHub
      ? `Items on Asset Hub ${getSeoPrefixName(prefix)}`
      : 'Buy Carbonless NFTs on KodaDot',
    ogUrl: `/${urlPrefix.value}/explore/items`,
  }
})

watch(urlPrefix, () => checkRouteAvailability())

onBeforeMount(() => checkRouteAvailability())

definePageMeta({
  layout: 'explore-layout',
})

useSeoMeta({
  ...getSeoMeta.value,
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
