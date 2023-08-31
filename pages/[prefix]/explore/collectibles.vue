<template>
  <div class="container is-fluid">
    <CollectionGridWithBreadcrumbs />
  </div>
</template>

<script lang="ts">
import { explorerVisible } from '@/utils/config/permission.config'

definePageMeta({
  layout: 'explore-layout',
})

export default {
  name: 'ExploreCollectibles',

  setup() {
    const { urlPrefix } = usePrefix()

    const checkRouteAvailability = () => {
      if (!explorerVisible(urlPrefix.value)) {
        navigateTo('/')
      }
    }

    watch(urlPrefix, () => checkRouteAvailability())

    onBeforeMount(() => checkRouteAvailability())
  },
  head() {
    const route = useRoute()
    const runtimeConfig = useRuntimeConfig()
    const title = 'Explore NFT Collections'
    const metaData = {
      title,
      description: 'Buy Carbonless NFTs on Kusama',
      url: `/${route.params.prefix}/explore/collectibles`,
      image: `${runtimeConfig.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
