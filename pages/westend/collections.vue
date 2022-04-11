<template>
  <Collections />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Collections from '@/components/rmrk/Gallery/Collections.vue'

@Component<WestendCollections>({
  components: {
    Collections,
  },
  head() {
    const title = 'Low minting fees and carbonless NFTs'
    const metaData = {
      title,
      type: 'profile',
      description: 'Buy Carbonless NFTs on Kusama',
      url: '/westend/collections',
      image: `${this.$config.baseUrl}/k_card_collections.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class WestendCollections extends Vue {}
</script>
