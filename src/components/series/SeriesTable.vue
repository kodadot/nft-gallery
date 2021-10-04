<template>
  <div>
    <b-field position="is-right">
      <b-radio-button
        v-model="nbRows"
        native-value="10"
        type="is-outlined"
      >10</b-radio-button>

      <b-radio-button
        v-model="nbRows"
        native-value="50"
        type="is-outlined"
      >50</b-radio-button>

      <b-radio-button
        v-model="nbRows"
        native-value="100"
        type="is-outlined"
      >100</b-radio-button>
    </b-field>

    <b-table :data="data" hoverable>
      <b-table-column
        cell-class="is-vcentered"
        field="id"
        label="N°"
        v-slot="props"
      >
        {{ data.indexOf(props.row) + 1 }}
      </b-table-column>

      <b-table-column
        field="image"
        label=""
        v-slot="props"
        cell-class="is-vcentered"
      >
        <div class="container image is-48x48 mb-2">
          <b-image
            v-if="!isLoading"
            :src="props.row.image"
            :alt="props.row.name"
            ratio="1by1"
            rounded
          ></b-image>
          <b-skeleton
            :active="isLoading"
            circle
            width="48px"
            height="48px"
          >
          </b-skeleton>
        </div>
      </b-table-column>

      <b-table-column
        cell-class="is-vcentered"
        field="id"
        label="Collection"
        v-slot="props"
      >
        <router-link
          :to="{
            name: 'collectionDetail',
            params: { id: props.row.id },
          }"
          v-if="!isLoading"
        >
          {{ props.row.name }}
        </router-link>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="rank"
        :label="$t('spotlight.score')"
        v-slot="props"
        sortable
        numeric
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">{{
          Math.ceil(props.row.rank)
        }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="volume"
        label="Volume"
        v-slot="props"
        sortable
        numeric
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">
          <Money :value="props.row.volume" inline />
        </template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="weeklyVolume"
        label="7d %"
        v-slot="props"
        sortable
        numeric
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">
          <!-- <Money :value="props.row.weeklyVolume" inline /> -->
          <div
            v-html="
              displayVolumePercent(
                props.row.weeklyVolume,
                props.row.volume
              )
            "
          ></div>
        </template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="monthlyVolume"
        label="30d %"
        v-slot="props"
        sortable
        numeric
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">
          <!-- <Money :value="props.row.monthlyVolume" inline /> -->
          <div
            v-html="
              displayVolumePercent(
                props.row.monthlyVolume,
                props.row.volume
              )
            "
          ></div>
        </template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="floorPrice"
        label="Floor price"
        v-slot="props"
        sortable
        numeric
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">
          <Money :value="props.row.floorPrice" inline />
        </template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="sold"
        label="Collected"
        v-slot="props"
        sortable
        numeric
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">{{ props.row.sold }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <b-table-column
        field="total"
        :label="$t('spotlight.total')"
        v-slot="props"
        sortable
        numeric
        cell-class="is-vcentered"
      >
        <template v-if="!isLoading">{{ props.row.total }}</template>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </b-table-column>

      <template #empty>
        <div v-if="!isLoading" class="has-text-centered">
          {{ $t('spotlight.empty') }}
        </div>
        <b-skeleton :active="isLoading"> </b-skeleton>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts" >
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Column, RowSeries } from './types'
import { columns, nftFn } from './utils'
import collectionSeriesList from '@/queries/collectionSeriesList.graphql'
import { seriesAggQuery } from '../rmrk/Gallery/Search/query'
import { NFTMetadata, Collection } from '../rmrk/service/scheme'
import { denyList } from '@/constants'
import { sanitizeIpfsUrl, fetchCollectionMetadata} from '@/components/rmrk/utils'
import { exist } from '@/components/rmrk/Gallery/Search/exist'
import { emptyObject } from '@/utils/empty'
import { get, set } from 'idb-keyval'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component({ components })
export default class SeriesTable extends Vue{
  protected data: RowSeries[] = []
  protected columns: Column[] = columns
  protected usersWithIdentity: RowSeries[] = []
  protected nbRows = '10'
  public isLoading = false;

  public meta: NFTMetadata = emptyObject<NFTMetadata>()

  async created() {
    exist(this.$route.query.rows, (val) => {
      this.nbRows = val
    })
    await this.fetchCollectionsSeries(Number(this.nbRows))
  }

  public async fetchCollectionsSeries(limit = 10) {
    this.isLoading = true
    const collections = await this.$apollo.query({
      query: collectionSeriesList,
      variables: {
        denyList,
      },
    })

    const {
      data: { collectionEntities },
    } = collections

    this.data = seriesAggQuery(
      limit,
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

    console.log(this.data)

    this.isLoading = false
  }

  @Watch('nbRows')
  public onTopRowsChange(value: string) {
    this.$router.replace({
      name: String(this.$route.name),
      query: { rows: value },
    })
    this.fetchCollectionsSeries(Number(value))
  }

  public async fetchMetadataImage(metadata: any) {
    const m = await get(metadata)
    const meta = m ? m : await fetchCollectionMetadata({ metadata } as Collection)
    if (!m) {
      set(metadata, meta)
    }
    return sanitizeIpfsUrl(meta.image || '')
  }

  public displayVolumePercent(firstVolume: number, volumeTotal: number) {
    const vol = (firstVolume / volumeTotal) * 100
    if (vol === 0) {
      return '---'
    }
    const volumePercent = Math.ceil(vol * 100) / 100
    return volumePercent
      ? `<div style="color: #41b883"> +${volumePercent}%</div>`
      : `<div class="has-text-danger"> -${volumePercent}%</div>`
  }
}
</script>
<style lang="scss">
@import '@/styles/variables';

.b-radio.is-selected {
  color: #000;
  background-color: $primary;
}
</style>
