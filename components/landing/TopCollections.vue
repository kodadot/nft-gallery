<template>
  <div>
    <div class="is-flex is-justify-content-space-between">
      <div class="title is-2">{{ $t('general.topCollectionsHeading') }}</div>
      <div class="is-flex timeFilters">
        <b-button
          :class="{ active: state.timeRange == 'Day' }"
          type="is-primary"
          @click="setTimeRange('Day')">
          24 Hours
        </b-button>
        <b-button
          :class="{ active: state.timeRange == 'Week' }"
          type="is-primary"
          @click="setTimeRange('Week')">
          7 Days
        </b-button>
        <b-button
          :class="{ active: state.timeRange == 'Month' }"
          type="is-primary"
          @click="setTimeRange('Month')">
          30 Days
        </b-button>
      </div>
      <div></div>
    </div>

    <div class="top-collections-grid mb-5">
      <div v-for="(collection, index) in data" :key="index">
        <TopCollectionsItem
          :collection="collection"
          :index="index + 1"
          :time-range="state.timeRange" />
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
import collectionsSales from '@/queries/rmrk/subsquid/collectionsSales.graphql'
import { RowSeries } from '@/components/series/types'
import {
  calculateAvgPrice,
  dailyVolume,
  dailyrangeVolume,
  monthlyVolume,
  monthlyrangeVolume,
  volume,
  weeklyVolume,
  weeklyrangeVolume,
} from '@/components/series/utils'
import { TimeRange } from '@/components/series/types'
import { Collection } from '../rmrk/service/scheme'

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
  public state = reactive({ timeRange: 'Month' })
  public setTimeRange = (timeRange: TimeRange) => {
    this.state.timeRange = timeRange
  }

  async fetch() {
    if (!this.$store.getters['getCurrentKSMValue']) {
      this.$store.dispatch('fiat/fetchFiatPrice')
    }
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

    // fetch collections sales
    const ids = collectionEntities.map((c: Collection) => c.id)
    const { collectionsSales } = await this.fetchCollectionsSales(ids)

    this.data = collectionEntities.map((e): RowSeries => {
      const saleEvents = collectionsSales
        .find(({ id }) => id === e.id)
        .sales.map((nft) => nft.events)
        .flat()

      return {
        ...e,
        image: sanitizeIpfsUrl(e.image),
        averagePrice: calculateAvgPrice(e.volume as string, e.buys),
        volume: volume(saleEvents),
        dailyVolume: dailyVolume(saleEvents),
        weeklyVolume: weeklyVolume(saleEvents),
        monthlyVolume: monthlyVolume(saleEvents),
        dailyrangeVolume: dailyrangeVolume(saleEvents),
        weeklyrangeVolume: weeklyrangeVolume(saleEvents),
        monthlyrangeVolume: monthlyrangeVolume(saleEvents),
      }
    })
  }

  protected async fetchCollectionsSales(ids: string[]) {
    if (ids.length === 0) {
      return []
    }
    try {
      // const today = new Date()
      const { data } = await this.$apollo.query({
        query: collectionsSales,
        client: this.client,
        variables: {
          ids: ids,
        },
      })
      return data
    } catch (e) {
      this.$consola.error(e)
      return []
    }
  }
}
</script>
