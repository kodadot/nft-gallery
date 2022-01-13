<template>
  <SimpleMint />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import SimpleMint from '@/components/rmrk/Create/SimpleMint.vue'

@Component({
  components: {
    SimpleMint
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
      meta: [...this.$seoMeta(metaData)]
    }
  }
})

export default class SimpleMintPage extends Vue {
}
</script>
