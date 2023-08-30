<template>
  <SimpleMint />
</template>

<script lang="ts">
definePageMeta({
  layout: 'centered-half-layout',
})

export default {
  name: 'SimpleMintPage',
  components: {
    SimpleMint: () => import('@/components/rmrk/Create/SimpleMint.vue'),
  },
  head() {
    const title = 'Mint a new NFT'
    const metaData = {
      title,
      type: 'article',
      description: 'Mint new NFT with low on-chain fees',
      url: '/mint',
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
