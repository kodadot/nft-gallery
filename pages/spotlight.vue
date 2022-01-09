<template>
  <section>
    <SpotlightTable />
  </section>
</template>
<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import createSiteMeta from '@/utils/createSiteMeta'

@Component<Leaderboard>({
  components: {
    Identity: () => import('@/components/shared/format/Identity.vue'),
    SpotlightTable: () => import('@/components/spotlight/SpotlightTable.vue')
  },
  head() {
    const title = 'NFT artist rank'
    const metaData = {
      title: title,
      description: 'Discover new artists based on ranking',
      url: `${this.$config.baseUrl}/series-insights`,
      image: '/k_card_spotlight.png',
    }
    return {
      title: title,
      meta: [...createSiteMeta(metaData)]
    }
  },
})
export default class Leaderboard extends Vue {
}
</script>
