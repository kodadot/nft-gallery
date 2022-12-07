<template>
  <GenerativeMint />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import GenerativeMint from '@/components/bsx/Create/GenerativeMint.vue'

@Component({
  components: {
    GenerativeMint,
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
      url: '/mint',
      image: `${this.$config.baseUrl}/k_card_mint.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class SimpleMintPage extends Vue {}
</script>
