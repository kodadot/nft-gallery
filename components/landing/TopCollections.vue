<template>
  <div>
    <div class="title is-2">{{ $t('general.topCollectionsHeading') }}</div>

    <div class="top-collections-grid">
      <div v-for="(collection, index) in data" :key="index">
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

<style lang="scss">
.top-collections-grid {
  display: grid;
  grid-template-rows: repeat(6, minmax(0, 1fr));
  column-gap: 4rem;
  row-gap: 2rem;

  @media (min-width: 640px) {
    grid-auto-flow: column;
  }

  @media (min-width: 1280px) {
    grid-template-rows: repeat(4, minmax(0, 1fr));
  }
}
</style>
