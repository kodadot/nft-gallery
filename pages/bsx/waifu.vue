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
    const title = 'Mint Your Waifu'
    const metaData = {
      title,
      type: 'article',
      description: 'Create yourself a uique Waifu NFT',
      url: 'bsx/mint',
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
