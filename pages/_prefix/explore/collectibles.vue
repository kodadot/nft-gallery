<template>
  <div>
    <div v-if="$route.query.search" class="block">
      {{ $t('general.searchResultsText') }}
      <span class="text__stroked is-size-3">{{ $route.query.search }}</span>
    </div>
    <CollectionList class="container" />
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
