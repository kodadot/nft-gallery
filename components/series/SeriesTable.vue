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
      :data="data"
      :default-sort="[sortBy.field, sortBy.value]"
      backend-sorting
      hoverable
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
          <Money :value="props.row.volume" inline />
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

      <b-table-column
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
      </b-table-column>

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
        cell-class="is-vcentered">
        <template v-if="!isLoading">
          <Money :value="props.row.floorPrice" inline />
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        field="totalBuys"
        :label="$t('series.buys')"
        v-slot="props"
        numeric
        cell-class="is-vcentered">
        <template v-if="!isLoading">{{ props.row.totalBuys }}</template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="sold"
        :label="$t('series.collected')"
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
        :label="$t('spotlight.score')"
        numeric
        cell-class="is-vcentered">
        <template v-if="!isLoading">
          {{ Math.ceil(props.row.rank) }}
        </template>
        <b-skeleton :active="isLoading" />
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
import { Column, RowSeries, SortType } from './types'
import { columns } from './utils'
import collectionSeriesList from '@/queries/rmrk/subsquid/collectionSeriesList.graphql'
import { NFTMetadata } from '../rmrk/service/scheme'
import { denyList } from '@/utils/constants'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
import { exist } from '@/components/rmrk/Gallery/Search/exist'
import { emptyObject } from '@/utils/empty'
import PrefixMixin from '~/utils/mixins/prefixMixin'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
  Loader: () => import('@/components/shared/Loader.vue'),
}

@Component({ components })
export default class SeriesTable extends mixins(PrefixMixin) {
  protected data: RowSeries[] = []
  protected columns: Column[] = columns
  protected usersWithIdentity: RowSeries[] = []
  protected nbDays = '7'
  protected nbRows = '10'
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
    sort: SortType = this.sortBy
  ) {
    this.isLoading = true
    const collections = await this.$apollo.query({
      query: collectionSeriesList,
      client: 'subsquid',
      variables: {
        limit,
        offset: 0,
        orderBy: sort.field,
        orderDirection: sort.value
      },
    })

    const {
      data: { collectionEntities },
    } = collections

    this.data = collectionEntities
      .map(
        (e): RowSeries => ({
          ...e,
          image: sanitizeIpfsUrl(e.image),
          rank: e.sold * (e.unique / e.total || 1),
        })
      )

    // this.data = seriesAggQuery(
    //   limit,
    //   sort,
    //   collectionEntities?.nodes?.map(nftFn)
    // ) as RowSeries[]

    this.isLoading = false
  }

  public onSort(field: string, order: string) {
    let sort: SortType = { field: field, value: order === 'desc' ? 'DESC' : 'ASC' }
    this.$router
      .replace({
        path: String(this.$route.path),
        query: {
          ...this.$route.query,
          sort: (order === 'desc' ? '-' : '+') + field,
        },
      })
      .catch((e) => console.warn(e))
    this.fetchCollectionsSeries(Number(this.nbRows), sort)
  }

  @Watch('nbRows')
  public onTopRowsChange(value: string) {
    this.$router
      .replace({
        path: String(this.$route.path),
        query: { ...this.$route.query, rows: value },
      })
      .catch((e) => console.warn(e))
    this.fetchCollectionsSeries(Number(value))
  }

  @Watch('nbDays')
  public onTopDaysChange(value: string) {
    this.$router
      .replace({
        path: String(this.$route.path),
        query: { ...this.$route.query, period: value },
      })
      .catch((e) => console.warn(e))
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
</style>
