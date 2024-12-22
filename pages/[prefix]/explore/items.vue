<template>
  <div
    class="container is-fluid"
    :class="{ 'sidebar-padding-left': isSidebarOpen }"
  >
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
  const isAssetHub
    = Object.keys(chainNameSeoMap).includes(prefix) && assetHub.includes(prefix)

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
  middleware: [
    function (to) {
      if (to.query.listed === undefined) {
        return navigateTo({
          path: to.path,
          query: {
            ...to.query,
            listed: 'true',
          } })
      }
    },
  ],
})

useSeoMeta({
  ...getSeoMeta.value,
})
</script>
