<template>
  <div>
    <Loader :model-value="isLoading" />
    <NeoField grouped>
      <NeoField class="text-right" expanded>
        <NeoSelect v-model="nbRows">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </NeoSelect>
      </NeoField>
    </NeoField>

    <NeoTable
      sticky-header
      :data="data"
      :default-sort="[sortBy.field, sortBy.value]"
      default-sort-direction="desc"
      backend-sorting
      hoverable
      @sort="onSort">
      <NeoTableColumn
        v-slot="props"
        cell-class="is-vcentered"
        field="id"
        label="N°">
        {{ data.indexOf(props.row) + 1 }}
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        field="image"
        label=""
        header-class="z-10"
        cell-class="is-vcentered">
        <div class="image is-48x48 mb-2">
          <BasicImage :src="props.row.image" :alt="props.row.name" rounded />
        </div>
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        cell-class="is-vcentered"
        field="id"
        label="Collection">
        <nuxt-link
          v-if="!isLoading"
          :to="`/${urlPrefix}/collection/${props.row.id}`">
          {{ props.row.name }}
        </nuxt-link>
        <NeoSkeleton :active="isLoading" />
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        field="volume"
        :label="$t('series.volume')"
        sortable
        numeric
        cell-class="is-vcentered">
        <template v-if="!isLoading">
          <Money :value="props.row.volume" inline hide-unit />
        </template>
        <NeoSkeleton :active="isLoading" />
      </NeoTableColumn>

      <NeoTableColumn
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
                true,
              )
            ">
            {{
              displayVolumePercent(
                props.row.dailyVolume,
                props.row.dailyrangeVolume,
              )
            }}
          </div>
        </template>
        <NeoSkeleton :active="isLoading" />
      </NeoTableColumn>

      <!-- <NeoTableColumn
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
        <NeoSkeleton :active="isLoading" />
      </NeoTableColumn> -->

      <NeoTableColumn
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
                true,
              )
            ">
            {{
              displayVolumePercent(
                props.row.monthlyVolume,
                props.row.monthlyrangeVolume,
              )
            }}
          </div>
        </template>
        <NeoSkeleton :active="isLoading" />
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        field="floorPrice"
        :label="$t('series.floorprice')"
        numeric
        cell-class="is-vcentered"
        sortable>
        <template v-if="!isLoading">
          <Money :value="props.row.floorPrice" inline hide-unit />
        </template>
        <NeoSkeleton :active="isLoading" />
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        field="averagePrice"
        :label="$t('series.averagePrice')"
        numeric
        cell-class="is-vcentered">
        <template v-if="!isLoading">
          <Money :value="props.row.averagePrice" inline hide-unit />
        </template>
        <NeoSkeleton :active="isLoading" />
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        field="highestSale"
        :label="$t('series.highestSale')"
        numeric
        cell-class="is-vcentered"
        sortable>
        <template v-if="!isLoading">
          <Money :value="props.row.highestSale" inline hide-unit />
        </template>
        <NeoSkeleton :active="isLoading" />
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        field="buys"
        :label="$t('series.buys')"
        numeric
        cell-class="is-vcentered"
        sortable>
        <template v-if="!isLoading">{{ props.row.buys }}</template>
        <NeoSkeleton :active="isLoading" />
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        field="sold"
        :label="$t('series.owners')"
        sortable
        numeric
        cell-class="is-vcentered">
        <template v-if="!isLoading">
          {{ props.row.sold }}
        </template>
        <NeoSkeleton :active="isLoading" />
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        field="total"
        :label="$t('series.assets')"
        sortable
        numeric
        cell-class="is-vcentered">
        <template v-if="!isLoading">
          {{ props.row.total }}
        </template>
        <NeoSkeleton :active="isLoading" />
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        field="rank"
        :label="$t('series.score')"
        numeric
        cell-class="is-vcentered">
        <template v-if="!isLoading">
          {{ Math.ceil(props.row.rank) }}
        </template>
        <NeoSkeleton :active="isLoading" />
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        field="emoteCount"
        :label="$t('series.emoteCount')"
        numeric
        cell-class="is-vcentered">
        <template v-if="!isLoading">
          {{ Math.ceil(props.row.emoteCount) }}
        </template>
        <NeoSkeleton :active="isLoading" />
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        cell-class="is-vcentered text-center"
        field="chart"
        :label="$t('series.chart')">
        <nuxt-link
          v-if="!isLoading"
          :to="`/${urlPrefix}/collection/${props.row.id}?tab=chart&locate=true`"
          target="_blank">
          <NeoIcon icon="chart-line" />
        </nuxt-link>
        <NeoSkeleton :active="isLoading" />
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        cell-class="is-vcentered text-center"
        field="history"
        :label="$t('series.history')">
        <nuxt-link
          v-if="!isLoading"
          :to="`/${urlPrefix}/collection/${props.row.id}?tab=history&locate=true`"
          target="_blank">
          <NeoIcon icon="list-ul" />
        </nuxt-link>
        <NeoSkeleton :active="isLoading" />
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        cell-class="is-vcentered text-center w-52 h-24"
        field="buyHistory"
        :label="$t('series.buyHistory')">
        <NeoSkeleton v-if="isLoading" :active="isLoading" />
        <PulseChart
          v-else
          :id="props.row.id"
          :labels="props.row.buyHistory.xAxisList"
          :values="props.row.buyHistory.yAxisList" />
      </NeoTableColumn>
      <template #empty>
        <div v-if="!isLoading" class="w-full text-center">
          {{ $t('spotlight.empty') }}
        </div>
        <NeoSkeleton :active="isLoading" />
      </template>
    </NeoTable>
  </div>
