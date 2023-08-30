<template>
  <MasterOfferTable />
</template>

<script lang="ts">
export default {
  name: 'OffersPage',
  components: {
    MasterOfferTable: () =>
      import('@/components/bsx/Offer/MasterOfferTable.vue'),
  },
  head() {
    const title = 'Marketplace Offers'
    const metaData = {
      title,
      description: 'See all the offers on Basilisk network',
      url: '/bsx/offers',
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
