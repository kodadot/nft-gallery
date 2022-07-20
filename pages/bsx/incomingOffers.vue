<template>
  <MyOffer />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    MyOffer: () => import('@/components/bsx/Offer/MyOffer.vue'),
  },
})
export default class IncomingOffersPage extends Vue {}
</script>
