<template>
  <Collections />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import Collections from '@/components/rmrk/Gallery/Collections.vue'

@Component({
  components: {
    Collections
  },
  head() {
    const title = 'Low minting fees and carbonless NFTs'
    const metaData = {
      title,
      description: 'Buy Carbonless NFTs on Kusama',
      url: '/rmrk/collections',
      image: `${this.$config.baseUrl}/k_card_collections.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)]
    }
  }
})

export default class CollectionsPage extends Vue {
}
</script>
