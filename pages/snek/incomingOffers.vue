<template>
  <MyOffer />
</template>

<script lang="ts">
export default {
  name: 'IncomingOffersPage',
  components: {
    MyOffer: () => import('@/components/bsx/Offer/MyOffer.vue'),
  },
  setup() {
    useHead({
      title: 'Incoming Offers',
      meta: [
        {
          name: 'description',
          content:
            'See all the offers you have received for your NFTs on KodaDot',
        },
      ],
    })
  },
}
</script>
