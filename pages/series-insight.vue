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
          v-if="urlPrefix === 'rmrk' || urlPrefix === 'ksm'"
          src="/rmrk-logo-pink-faded.png"
          alt="RMRK"
          class="chain-logo is-hidden-mobile" />
        <img
          v-else-if="urlPrefix === 'bsx'"
          src="/bsx-logo.png"
          alt="BSX"
          class="chain-logo is-hidden-mobile" />
      </div>
    </div>

    <SeriesTable />
  </section>
</template>
<script lang="ts">
import { seriesInsightVisible } from '@/utils/config/permission.config'

export default {
  name: 'Series',
  components: {
    SeriesTable: () => import('@/components/series/SeriesTable.vue'),
  },
  setup() {
    const { urlPrefix } = usePrefix()

    const checkRouteAvailability = () => {
      if (!seriesInsightVisible(urlPrefix.value)) {
        navigateTo('/')
      }
    }

    watch(urlPrefix, () => checkRouteAvailability())

    onBeforeMount(() => checkRouteAvailability())

    return {
      urlPrefix,
    }
  },
  head() {
    const title = 'NFT artist rank'
    const metaData = {
      title,
      type: 'profile',
      description: 'Discover new artists based on ranking',
      url: '/series-insight',
      image: `${this.$config.public.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
}
</script>
