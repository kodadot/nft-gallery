<template>
  <OfferStats />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    OfferStats: () => import('@/components/bsx/Offer/OfferStats.vue'),
  },
})
export default class OfferStatsPage extends Vue {
  layout() {
    return 'centered-half-layout'
  }
}
</script>
