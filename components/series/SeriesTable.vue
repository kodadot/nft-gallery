<template>
  <div>
    <b-field grouped>
      <b-field
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
      </b-field>

      <b-field
        class="has-text-right"
        expanded
      >
        <b-select v-model="nbRows">
          <option value="10">
            10
          </option>
          <option value="20">
            20
          </option>
          <option value="50">
            50
          </option>
          <option value="100">
            100
          </option>
        </b-select>
      </b-field>
    </b-field>

    <b-table
      :data="data"
      :default-sort="sortBy.field"
      :default-sort-direction="sortBy.value === -1 ? 'desc' : 'asc'"
      @sort="onSort"
      backend-sorting
      hoverable
    >
      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="id"
        label="N°"
      >
        {{ data.indexOf(props.row) + 1 }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="image"
        label=""
        cell-class="is-vcentered"
      >
        <div class="image is-48x48 mb-2">
          <b-image
            v-if="!isLoading"
            :src="props.row.image"
            :alt="props.row.name"
            ratio="1by1"
            rounded
          />
          <b-skeleton
            :active="isLoading"
            circle
            width="48px"
            height="48px"
          />
        </div>
      </b-table-column>

      <b-table-column
        v-slot="props"
        cell-class="is-vcentered"
        field="id"
        label="Collection"
      >
        <nuxt-link
          v-if="!isLoading"
          :to="`/rmrk/collection/${props.row.id}`"
        >
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
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">
          <Money
            :value="props.row.volume"
            inline
          />
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="dailyVolume"
        label="24h %"
        sortable
        numeric
        cell-class="is-vcentered"
        :visible="nbDays === '24'"
      >
        <template v-if="!isLoading">
          <div
            v-html="
              displayVolumePercent(
                props.row.dailyVolume,
                props.row.dailyrangeVolume
              )
            "
          />
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="weeklyVolume"
        label="7d %"
        sortable
        numeric
        cell-class="is-vcentered"
        :visible="nbDays === '7'"
      >
        <template v-if="!isLoading">
          <div
            v-html="
              displayVolumePercent(
                props.row.weeklyVolume,
                props.row.weeklyrangeVolume
              )
            "
          />
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="monthlyVolume"
        label="30d %"
        sortable
        numeric
        cell-class="is-vcentered"
        :visible="nbDays === '30'"
      >
        <template v-if="!isLoading">
          <div
            v-html="
              displayVolumePercent(
                props.row.monthlyVolume,
                props.row.monthlyrangeVolume
              )
            "
          />
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="floorPrice"
        :label="$t('series.floorprice')"
        sortable
        numeric
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">
          <Money
            :value="props.row.floorPrice"
            inline
          />
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        field="totalBuys"
        :label="$t('series.buys')"
        v-slot="props"
        sortable
        numeric
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">{{ props.row.totalBuys }}</template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="uniqueCollectors"
        :label="$t('series.owners')"
        sortable
        numeric
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">
          {{ props.row.uniqueCollectors }}
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="sold"
        :label="$t('series.collected')"
        sortable
        numeric
        cell-class="is-vcentered"
      >
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
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">
          {{ props.row.total }}
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="rank"
        :label="$t('spotlight.score')"
        sortable
        numeric
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">
          {{
            Math.ceil(props.row.rank)
          }}
        </template>
        <b-skeleton :active="isLoading" />
      </b-table-column>

      <template #empty>
        <div
          v-if="!isLoading"
          class="has-text-centered"
        >
          {{ $t('spotlight.empty') }}
        </div>
        <b-skeleton :active="isLoading" />
      </template>
    </b-table>
  </div>
</template>

<script lang="ts" >
import { Component, mixins, Vue, Watch } from 'nuxt-property-decorator'
import { Column, RowSeries, SortType } from './types'
import { columns, nftFn } from './utils'
import collectionSeriesList from '@/queries/collectionSeriesList.graphql'
import { seriesAggQuery } from '../rmrk/Gallery/Search/query'
import { NFTMetadata, Collection } from '../rmrk/service/scheme'
import { denyList } from '@/utils/constants'
import { sanitizeIpfsUrl, fetchCollectionMetadata} from '@/components/rmrk/utils'
import { exist } from '@/components/rmrk/Gallery/Search/exist'
import { emptyObject } from '@/utils/empty'
import { get, set } from 'idb-keyval'
import PrefixMixin from '~/utils/mixins/prefixMixin'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component({ components })
export default class SeriesTable extends mixins(PrefixMixin) {
  protected data: RowSeries[] = []
  protected columns: Column[] = columns
  protected usersWithIdentity: RowSeries[] = []
  protected nbDays = '7'
  protected nbRows = '10'
  protected sortBy: SortType = { field: 'volume', value: -1 }
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
      this.sortBy.value = val.charAt(0) === '-' ? -1 : 1
    })
    await this.fetchCollectionsSeries(Number(this.nbRows))
  }

  public async fetchCollectionsSeries(limit = 10, sort: SortType = this.sortBy) {
    this.isLoading = true
    const collections = await this.$apollo.query({
      query: collectionSeriesList,
      client: this.urlPrefix,
      variables: {
        denyList,
      },
    })

    const {
      data: { collectionEntities },
    } = collections

    this.data = seriesAggQuery(
      limit,
      sort,
      collectionEntities?.nodes?.map(nftFn)
    ) as RowSeries[]

    // fetch metadata for images
    for (let index = 0; index < this.data.length; index++) {
      const image = await this.fetchMetadataImage(
        this.data[index].metadata
      )

      if (image) {
        this.data[index].image = image
      }
    }

    this.isLoading = false
  }

  public onSort(field: string, order: string) {
    let sort: SortType = { field: field, value: order === 'desc' ? -1 : 1 }
    this.$router.replace({
      path: String(this.$route.path),
      query: { ...this.$route.query, sort: (order === 'desc' ? '-' : '+') + field },
    }).catch((e) => console.warn(e))
    this.fetchCollectionsSeries(Number(this.nbRows), sort)
  }

  @Watch('nbRows')
  public onTopRowsChange(value: string) {
    this.$router.replace({
      path: String(this.$route.path),
      query: { ...this.$route.query, rows: value },
    }).catch((e) => console.warn(e))
    this.fetchCollectionsSeries(Number(value))
  }

  @Watch('nbDays')
  public onTopDaysChange(value: string) {
    this.$router.replace({
      path: String(this.$route.path),
      query: { ...this.$route.query, period: value },
    }).catch((e) => console.warn(e))
  }

  public async fetchMetadataImage(metadata: any) {
    const m = await get(metadata)
    const meta = m ? m : await fetchCollectionMetadata({ metadata } as Collection)
    if (!m) {
      set(metadata, meta)
    }
    return sanitizeIpfsUrl(meta.image || '')
  }

  public displayVolumePercent(priceNow: number, priceAgo: number) {
    const vol = ((priceNow - priceAgo) / priceAgo) * 100
    if (vol === 0 || !parseFloat(String(vol)) || !isFinite(vol)) {
      return '---'
    }
    const volumePercent = Math.round(vol * 100) / 100
    return volumePercent > 0
      ? `<div style="color: #41b883"> +${volumePercent}%</div>`
      : `<div class="has-text-danger"> ${volumePercent}%</div>`
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
