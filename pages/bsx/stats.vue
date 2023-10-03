<template>
  <OfferStats />
</template>

<script lang="ts">
export default {
  name: 'OfferStatsPage',
  components: {
    OfferStats: () => import('@/components/bsx/Offer/OfferStats.vue'),
  },
  head() {
    const title = 'Marketplace Statistics'
    const metaData = {
      title,
      description:
        'Marketplace activity and statistics for on Basilisk network',
      url: '/bsx/stats',
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
