<template>
  <CreateCollection />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import CreateCollection from '@/components/stmn/Create/CreateCollection.vue'

@Component({
  components: {
    CreateCollection,
  },
  layout() {
    return 'centered-half-layout'
  },
  head() {
    const title = 'KodaDot | Low fees and low carbon minting'
    const metaData = {
      title,
      type: 'article',
      description: 'Create carbonless NFTs with low on-chain fees',
      url: '/stmn/create/collection',
      image: `${this.$config.public.baseUrl}/k_card_mint.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class SimpleMintPage extends Vue {}
</script>
