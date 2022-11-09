<template>
  <div>
    <div class="title is-2">{{ $t('general.topCollectionsHeading') }}</div>

    <div class="top-collections-grid mb-5">
      <div v-for="(collection, index) in data" :key="index">
        <TopCollectionsItem :collection="collection" :index="index + 1" />
      </div>
    </div>

    <div v-if="$fetchState.pending" class="top-collections-grid">
      <div
        v-for="index in limit"
        :key="index"
        class="top-collections-item py-2 is-flex is-align-items-center is-justify-content-space-between">
        <div class="is-flex is-align-items-center">
          <div class="p-4 has-text-weight-bold">
            {{ index }}
          </div>
          <div>
            <BasicImage custom-class="is-48x48 image-outline" rounded />
          </div>
          <div class="px-2">
            <div>
              <b-skeleton width="170px"></b-skeleton>
            </div>
            <div>
              <b-skeleton width="140px" size="is-small"></b-skeleton>
            </div>
          </div>
        </div>
        <div class="is-pulled-right has-text-right px-4">
          <div>
            <b-skeleton width="120px"></b-skeleton>
          </div>
          <div>
            <b-skeleton
              width="70%"
              size="is-small"
              position="is-right"></b-skeleton>
          </div>
        </div>
      </div>
    </div>

    <nuxt-link v-show="urlPrefix === 'rmrk'" to="/series-insight" class="link">
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
  TopCollectionsItem: () =>
    import('@/components/landing/TopCollectionsItem.vue'),
}

@Component<TopCollections>({
  components,
})
export default class TopCollections extends mixins(AuthMixin, PrefixMixin) {
  public data: RowSeries[] = []
  public limit = 12

  async fetch() {
    await this.fetchCollectionsSeries()
  }

  public async fetchCollectionsSeries(sort = 'volume_DESC') {
    const collections = await this.$apollo.query({
      query: topCollectionList,
      client: this.client,
      variables: {
        orderBy: sort,
        limit: this.limit,
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
