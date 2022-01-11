<template>
  <section>
    <SpotlightTable />
  </section>
</template>
<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'

@Component<Leaderboard>({
  components: {
    Identity: () => import('@/components/shared/format/Identity.vue'),
    SpotlightTable: () => import('@/components/spotlight/SpotlightTable.vue')
  },
  head() {
    const title = 'NFT artist rank'
    const metaData = {
      title,
      description: 'Discover new artists based on ranking',
      url: '/series-insights',
      image: `${this.$config.baseUrl}/k_card_spotlight.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)]
    }
  },
})
export default class Leaderboard extends Vue {
}
</script>
