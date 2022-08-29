<template>
  <div>
    <div class="title is-2">{{ $t('general.topCollectionsHeading') }}</div>
    <div class="columns is-multiline">
      <div v-for="(collection, index) in data" :key="index" class="column is-6">
        <TopCollectionsItem :collection="collection" :index="index + 1" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'

import { sanitizeIpfsUrl } from '@/components/rmrk/utils'

import AuthMixin from '@/utils/mixins/authMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'

import seriesInsightList from '@/queries/rmrk/subsquid/seriesInsightList.graphql'

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

  async fetch() {
    await this.fetchCollectionsSeries()
  }

  public async fetchCollectionsSeries(limit = 12, sort = 'volume_DESC') {
    const collections = await this.$apollo.query({
      query: seriesInsightList,
      client: this.client,
      variables: {
        limit,
        offset: 0,
        orderBy: sort || 'volume_DESC',
        where: {
          floorPrice_isNull: false,
        },
      },
      fetchPolicy: 'cache-first',
    })

    const {
      data: { collectionEntities },
    } = collections

    this.data = collectionEntities.map(
      (e: RowSeries): RowSeries => ({
        ...e,
        image: sanitizeIpfsUrl(e.image),
        rank: e.sold * (e.unique / e.total || 1),
        averagePrice: calculateAvgPrice(e.volume as string, e.buys),
        emoteCount: e.emoteCount || 0,
      })
    )
  }
}
</script>
