<template>
  <CreateCollection />
</template>

<script lang="ts">
import CreateCollection from '@/components/create/CreateCollection.vue'

export default {
  components: {
    CreateCollection,
  },
  layout() {
    return 'background-layout'
  },
  head() {
    const title = 'Create carbonless NFTs'
    const metaData = {
      title,
      type: 'article',
      description: 'Create carbonless NFTs with low on-chain fees',
      url: '/create/collection',
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
