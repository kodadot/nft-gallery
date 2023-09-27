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
  setup() {
    useHead({
      title: 'Marketplace Offers',
      meta: [
        {
          name: 'description',
          content: 'See all the offers on Basilisk network',
        },
      ],
    })
  },
}
</script>
