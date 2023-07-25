<template>
  <MyOffer />
</template>

<script lang="ts">
export default {
  name: 'IncomingOffersPage',
  components: {
    MyOffer: () => import('@/components/bsx/Offer/MyOffer.vue'),
  },
}
</script>