</template>

<script lang="ts" setup>
import { Collection } from '@/components/rmrk/service/scheme'
import { exist } from '@/utils/exist'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import collectionsEvents from '@/queries/rmrk/subsquid/collectionsEvents.graphql'
import seriesInsightList from '@/queries/rmrk/subsquid/seriesInsightList.graphql'

import { BuyHistory, RowSeries, SortType } from './types'
import {
  calculateAvgPrice,
  getDateArray,
  lastmonthDate,
  onlyDate,
  toSort,
  today,
} from './utils'
import {
  NeoField,
  NeoIcon,
  NeoSelect,
  NeoSkeleton,
  NeoTable,
  NeoTableColumn,
} from '@kodadot1/brick'

import Money from '@/components/shared/format/Money.vue'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import Loader from '@/components/shared/Loader.vue'

const route = useRoute()
const router = useRouter()
const { $consola } = useNuxtApp()
const { client, urlPrefix } = usePrefix()
const nbRows = ref('50')
const nbDays = ref('7')
const isLoading = ref(false)
const sortBy = reactive<SortType>({ field: 'volume', value: 'DESC' })

const data = ref<RowSeries[]>([])

const seriesQueryParams = async (limit, sort) => ({
  limit,
  offset: 0,
  orderBy: sort || 'volume_DESC',
  where: {
    volume_isNull: false,
  },
})

const fetchCollectionEvents = async (ids: string[]) => {
  if (ids.length === 0) {
    return []
  }
  try {
    const { data } = await useAsyncQuery({
      clientId: client.value,
      query: collectionsEvents,
      variables: {
        ids: ids,
        and: {
          interaction_eq: 'BUY',
        },
        lte: today,
        gte: lastmonthDate,
      },
    })
    return data.value.events
  } catch (e) {
    $consola.error(e)
    return []
  }
}

const fetchCollectionsSeries = async (
  limit = Number(nbRows.value),
  sort: string = toSort(sortBy),
) => {
  isLoading.value = true
  const { data: collections } = await useAsyncQuery({
    clientId: client.value,
    query: seriesInsightList,
    variables: await seriesQueryParams(limit, sort),
  })

  const { collectionEntities } = collections.value

  const defaultBuyEvents = getDateArray(lastmonthDate, today).reduce(
    (res, date) => {
      res[date] = 0
      return res
    },
    {},
  )

  const axisLize = (obj = {}): BuyHistory => ({
    xAxisList: Object.keys(obj),
    yAxisList: Object.values(obj),
  })

  const ids = collectionEntities.map((c: Collection) => c.id)

  const buyEvents = (await fetchCollectionEvents(ids))
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

  data.value = collectionEntities.map(
    (e: RowSeries): RowSeries => ({
      ...e,
      image: sanitizeIpfsUrl(e.image),
      rank: e.sold * (e.unique / e.total || 1),
      averagePrice: calculateAvgPrice(e.volume as string, e.buys),
      buyHistory: axisLize(
        Object.assign({}, defaultBuyEvents, buyEvents[e.id] || {}),
      ),
      emoteCount: e.emoteCount || 0,
    }),
  )

  isLoading.value = false
}

onBeforeMount(async () => {
  exist(route.query.rows, (val) => {
    nbRows.value = val
  })
  exist(route.query.period, (val) => {
    nbDays.value = val
  })
  exist(route.query.sort, (val) => {
    sortBy.field = val.slice(1)
    sortBy.value = val.charAt(0) === '-' ? 'DESC' : 'ASC'
  })
  await fetchCollectionsSeries(Number(nbRows.value))
})

const onSort = (field: string, order: string) => {
  let sort: SortType = {
    field: field,
    value: order === 'desc' ? 'DESC' : 'ASC',
  }
  router
    .replace({
      path: String(route.path),
      query: {
        ...route.query,
        sort: (order === 'desc' ? '-' : '+') + field,
      },
    })
    .catch((e) => $consola.warn(e))
  fetchCollectionsSeries(Number(nbRows.value), toSort(sort))
}

const displayVolumePercent = (
  priceNow: number,
  priceAgo: number,
  getClass?: boolean,
) => {
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

watch(client, (value) => {
  if (value) {
    fetchCollectionsSeries(Number(nbRows.value))
  }
})

watch(nbRows, (value: string) => {
  router
    .replace({
      path: String(route.path),
      query: { ...route.query, rows: value },
    })
    .catch((e) => $consola.warn(e))
  fetchCollectionsSeries(Number(value))
})

watch(nbDays, (value: string) => {
  router
    .replace({
      path: String(route.path),
      query: { ...route.query, period: value },
    })
    .catch((e) => $consola.warn(e))
})
</script>
