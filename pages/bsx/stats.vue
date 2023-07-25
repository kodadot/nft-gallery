<template>
  <OfferStats />
</template>

<script lang="ts">
export default {
  name: 'OfferStatsPage',
  components: {
    OfferStats: () => import('@/components/bsx/Offer/OfferStats.vue'),
  },
}
</script>
