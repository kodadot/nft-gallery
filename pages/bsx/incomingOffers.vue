<template>
  <MyOffer />
</template>

<script lang="ts">
export default {
  name: 'IncomingOffersPage',
  components: {
    MyOffer: () => import('@/components/bsx/Offer/MyOffer.vue'),
  },
  head() {
    const title = 'Incoming Offers'
    const metaData = {
      title,
      description:
        'See all the offers you have received for your NFTs on KodaDot',
      url: '/bsx/incomingOffers',
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
