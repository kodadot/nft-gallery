<template>
  <div>
    <b-field grouped>
      <div class="title is-2">{{ $t('general.topCollectionsHeading') }}</div>
      <b-field position="is-right" expanded>
        <b-radio-button
          v-model="nbDays"
          native-value="24 HOUR"
          type="is-outlined">
          24h
        </b-radio-button>

        <b-radio-button
          v-model="nbDays"
          native-value="7 DAY"
          type="is-outlined">
          7d
        </b-radio-button>

        <b-radio-button
          v-model="nbDays"
          native-value="30 DAY"
          type="is-outlined">
          30d
        </b-radio-button>
      </b-field>
    </b-field>
    <div class="columns is-multiline">
      <div v-for="(collection, index) in data" :key="index" class="column is-6">
        <TopCollectionsItem :collection="collection" :index="index + 1" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, mixins } from 'nuxt-property-decorator'

import { sanitizeIpfsUrl } from '@/components/rmrk/utils'

import AuthMixin from '@/utils/mixins/authMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'

import topCollectionList from '@/queries/rmrk/subsquid/topCollectionList.graphql'

import { RowSeries } from '@/components/series/types'
import { calculateAvgPrice } from '@/components/series/utils'

const components = {
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  TopCollectionsItem: () =>
    import('@/components/landing/TopCollectionsItem.vue'),
}

@Component<TopCollections>({
  components,
})
export default class TopCollections extends mixins(AuthMixin, PrefixMixin) {
  public data: RowSeries[] = []
  public nbDays = '7 DAY'

  async fetch() {
    await this.fetchCollectionsSeries()
  }

  @Watch('nbDays')
  public onTopDaysChange() {
    this.$fetch()
  }

  public async fetchCollectionsSeries(limit = 12, sort = 'volume') {
    const collections = await this.$apollo.query({
      query: topCollectionList,
      client: 'subsquid',
      variables: {
        orderDirection: 'DESC',
        dateRange: this.nbDays,
        orderBy: sort,
        limit,
      },
    })

    const {
      data: { seriesInsightTable },
    } = collections

    this.data = seriesInsightTable.map(
      (e: RowSeries): RowSeries => ({
        ...e,
        image: sanitizeIpfsUrl(e.image),
        averagePrice: calculateAvgPrice(e.volume as string, e.buys),
      })
    )
  }
}
</script>
