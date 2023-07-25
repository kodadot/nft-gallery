<template>
  <GenerativeMint />
</template>

<script lang="ts">
export default {
  name: 'GenerativeMintPage',
  components: {
    GenerativeMint: () => import('@/components/bsx/Create/GenerativeMint.vue'),
  },
  layout() {
    return 'generative-mint-layout'
  },
  head() {
    const title = 'KodaDot | Low fees and low carbon minting'
    const metaData = {
      title,
      type: 'article',
      description: 'Create carbonless NFTs with low on-chain fees',
      url: '/mint',
      image: `${this.$config.public.baseUrl}/k_card_mint.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
