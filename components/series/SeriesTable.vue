<template>
  <div>
    <Loader :value="isLoading" />
    <b-field grouped>
      <!-- <b-field
        position="is-left"
        expanded
      >
        <b-radio-button
          v-model="nbDays"
          native-value="24"
          type="is-outlined"
        >
          24h
        </b-radio-button>

        <b-radio-button
          v-model="nbDays"
          native-value="7"
          type="is-outlined"
        >
          7d
        </b-radio-button>

        <b-radio-button
          v-model="nbDays"
          native-value="30"
          type="is-outlined"
        >
          30d
        </b-radio-button>
      </b-field> -->

      <b-field class="has-text-right" expanded>
        <b-select v-model="nbRows">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </b-select>
      </b-field>
    </b-field>

    <b-table
      sticky-header
      :data="data"
      :default-sort="[sortBy.field, sortBy.value]"
      default-sort-direction="desc"
      backend-sorting
      hoverable
      class="series-sticky-header"
      @sort="onSort">
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="id"
        label="N°">
        {{ data.indexOf(props.row) + 1 }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="image"
        label=""
        header-class="front-stack-layer"
        cell-class="is-vcentered">
        <div class="image is-48x48 mb-2">
          <b-image
            v-if="!isLoading"
            :src="props.row.image"
            :alt="props.row.name"
            ratio="1by1"
            rounded />
          <b-skeleton :active="isLoading" circle width="48px" height="48px" />
        </div>
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="id"
        label="Collection">
        <nuxt-link v-if="!isLoading" :to="`/rmrk/collection/${props.row.id}`">
          {{ props.row.name }}
        </nuxt-link>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="volume"
        :label="$t('series.volume')"
        sortable
        numeric
        cell-class="is-vcentered">
        <template v-if="!isLoading">
          <Money :value="props.row.volume" inline hideUnit />
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="dailyVolume"
        label="24h %"
        numeric
        cell-class="is-vcentered"
        :visible="nbDays === '24'">
        <template v-if="!isLoading">
          <div
            :class="
              displayVolumePercent(
                props.row.dailyVolume,
                props.row.dailyrangeVolume,
                true
              )
            ">
            {{
              displayVolumePercent(
                props.row.dailyVolume,
                props.row.dailyrangeVolume
              )
            }}
          </div>
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <!-- <b-table-column
        v-slot="props"
        field="weeklyVolume"
        label="7d %"
        numeric
        cell-class="is-vcentered"
        :visible="nbDays === '7'">
        <template v-if="!isLoading">
          <div
            :class="
              displayVolumePercent(
                props.row.weeklyVolume,
                props.row.weeklyrangeVolume,
                true
              )
            ">
            {{
              displayVolumePercent(
                props.row.weeklyVolume,
                props.row.weeklyrangeVolume
              )
            }}
          </div>
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column> -->

      <b-table-column
        v-slot="props"
        field="monthlyVolume"
        label="30d %"
        numeric
        cell-class="is-vcentered"
        :visible="nbDays === '30'">
        <template v-if="!isLoading">
          <div
            :class="
              displayVolumePercent(
                props.row.monthlyVolume,
                props.row.monthlyrangeVolume,
                true
              )
            ">
            {{
              displayVolumePercent(
                props.row.monthlyVolume,
                props.row.monthlyrangeVolume
              )
            }}
          </div>
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="floorPrice"
        :label="$t('series.floorprice')"
        numeric
        cell-class="is-vcentered"
        sortable>
        <template v-if="!isLoading">
          <Money :value="props.row.floorPrice" inline hideUnit />
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="averagePrice"
        :label="$t('series.averagePrice')"
        numeric
        cell-class="is-vcentered">
        <template v-if="!isLoading">
          <Money :value="props.row.averagePrice" inline hideUnit />
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="highestSale"
        :label="$t('series.highestSale')"
        numeric
        cell-class="is-vcentered"
        sortable>
        <template v-if="!isLoading">
          <Money :value="props.row.highestSale" inline hideUnit />
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        field="buys"
        :label="$t('series.buys')"
        v-slot="props"
        numeric
        cell-class="is-vcentered"
        sortable>
        <template v-if="!isLoading">{{ props.row.buys }}</template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="sold"
        :label="$t('series.owners')"
        sortable
        numeric
        cell-class="is-vcentered">
        <template v-if="!isLoading">
          {{ props.row.sold }}
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="total"
        :label="$t('series.assets')"
        sortable
        numeric
        cell-class="is-vcentered">
        <template v-if="!isLoading">
          {{ props.row.total }}
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="rank"
        :label="$t('series.score')"
        numeric
        cell-class="is-vcentered">
        <template v-if="!isLoading">
          {{ Math.ceil(props.row.rank) }}
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="emoteCount"
        :label="$t('series.emoteCount')"
        numeric
        cell-class="is-vcentered">
        <template v-if="!isLoading">
          {{ Math.ceil(props.row.emoteCount) }}
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered has-text-centered"
        field="chart"
        label="Chart">
        <nuxt-link
          v-if="!isLoading"
          :to="`/rmrk/collection/${props.row.id}?tab=chart&locate=true`"
          target="_blank">
          <b-icon icon="chart-line"> </b-icon>
        </nuxt-link>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered has-text-centered"
        field="history"
        label="History">
        <nuxt-link
          v-if="!isLoading"
          :to="`/rmrk/collection/${props.row.id}?tab=history&locate=true`"
          target="_blank">
          <b-icon icon="list-ul"> </b-icon>
        </nuxt-link>
        <b-skeleton :active="isLoading" />
      </b-table-column>
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered has-text-centered history"
        field="buyHistory"
        :label="$t('series.buyHistory')">
        <b-skeleton v-if="isLoading" :active="isLoading" />
        <PulseChart
          v-else
          :id="props.row.id"
          :labels="props.row.buyHistory.xAxisList"
          :values="props.row.buyHistory.yAxisList" />
      </b-table-column>
      <template #empty>
        <div v-if="!isLoading" class="has-text-centered">
          {{ $t('spotlight.empty') }}
        </div>
        <b-skeleton :active="isLoading" />
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import { RowSeries, SortType, BuyHistory } from './types'
import seriesInsightList from '@/queries/rmrk/subsquid/seriesInsightList.graphql'
import collectionsEvents from '@/queries/rmrk/subsquid/collectionsEvents.graphql'
import { NFTMetadata, Collection } from '../rmrk/service/scheme'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
import { exist } from '@/components/rmrk/Gallery/Search/exist'
import { emptyObject } from '@/utils/empty'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import {
  toSort,
  lastmonthDate,
  today,
  getDateArray,
  onlyDate,
  calculateAvgPrice,
} from './utils'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component({ components })
export default class SeriesTable extends mixins(PrefixMixin) {
  protected data: RowSeries[] = []
  protected usersWithIdentity: RowSeries[] = []
  protected nbDays = '7'
  protected nbRows = '50'
  protected sortBy: SortType = { field: 'volume', value: 'DESC' }
  public isLoading = false
  public meta: NFTMetadata = emptyObject<NFTMetadata>()

  async created() {
    exist(this.$route.query.rows, (val) => {
      this.nbRows = val
    })
    exist(this.$route.query.period, (val) => {
      this.nbDays = val
    })
    exist(this.$route.query.sort, (val) => {
      this.sortBy.field = val.slice(1)
      this.sortBy.value = val.charAt(0) === '-' ? 'DESC' : 'ASC'
    })
    await this.fetchCollectionsSeries(Number(this.nbRows))
  }

  public async fetchCollectionsSeries(
    limit = 10,
    sort: string = toSort(this.sortBy)
  ) {
    this.isLoading = true
    const collections = await this.$apollo.query({
      query: seriesInsightList,
      client: 'subsquid',
      variables: {
        // denyList, not yet
        limit,
        offset: 0,
        orderBy: sort || 'volume_DESC',
      },
    })

    const {
      data: { collectionEntities },
    } = collections

    const defaultBuyEvents = getDateArray(lastmonthDate, today).reduce(
      (res, date) => {
        res[date] = 0
        return res
      },
      {}
    )

    const axisLize = (obj = {}): BuyHistory => ({
      xAxisList: Object.keys(obj),
      yAxisList: Object.values(obj),
    })

    const ids = collectionEntities.map((c: Collection) => c.id)

    const buyEvents = (await this.fetchCollectionEvents(ids))
      .map((e) => ({
        ...e.nft.collection,
        timestamp: onlyDate(new Date(e.timestamp)),
      }))
      .reduce((res, e) => {
        const { id, timestamp: ts } = e
        if (!res[id]) {
          res[id] = Object.assign({}, defaultBuyEvents)
        }
        res[id][ts] += 1
        return res
      }, {})

    this.data = collectionEntities.map(
      (e: RowSeries): RowSeries => ({
        ...e,
        image: sanitizeIpfsUrl(e.image),
        rank: e.sold * (e.unique / e.total || 1),
        averagePrice: calculateAvgPrice(e.volume as string, e.buys),
        buyHistory: axisLize(
          Object.assign({}, defaultBuyEvents, buyEvents[e.id] || {})
        ),
        emoteCount: e.emoteCount || 0,
      })
    )

    this.isLoading = false
  }

  protected async fetchCollectionEvents(ids: string[]) {
    try {
      // const today = new Date()
      const { data } = await this.$apollo.query<{ events }>({
        query: collectionsEvents,
        client: 'subsquid',
        variables: {
          ids: ids,
          and: {
            interaction_eq: 'BUY',
          },
          lte: today,
          gte: lastmonthDate,
        },
      })
      return data.events
    } catch (e) {
      this.$consola.error(e)
      return []
    }
  }

  public onSort(field: string, order: string) {
    let sort: SortType = {
      field: field,
      value: order === 'desc' ? 'DESC' : 'ASC',
    }
    this.$router
      .replace({
        path: String(this.$route.path),
        query: {
          ...this.$route.query,
          sort: (order === 'desc' ? '-' : '+') + field,
        },
      })
      .catch((e) => this.$consola.warn(e))
    this.fetchCollectionsSeries(Number(this.nbRows), toSort(sort))
  }

  @Watch('nbRows')
  public onTopRowsChange(value: string) {
    this.$router
      .replace({
        path: String(this.$route.path),
        query: { ...this.$route.query, rows: value },
      })
      .catch((e) => this.$consola.warn(e))
    this.fetchCollectionsSeries(Number(value))
  }

  @Watch('nbDays')
  public onTopDaysChange(value: string) {
    this.$router
      .replace({
        path: String(this.$route.path),
        query: { ...this.$route.query, period: value },
      })
      .catch((e) => this.$consola.warn(e))
  }

  public displayVolumePercent(
    priceNow: number,
    priceAgo: number,
    getClass?: boolean
  ) {
    /* added getClass for getting the class name for the row
     * it would be true when you want to return the class name
     */
    const vol = ((priceNow - priceAgo) / priceAgo) * 100
    if (vol === 0 || !parseFloat(String(vol)) || !isFinite(vol)) {
      return getClass ? '' : '---'
    }
    const volumePercent = Math.round(vol * 100) / 100

    if (getClass) {
      return volumePercent > 0 ? 'has-text-success' : 'has-text-danger'
    }

    return volumePercent > 0 ? `+${volumePercent}%` : `${volumePercent}%`
  }
}
</script>
<style lang="scss">
@import '@/styles/variables';

/* ??? global */
.b-radio.is-selected {
  color: #000;
  background-color: $primary;
}

.history {
  width: 200px;
  height: 100px;
}

.series-sticky-header th {
  top: 120px;
  position: sticky;
  background: $frosted-glass-background;
  backdrop-filter: $frosted-glass-backdrop-filter;
}

.front-stack-layer {
  z-index: 1;
}
</style>
