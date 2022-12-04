<template>
  <ClaimForm />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ClaimForm from '@/components/poap/claim/ClaimForm.vue'

@Component({
  components: {
    ClaimForm,
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
      url: '/claim',
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
