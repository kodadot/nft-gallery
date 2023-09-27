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

    useHead({
      title: 'Explore NFT Collections',
      meta: [
        {
          name: 'description',
          content: 'Buy Carbonless NFTs on Kusama',
        },
      ],
    })
  },
}
</script>
