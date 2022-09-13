<template>
  <MasterOfferTable />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    MasterOfferTable: () =>
      import('@/components/bsx/Offer/MasterOfferTable.vue'),
  },
})
export default class Offers extends Vue {}
</script>
