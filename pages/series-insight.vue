<template>
  <section>
    <h1 class="title is-2">{{ $t('series.title') }}</h1>
    <p class="subtitle is-size-5">{{ $t('series.subtitle') }}</p>

    <SeriesTable />
  </section>
</template>
<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'

@Component<Series>({
  head() {
    const title = 'NFT artist rank'
    const metaData = {
      title,
      type: 'profile',
      description: 'Discover new artists based on ranking',
      url: '/series-insight',
      image: `${this.$config.baseUrl}/k_card_series.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)]
    }
  },
  components: {
    Identity: () => import('@/components/shared/format/Identity.vue'),
    SeriesTable: () => import('@/components/series/SeriesTable.vue')
  }
})
export default class Series extends Vue {
}
</script>
