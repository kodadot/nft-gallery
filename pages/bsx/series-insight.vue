<template>
  <section>
    <h1 class="title is-2">{{ $t('series.title') }}</h1>
    <p class="subtitle is-size-5">
      {{ $t('series.subtitle', { chain: urlPrefix }) }}
    </p>
    <SeriesTable />
  </section>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import PrefixMixin from '@/utils/mixins/prefixMixin'

@Component<Series>({
  components: {
    SeriesTable: () => import('@/components/series/SeriesTable.vue'),
  },
  head() {
    const title = 'NFT artist rank'
    const metaData = {
      title,
      type: 'profile',
      description: 'Discover new artists based on ranking',
      url: '/bsx/series-insight',
      image: `${this.$config.baseUrl}/k_card.png`,
    }
    return {
      title,
      meta: [...this.$seoMeta(metaData)],
    }
  },
})
export default class Series extends mixins(PrefixMixin) {}
</script>
