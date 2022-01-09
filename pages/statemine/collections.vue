<template>
  <Collections />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import Collections from '@/components/rmrk/Gallery/Collections.vue'
import createSiteMeta from '@/utils/createSiteMeta'

@Component({
  components: {
    Collections
  },
  head() {
    const title = 'Low minting fees and carbonless NFTs'
    const metaData = {
      title: title,
      description: 'Buy Carbonless NFTs on Kusama',
      url: `${this.$config.baseUrl}/rmrk/collections`,
      image: `${this.$config.baseUrl}/k_card_collections.png`,
    }
    return {
      title: title,
      meta: [...createSiteMeta(metaData)]
    }
  }
})

export default class CollectionsPage extends Vue {
}
</script>
