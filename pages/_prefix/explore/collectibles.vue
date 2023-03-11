<template>
  <div class="container is-fluid">
    <CollectionList />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

const components = {}

@Component<ExploreCollectibles>({
  components,
  layout() {
    return 'explore-layout'
  },
  head() {
    const title = 'Low minting fees and carbonless NFTs'
    const metaData = {
      title,
      type: 'profile',
      description: 'Buy Carbonless NFTs on Kusama',
      url: `/${this.$route.params.prefix}/explore/collectibles`,
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class ExploreCollectibles extends Vue {}
</script>
