<template>
  <div>
    <div class="title is-2">{{ $t('general.topCollectionsHeading') }}</div>

    <div class="re-top-collections-grid mb-5">
      <div v-for="(collection, index) in data" :key="index">
        <ReTopCollectionsItem :collection="collection" :index="index + 1" />
      </div>
    </div>

    <nuxt-link to="/series-insight" class="link">
      {{ $t('helper.seeMore') }} >
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'

import { sanitizeIpfsUrl } from '@/components/rmrk/utils'

import AuthMixin from '@/utils/mixins/authMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'

import topCollectionList from '@/queries/rmrk/subsquid/topCollectionList.graphql'

import { RowSeries } from '@/components/series/types'
import { calculateAvgPrice } from '@/components/series/utils'

const components = {
  BasicImage: () => import('@/components/shared/view/BasicImage.vue'),
  ReTopCollectionsItem: () =>
    import('@/components/landing/ReTopCollectionsItem.vue'),
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
      query: topCollectionList,
      client: this.client,
      variables: {
        orderBy: sort,
        limit,
        where: {
          floorPrice_isNull: false,
        },
      },
    })

    const {
      data: { collectionEntities },
    } = collections

    this.data = collectionEntities.map(
      (e: RowSeries): RowSeries => ({
        ...e,
        image: sanitizeIpfsUrl(e.image),
        averagePrice: calculateAvgPrice(e.volume as string, e.buys),
      })
    )
  }
}
</script>
