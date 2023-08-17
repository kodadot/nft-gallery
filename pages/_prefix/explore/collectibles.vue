<template>
  <div class="container is-fluid">
    <CollectionGridWithBreadcrumbs />
  </div>
</template>

<script lang="ts">
export default {
  name: 'ExploreCollectibles',
  layout: 'explore-layout',
  head() {
    const { $route } = useNuxtApp()
    const runtimeConfig = useRuntimeConfig()
    const title = 'Low minting fees and carbonless NFTs'
    const metaData = {
      title,
      type: 'profile',
      description: 'Buy Carbonless NFTs on Kusama',
      url: `/${$route.params.prefix}/explore/collectibles`,
      image: `${runtimeConfig.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
