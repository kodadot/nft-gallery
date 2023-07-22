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
}
</script>
