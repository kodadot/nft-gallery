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
        <b-button
          :class="{ active: state.timeRange == 'All' }"
          type="is-primary"
          @click="setTimeRange('All')">
          All
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

    <div v-if="loading" class="top-collections-grid">
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

<script lang="ts" setup>
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
import {
  calculateAvgPrice,
  monthlyVolume,
  monthlyrangeVolume,
  // threeMonthRangeVolume,
  // threeMonthlyVolume,
  volume,
  weeklyVolume,
  weeklyrangeVolume,
} from '@/components/series/utils'
import { TimeRange } from '@/components/series/types'
import { Collection, Interaction } from '../rmrk/service/scheme'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import { Ref, ref } from 'vue'
import { CollectionEntity } from '@/components/landing/types'
import { CollectionEntityWithVolumes } from '@/components/landing/types'

const { urlPrefix } = usePrefix()
const { $store, $consola } = useNuxtApp()

type FetchCollectionsSeriesResult = {
  collectionEntities: CollectionEntity[]
}
type CollectionSales = {
  id: string
  sales: {
    events: Interaction[]
  }[]
}

type FetchCollectionsSalesResult = {
  collectionsSales: CollectionSales[]
}

let data: Ref<CollectionEntityWithVolumes[]> = ref([])
let loading = ref(true)
const limit = 12
const state = reactive({ timeRange: 'All' })
let fetchCollectionsSeriesResult: Ref<FetchCollectionsSeriesResult | null> =
  ref(null)
let fetchCollectionsSalesResult: Ref<FetchCollectionsSalesResult | null> =
  ref(null)

const setTimeRange = (timeRange: TimeRange) => {
  state.timeRange = timeRange
}

onMounted(() => {
  if ($store.getters['getCurrentKSMValue']) {
    $store.dispatch('fiat/fetchFiatPrice')
  }
  fetchCollectionsSeries()
})

function fetchCollectionsSeries(sort = 'volume_DESC') {
  const { data, error } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'topCollectionList',
    variables: {
      orderBy: sort,
      limit: limit,
    },
  })
  if (error.value) {
    loading.value = false
    return
  }
  fetchCollectionsSeriesResult.value =
    data as unknown as FetchCollectionsSeriesResult
}
function fetchCollectionsSales(ids: string[]) {
  if (ids.length === 0) {
    loading.value = false
    return
  }

  const { data, error } = useGraphql({
    queryPrefix: 'rmrk',
    queryName: 'collectionsSales',
    variables: {
      ids: ids,
    },
  })
  if (error.value) {
    loading.value = false
    return
  }
  fetchCollectionsSalesResult.value =
    data as unknown as FetchCollectionsSalesResult
}

watch(fetchCollectionsSeriesResult, () => {
  if (fetchCollectionsSeriesResult.value) {
    const collectionEntities =
      fetchCollectionsSeriesResult.value.collectionEntities
    const collectionIds = collectionEntities.map((c) => c.id)
    fetchCollectionsSales(collectionIds)
  }
})

watch(fetchCollectionsSalesResult, () => {
  if (fetchCollectionsSalesResult.value && fetchCollectionsSeriesResult.value) {
    const collectionsSales = fetchCollectionsSalesResult.value.collectionsSales
    const collectionEntities =
      fetchCollectionsSeriesResult.value.collectionEntities
    proccessData(collectionEntities, collectionsSales)
  }
})

function proccessData(
  collectionEntities: CollectionEntity[],
  collectionsSales: CollectionSales[]
) {
  data.value = collectionEntities.map((e): CollectionEntityWithVolumes => {
    const thisCollectionSales = collectionsSales.find(
      ({ id }) => id === e.id
    ) as CollectionSales
    const saleEvents = thisCollectionSales.sales.map((nft) => nft.events).flat()

    return {
      ...e,
      image: sanitizeIpfsUrl(e.image),
      averagePrice: calculateAvgPrice(e.volume as string, e.buys),
      volume: volume(saleEvents),
      weeklyVolume: weeklyVolume(saleEvents),
      monthlyVolume: monthlyVolume(saleEvents),
      // threeMonthVolume: threeMonthlyVolume(saleEvents),
      weeklyrangeVolume: weeklyrangeVolume(saleEvents),
      monthlyrangeVolume: monthlyrangeVolume(saleEvents),
      // threeMonthlyrangeVolume: threeMonthRangeVolume(saleEvents),
    }
  })
  loading.value = false
}
</script>
