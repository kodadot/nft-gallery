<template>
  <div class="block">
    <NeoCollapse
      :open="isOpen"
      class="card"
      :class="hideCollapse ? 'collapseHidden' : 'bordered'"
      animation="slide"
      aria-id="contentIdForHistory">
      <div>
        <Pagination
          v-model="currentPage"
          :total="total"
          :per-page="itemsPerPage"
          replace
          enable-listen-keyboard-event
          preserve-scroll />
      </div>
      <NeoTable :data="showList" class="mb-4" hoverable custom-row-key="ID">
        <NeoTableColumn
          v-slot="props"
          field="Collection"
          label="Collection"
          class="type-table">
          <nuxt-link
            :to="`/${urlPrefix}/collection/${props.row.Collection.id}`">
            {{ props.row.Collection.name }}
          </nuxt-link>
        </NeoTableColumn>
        <NeoTableColumn
          v-slot="props"
          field="Nft"
          label="Nft"
          class="type-table">
          <nuxt-link :to="`/${urlPrefix}/gallery/${props.row.Nft.id}`">
            {{ props.row.Nft.name }}
          </nuxt-link>
        </NeoTableColumn>
        <NeoTableColumn
          v-slot="props"
          class="short-identity__table"
          field="Buyer"
          label="Buyer">
          <nuxt-link :to="`/${urlPrefix}/u/${props.row.Buyer}`">
            <Identity :address="props.row.Buyer" />
          </nuxt-link>
        </NeoTableColumn>
        <NeoTableColumn
          v-slot="props"
          class="short-identity__table"
          field="Amount"
          label="Amount">
          {{ props.row.Amount }}
        </NeoTableColumn>
        <NeoTableColumn
          v-slot="props"
          class="short-identity__table"
          field="Date"
          label="Date">
          <NeoTooltip :label="props.row.Date" position="left">
            <BlockExplorerLink
              :text="props.row.Time"
              :block-id="props.row.Block" />
          </NeoTooltip>
        </NeoTableColumn>
      </NeoTable>
    </NeoCollapse>
  </div>
</template>

<script lang="ts" setup>
import { DocumentNode } from 'graphql'
import { formatDistanceToNow } from 'date-fns'
import {
  NeoCollapse,
  NeoTable,
  NeoTableColumn,
  NeoTooltip,
} from '@kodadot1/brick'

import { exist } from '@/utils/exist'

import formatBalance from '@/utils/format/balance'
import { parseDate } from '@/utils/historyEvent'

import { Event } from '../service/types'
import { usePreferencesStore } from '@/stores/preferences'

import Identity from '@/components/identity/IdentityIndex.vue'
import Pagination from '@/components/rmrk/Gallery/Pagination.vue'
import BlockExplorerLink from '@/components/shared/BlockExplorerLink.vue'

type TableRowItem = {
  id: string
  name: string
}

type ColumnCollection = {
  id: string
  name: string
}

type TableRow = {
  Type: string
  Item?: TableRowItem // only in collection
  Collection?: ColumnCollection
  Nft?: ColumnCollection
  Buyer: string
  To: string
  Amount: string
  Date: string
  Block: string
}

type ChartData = {
  buy: any[]
  list: any[]
}

const emit = defineEmits(['setPriceChartData'])
const prop = withDefaults(
  defineProps<{
    events?: Event[]
    openOnDefault?: boolean
    hideCollapse?: boolean
    query: DocumentNode
    issuer: string
  }>(),
  {
    events: () => [],
    openOnDefault: true,
    hideCollapse: false,
  }
)

const { $i18n, $consola, $route, $router } = useNuxtApp()
const preferencesStore = usePreferencesStore()
const { decimals, unit } = useChain()
const { urlPrefix } = usePrefix()

const currentPage = ref(parseInt($route.query?.page) || 1)
const event = ref($i18n.t('nft.event.BUY'))
const data = ref<TableRow[]>([])
const copyTableData = ref<TableRow[]>([])
const isOpen = ref(false)

onMounted(() => {
  exist($route.query.event, (val) => {
    event.value = val ? decodeURIComponent(val) : 'all'
  })
  isOpen.value = prop.openOnDefault
})

const total = computed(() => data.value.length)
const itemsPerPage = computed(() => preferencesStore.getHistoryItemsPerPage)
const showList = computed(() => {
  const endIndex = currentPage.value * itemsPerPage.value
  return data.value.slice(endIndex - itemsPerPage.value, endIndex)
})

const replaceUrl = (value: string, key = 'event') => {
  if ($route.query[key] !== value) {
    $router
      .replace({
        path: String($route.path),
        query: { ...$route.query, [key]: encodeURIComponent(value) },
      })
      .catch($consola.warn /*Navigation Duplicate err fix later */)
  }
}

const updateDataByEvent = () => {
  data.value =
    event.value === 'all'
      ? copyTableData.value
      : [...new Set(copyTableData.value.filter((v) => v.Type === event))]
}

const createTable = (): void => {
  data.value = []
  copyTableData.value = []
  const priceCollectorMap: Record<string, string> = {}
  const ownerCollectorMap: Record<string, string> = {}

  const chartData: ChartData = {
    buy: [],
    list: [],
  }

  for (const newEvent of prop.events) {
    const event: any = {}
    let isListedByUser =
      newEvent &&
      newEvent.nft &&
      newEvent.nft.events &&
      newEvent.nft.events.find(
        (e) => e.caller === prop.issuer && e.interaction == 'LIST'
      )

    if (!isListedByUser) {
      continue
    }

    const nftId = newEvent?.nft?.id

    event['Buyer'] = newEvent['caller']
    event['Type'] = $i18n.t('nft.event.BUY')
    event['Collection'] = newEvent.nft.collection
    event['Nft'] = newEvent.nft

    ownerCollectorMap[nftId] = newEvent['caller']
    priceCollectorMap[nftId] = newEvent['meta']

    // Amount
    const curPrice = priceCollectorMap[nftId]
    event['Amount'] = parseInt(curPrice)
      ? formatBalance(curPrice, decimals.value, unit.value)
      : '-'

    // Date
    const date = new Date(newEvent['timestamp'])
    event['Date'] = parseDate(date)

    // Time
    event['Time'] = formatDistanceToNow(date, { addSuffix: true })

    event['Block'] = String(newEvent['blockNumber'])

    // ID for table: Use a unique key of your data Object for each row.
    event['ID'] = newEvent['timestamp'] + newEvent['id']
    // Push to chart data
    chartData.buy.push([date, parseFloat(event['Amount'].substring(0, 6))])
    copyTableData.value.push(event)
  }
  copyTableData.value = copyTableData.value.reverse()
  updateDataByEvent()

  if (!data.value.length) {
    event.value = 'all'
  }

  emit('setPriceChartData', [chartData.buy, chartData.list])
}

watch(
  () => prop.events,
  () => {
    createTable()
  }
)

watch(event, () => {
  updateDataByEvent()
})
</script>
