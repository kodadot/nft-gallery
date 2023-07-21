<template>
  <SimpleMint />
</template>

<script lang="ts">
export default {
  name: 'SimpleMintPage',
  components: {
    SimpleMint: () => import('@/components/rmrk/Create/SimpleMint.vue'),
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
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
