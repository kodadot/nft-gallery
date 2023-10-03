<template>
  <div class="spotlight">
    <Loader :modelValue="isLoading" />
    <NeoTable
      :data="computedData"
      :current-page="currentPage"
      :default-sort="[sortBy.field, sortBy.value]"
      default-sort-direction="desc"
      hoverable
      detailed
      paginated
      pagination-position="top"
      backend-sorting
      show-detail-icon
      class="spotlight-sticky-header"
      @page-change="onPageChange"
      @sort="onSort">
      <template #top-left>
        <NeoField class="mb-0">
          <div class="control is-flex">
            <NeoSwitch v-model="onlyWithIdentity" :rounded="false">
              {{ $t('spotlight.filter_accounts') }}
            </NeoSwitch>
          </div>
        </NeoField>
      </template>
      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="id"
        :label="$t('spotlight.id')">
        <template v-if="!isLoading">
          <nuxt-link v-if="!isLoading" :to="`/${urlPrefix}/u/${props.row.id}`">
            <Identity :address="props.row.id" />
          </nuxt-link>
        </template>
        <NeoSkeleton :active="isLoading"> </NeoSkeleton>
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="sold"
        :label="$t('spotlight.sold')"
        sortable>
        <template v-if="!isLoading">{{ props.row.sold }}</template>
        <NeoSkeleton :active="isLoading"> </NeoSkeleton>
      </NeoTableColumn>

      <NeoTableColumn
        position="centered"
        field="unique"
        :label="$t('spotlight.unique')"
        sortable>
        <template #header="{ column }">
          <NeoTooltip :label="$t('spotlight.uniqueItemsTooltip')" dashed>
            {{ column.label }}
          </NeoTooltip>
        </template>
        <template v-if="!isLoading" #default="props">{{
          props.row.unique
        }}</template>
        <NeoSkeleton :active="isLoading"> </NeoSkeleton>
      </NeoTableColumn>

      <NeoTableColumn
        position="centered"
        field="uniqueCollectors"
        :label="$t('spotlight.uniqueCollectors')"
        sortable>
        <template #header="{ column }">
          <NeoTooltip :label="$t('spotlight.uniqueCollectorsTooltip')" dashed>
            {{ column.label }}
          </NeoTooltip>
        </template>
        <template v-if="!isLoading" #default="props">{{
          props.row.uniqueCollectors
        }}</template>
        <NeoSkeleton :active="isLoading"> </NeoSkeleton>
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="total"
        :label="$t('spotlight.total')"
        sortable>
        <template v-if="!isLoading">{{ props.row.total }}</template>
        <NeoSkeleton :active="isLoading"> </NeoSkeleton>
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="average"
        :label="$t('spotlight.averagePrice')"
        sortable>
        <template v-if="!isLoading">
          <Money :value="props.row.averagePrice" inline hide-unit />
        </template>
        <NeoSkeleton :active="isLoading"> </NeoSkeleton>
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="collections"
        :label="$t('spotlight.count')"
        sortable>
        <template v-if="!isLoading">{{ props.row.count }}</template>
        <NeoSkeleton :active="isLoading"> </NeoSkeleton>
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        position="centered"
        field="volume"
        label="Volume"
        sortable>
        <template v-if="!isLoading"
          ><Money :value="props.row.volume" inline hide-unit
        /></template>
        <NeoSkeleton :active="isLoading"> </NeoSkeleton>
      </NeoTableColumn>

      <NeoTableColumn
        position="centered"
        field="rank"
        :label="$t('spotlight.score')"
        numeric>
        <template #header="{ column }">
          <NeoTooltip :label="$t('spotlight.scoreCalc')" dashed>
            {{ column.label }}
          </NeoTooltip>
        </template>
        <template v-if="!isLoading" #default="props">{{
          Math.ceil(props.row.rank * 100) / 100
        }}</template>
        <NeoSkeleton :active="isLoading"> </NeoSkeleton>
      </NeoTableColumn>

      <NeoTableColumn
        v-slot="props"
        cell-class="is-vcentered has-text-centered history"
        field="soldHistory"
        :label="$t('spotlight.soldHistory')">
        <NeoSkeleton :active="isLoading" />
        <PulseChart
          v-if="!isLoading"
          :id="props.row.id"
          :labels="props.row.soldHistory.xAxisList"
          :values="props.row.soldHistory.yAxisList" />
      </NeoTableColumn>

      <template #detail="props">
        <SpotlightDetail v-if="props.row.total" :account="props.row.id" />
        <div v-else class="has-text-centered">{{ $t('spotlight.empty') }}</div>
      </template>

      <template #empty>
        <div v-if="!isLoading" class="w-100 has-text-centered">
          {{ $t('spotlight.empty') }}
        </div>
        <NeoSkeleton :active="isLoading"> </NeoSkeleton>
      </template>
    </NeoTable>
  </div>
</template>

<script setup lang="ts">
import { GenericAccountId } from '@polkadot/types/generic/AccountId'
import {
  NeoField,
  NeoSkeleton,
  NeoSwitch,
  NeoTable,
  NeoTableColumn,
  NeoTooltip,
} from '@kodadot1/brick'

