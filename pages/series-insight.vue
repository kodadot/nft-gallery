<template>
  <section>
    <div class="columns">
      <div class="column is-four-fifths">
        <h1 class="title is-2">{{ $t('series.title') }}</h1>
        <p class="subtitle is-size-5">
          {{ $t('series.subtitle', { chain: urlPrefix }) }}
        </p>
      </div>
      <div class="column">
        <img
          src="~/assets/rmrk-logo-pink-faded.png"
          alt="RMRK"
          class="rmrk-logo is-hidden-mobile" />
      </div>
    </div>

    <SeriesTable />
  </section>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component<Series>({
  components: {
    Identity: () => import('@/components/identity/IdentityIndex.vue'),
    SeriesTable: () => import('@/components/series/SeriesTable.vue'),
  },
  head() {
    const title = 'NFT artist rank'
    const metaData = {
      title,
      type: 'profile',
      description: 'Discover new artists based on ranking',
      url: '/series-insight',
      image: `${this.$config.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class Series extends Vue {}
</script>
