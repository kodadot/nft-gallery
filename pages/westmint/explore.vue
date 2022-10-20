<template>
  <ExploreLayout />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ExploreLayout from '@/components/rmrk/ExploreLayout/ExploreLayout.vue'

const components = {
  ExploreLayout,
}

@Component<ExploreWestmint>({
  components,
  head() {
    const title = 'Low minting fees and carbonless NFTs'
    const metaData = {
      title,
      type: 'profile',
      description: 'Buy Carbonless NFTs on Kusama',
      url: '/westmint/explore',
      image: `${this.$config.baseUrl}/k_card_collections.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class ExploreWestmint extends Vue {}
</script>
