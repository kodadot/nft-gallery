<template>
  <div>
    <CollectionList class="container" />
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import PrefixMixin from '@/utils/mixins/prefixMixin'

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
export default class ExploreCollectibles extends mixins(PrefixMixin) {
  created() {
    this.checkPrefixBeforeMount()
  }
}
</script>
