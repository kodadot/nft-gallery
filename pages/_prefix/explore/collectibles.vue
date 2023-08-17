<template>
  <div class="container is-fluid">
    <CollectionList />
  </div>
</template>

<script lang="ts">
import { explorerVisible } from '@/utils/config/permision.config'

export default {
  name: 'ExploreCollectibles',
  layout: 'explore-layout',

  setup() {
    const { urlPrefix } = usePrefix()
    const router = useRouter()

    const checkRouteAvailability = () => {
      if (!explorerVisible(urlPrefix.value)) {
        router.push('/')
      }
    }

    watch(urlPrefix, () => checkRouteAvailability())

    onBeforeMount(() => checkRouteAvailability())
  },
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
