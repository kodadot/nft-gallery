<template>
  <GenerativeMint />
</template>

<script lang="ts">
import GenerativeMint from '@/components/bsx/Create/GenerativeMint.vue'

export default {
  name: 'GenerativeMintPage',
  components: {
    GenerativeMint,
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
      url: 'ahk/mint',
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
