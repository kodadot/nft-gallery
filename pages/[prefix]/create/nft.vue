<template>
  <CreateNft />
</template>

<script lang="ts">
import CreateNft from '@/components/create/CreateNft.vue'

definePageMeta({
  layout: 'background-layout',
})

export default {
  components: {
    CreateNft,
  },
  head() {
    const title = 'Create carbonless NFTs'
    const metaData = {
      title,
      type: 'article',
      description: 'Create carbonless NFTs with low on-chain fees',
      url: '/create/nft',
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.$root.$config.public.baseUrl + this.$route.path,
        },
      ],
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