import {
  axisLize,
  defaultEvents,
  lastmonthDate,
  onlyDate,
  toSort,
  today,
} from '@/components/series/utils'
import { SortType } from '@/components/series/types'
import { exist } from '@/utils/exist'

import { PER_PAGE } from '@/utils/constants'

import { Row } from './types'

import spotlightList from '@/queries/rmrk/subsquid/spotlightList.graphql'
import spotlightSoldHistory from '@/queries/rmrk/subsquid/spotlightSoldHistory.graphql'

type Address = string | GenericAccountId | undefined

import Identity from '@/components/identity/IdentityIndex.vue'
import Money from '@/components/shared/format/Money.vue'
import SpotlightDetail from './SpotlightDetail.vue'
import Loader from '@/components/shared/Loader.vue'

const { client, urlPrefix } = usePrefix()
const route = useRoute()

const spotlight = ref([])
const onlyWithIdentity = ref(route.query?.identity || false)
const currentPage = ref(1)
const sortBy = ref({ field: 'sold', value: 'DESC' })
const isLoading = ref(false)

onMounted(async () => {
  exist(route.query?.sort, (val) => {
    sortBy.value.field = val.slice(1)
    sortBy.value.value = val.charAt(0) === '-' ? 'DESC' : 'ASC'
  })
  await fetchSpotlightData()
})

const computedData = computed(() => {
  return onlyWithIdentity.value
    ? spotlight.value.filter((x) => x.hasIdentity)
    : spotlight.value
})

const ids = computed(() => {
  if (computedData.value.length === 0) {
    return ['']
  }
  const start = (currentPage.value - 1) * PER_PAGE
  const end = currentPage.value * PER_PAGE
  return computedData.value.slice(start, end).map((x) => x.id)
})

const fetchSpotlightData = async (sort: string = toSort(sortBy.value)) => {
  isLoading.value = true
  const queryVars = {
    offset: 0,
    orderBy: sort || 'sold_DESC',
  }

  const { data: collections } = await useAsyncQuery(spotlightList, queryVars)
  const { collectionEntities } = collections.value

  spotlight.value = collectionEntities.map(
    (e): Row => ({
      ...e,
      averagePrice: Number(e.averagePrice),
      collectors: e.sold,
      rank: e.sold * (e.unique / e.total || 1),
      uniqueCollectors: e.uniqueCollectors,
      volume: BigInt(e.volume),
      soldHistory: axisLize(defaultEvents(lastmonthDate, today)),
    })
  )

  spotlight.value.forEach((item) => {
    const result = resolveAddress(item.id)
    if (result) {
      item['hasIdentity'] = true
    }
  })

  await updateSoldHistory()

  isLoading.value = false
}

const updateSoldHistory = async () => {
  isLoading.value = true
  const defaultSoldEvents = defaultEvents(lastmonthDate, today)
  const solds = (await fetchSpotlightSoldHistory())
    .map((nft) => ({
      id: nft.issuer,
      timestamps: nft.events.flat().map((x) => onlyDate(new Date(x.timestamp))),
    }))
    .reduce((res, e) => {
      const { id, timestamps } = e
      if (!res[id]) {
        res[id] = Object.assign({}, defaultSoldEvents)
      }
      timestamps.forEach((ts) => (res[id][ts] += 1))
      return res
    }, {})

  spotlight.value.forEach((row) => {
    if (solds[row.id]) {
      row['soldHistory'] = axisLize(solds[row.id])
    }
  })

  isLoading.value = false
}

const fetchSpotlightSoldHistory = async () => {
  const { data: result } = await useAsyncQuery({
    query: spotlightSoldHistory,
    clientId: client.value,
    variables: {
      ids: ids.value,
      lte: today,
      gte: lastmonthDate,
    },
  })

  const { nftEntities } = result.value
  return nftEntities
}

const onPageChange = (page: number) => {
  currentPage.value = page
  updateSoldHistory()
}

watch(onlyWithIdentity, async (val) => {
  replaceUrl(val ? 'true' : '', 'identity')
  await updateSoldHistory()
})

const onSort = (field: string, order: string) => {
  const sort: SortType = {
    field: field,
    value: order === 'desc' ? 'DESC' : 'ASC',
  }
  replaceUrl((order === 'desc' ? '-' : '+') + field, 'sort')
  fetchSpotlightData(toSort(sort))
}

const replaceUrl = (value: string, key = 'sort') => {
  const { route, router, $consola } = useNuxtApp()
  if (route.query[key] !== value) {
    router
      .replace({
        path: String(route.path),
        query: { ...route.query, [key]: value },
      })
      .catch($consola.warn /*Navigation Duplicate err fix later */)
  }
}

const resolveAddress = (account: Address) => {
  return account instanceof GenericAccountId
    ? account.toString()
    : account || ''
}
</script>

<style scoped lang="scss">
.history {
  width: 200px;
  height: 100px;
}
</style>

<style lang="scss">
.spotlight-sticky-header td {
  vertical-align: middle;
}

.spotlight .level-right {
  margin-right: 3rem;
}

@media only screen and (max-width: 768px) {
  .spotlight .level-right {
    margin-left: 2rem;
    margin-right: 0rem;
  }
}
</style>
