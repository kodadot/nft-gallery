<template>
  <div class="container is-fluid">
    <CollectionGridWithBreadcrumbs />
  </div>
</template>

<script lang="ts" setup>
import { explorerVisible } from '@/utils/config/permission.config'
import { assetHub, chainNameSeoMap, getSeoPrefixName } from '@/utils/seo'

const { urlPrefix } = usePrefix()

const checkRouteAvailability = () => {
  if (!explorerVisible(urlPrefix.value)) {
    navigateTo('/ahp/explore/collectibles')
  }
}

const getSeoMeta = computed(() => {
  const prefix = urlPrefix.value
  const isAssetHub
    = Object.keys(chainNameSeoMap).includes(prefix) && assetHub.includes(prefix)

  return {
    title: isAssetHub
      ? `Collections on Asset Hub ${getSeoPrefixName(prefix)}`
      : 'Explore NFTs',
    description: isAssetHub
      ? `Collections on Asset Hub ${getSeoPrefixName(prefix)}`
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
      const extraQuery = ['gen_art'].reduce((acc, key) => {
        if (to.query[key] === undefined) {
          acc[key] = 'true'
        }
        return acc
      }, {})

      const excludeQuery = ['listed'].reduce((acc, key) => {
        if (to.query[key] !== undefined) {
          acc[key] = undefined
        }
        return acc
      }, {})

      if (Object.keys(extraQuery).length > 0 || Object.keys(excludeQuery).length > 0) {
        return navigateTo({
          path: to.path,
          query: {
            ...to.query,
            ...extraQuery,
            ...excludeQuery,
          } })
      }
    },
  ],
})

useSeoMeta({
  ...getSeoMeta.value,
})
</script>
