<template>
  <div class="container is-fluid">
    <Items />
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import ExperimentMixin from '@/utils/mixins/experimentMixin'
import Items from '@/components/items/Items.vue'

const components = { Items }

@Component<ExploreItems>({
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
      url: `/${this.$route.params.prefix}/explore/items`,
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class ExploreItems extends mixins(ExperimentMixin) {}
</script>
