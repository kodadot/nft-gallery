<template>
  <section>
    <div class="columns">
      <div class="column is-four-fifths">
        <h1 class="title is-2">{{ $t('series.title') }}</h1>
        <p class="subtitle is-size-5">{{ $t('series.subtitle') }}</p>
      </div>
      <div class="column">
        <img
            src="~/assets/rmrk-logo-pink-faded.png"
            alt="RMRK"
            class="rmrk-logo is-hidden-mobile"
          >
      </div>
    </div>

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

<style scoped>
.rmrk-logo {
  aspect-ratio: 127 / 42
}
</style>
