<template>
  <OfferStats />
</template>

<script lang="ts">
export default {
  name: 'OfferStatsPage',
  components: {
    OfferStats: () => import('@/components/bsx/Offer/OfferStats.vue'),
  },
  setup() {
    return {
      title: 'Marketplace Statistics',
      meta: [
        {
          name: 'description',
          content:
            'Marketplace activity and statistics for on Basilisk network',
        },
      ],
    }
  },
}
</script>
