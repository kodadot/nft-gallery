<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between mb-4">
      <NeoSelect
        v-model="selectedEvent"
        placeholder="Select an event"
        data-cy="select-event">
        <option
          v-for="option in uniqType"
          :key="option.type"
          :value="option.type">
          {{ option.value }}
        </option>
      </NeoSelect>
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
        field="Type"
        label="Type"
        class="type-table">
        {{ getEventDisplayName(props.row.Type) }}
      </NeoTableColumn>
      <NeoTableColumn
        v-if="displayItem"
        v-slot="props"
        class="short-identity__table"
        field="Item"
        label="Item">
        <nuxt-link :to="`/${urlPrefix}/gallery/${props.row.Item.id}`">
          {{ props.row.Item.name || props.row.Item.id }}
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        class="short-identity__table"
        field="From"
        label="From">
        <nuxt-link :to="`/${urlPrefix}/u/${props.row.From}`">
          <Identity :address="props.row.From" />
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        :visible="isToColumnVisible"
        class="short-identity__table"
        field="To"
        label="To">
        <nuxt-link :to="`/${urlPrefix}/u/${props.row.To}`">
          <Identity :address="props.row.To" />
        </nuxt-link>
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        class="short-identity__table"
        field="Amount"
        label="Amount">
        <div v-if="parseInt(props.row.Amount)">
          <CommonTokenMoney :value="props.row.Amount" />
        </div>
        <div v-else>-</div>
      </NeoTableColumn>
      <NeoTableColumn
        v-slot="props"
        class="short-identity__table"
        :visible="isPercentageColumnVisible"
        field="Percentage"
        label="Percentage">
        <span :class="percentageTextClassName(props.row.Percentage)">
          {{ props.row.Percentage | toPercent('-') }}
        </span>
      </NeoTableColumn>
      <NeoTableColumn v-slot="props" field="Date" label="Date">
        <NeoTooltip :label="props.row.Date" position="left">
          <BlockExplorerLink
            :block-id="props.row.Block"
            :text="props.row.Time" />
        </NeoTooltip>
      </NeoTableColumn>
    </NeoTable>
  </div>
</template>

<script lang="ts" setup>
import { Interaction } from '@kodadot1/minimark/v1'
import { formatDistanceToNow } from 'date-fns'

import { exist } from '@/utils/exist'
import { usePreferencesStore } from '@/stores/preferences'

import {
  HistoryEventType,
  InteractionBsxOnly,
  parseChartAmount,
  parseDate,
  wrapEventNameWithIcon,
} from '@/utils/historyEvent'

import { Interaction as EventInteraction } from '../service/scheme'
import {
  NeoSelect,
  NeoTable,
  NeoTableColumn,
  NeoTooltip,
} from '@kodadot1/brick'

import Identity from '@/components/identity/IdentityIndex.vue'
import Pagination from '@/components/rmrk/Gallery/Pagination.vue'
import BlockExplorerLink from '@/components/shared/BlockExplorerLink.vue'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'

type ChartData = {
  buy: any[]
  list: any[]
}
const prop = withDefaults(
  defineProps<{
    events?: EventInteraction[]
    openOnDefault?: boolean
    hideCollapse?: boolean
    displayItem?: boolean
  }>(),
  {
    events: () => [],
    openOnDefault: true,
    hideCollapse: false,
    displayItem: false,
  }
)
const emit = defineEmits(['setPriceChartData'])

const { $i18n, $consola, $route, $router } = useNuxtApp()
const { decimals } = useChain()
const { urlPrefix } = usePrefix()

const currentPage = ref(parseInt($route.query?.page) || 1)
const event = ref<HistoryEventType>(HistoryEventType.BUY)
const data = ref([])
const copyTableData = ref([])
const isOpen = ref(false)
const preferencesStore = usePreferencesStore()

onMounted(() => {
  exist($route.query.event, (val) => {
    event.value = (val as HistoryEventType) ?? HistoryEventType.ALL
  })
  isOpen.value = prop.openOnDefault
})

const total = computed(() => data.value.length)
const itemsPerPage = computed(() => preferencesStore.getHistoryItemsPerPage)
const showList = computed(() => {
  const endIndex = currentPage.value * itemsPerPage.value
  return data.value.slice(endIndex - itemsPerPage.value, endIndex)
})
const uniqType = computed(() => {
  const eventSet = new Set(copyTableData.value.map((v) => v.Type))
  const singleEventList = Array.from(eventSet).map((type) => ({
    type,
    value: getEventDisplayName(type as Interaction),
  }))
  return [{ type: HistoryEventType.ALL, value: 'All' }, ...singleEventList]
})
const isToColumnVisible = computed(() => {
  return [HistoryEventType.ALL, Interaction.BUY, Interaction.SEND].includes(
    event.value
  )
})
const isPercentageColumnVisible = computed(() => {
  return [HistoryEventType.ALL, Interaction.BUY].includes(event.value)
})
const selectedEvent = computed({
  get: () => event.value,
  set: (value: HistoryEventType) => {
    if (value) {
      currentPage.value = 1
      event.value = value
      replaceUrl(value)
    }
  },
})

const getEventDisplayName = (type: Interaction) => {
  return wrapEventNameWithIcon(type, $i18n.t(`nft.event.${type}`) as string)
}
const percentageTextClassName = (percentage: number) => {
  if (percentage > 0) {
    return 'has-text-success'
  } else if (percentage < 0) {
    return 'has-text-danger'
  }
  return ''
}
const replaceUrl = (value: string, key = 'event') => {
  if ($route.query[key] !== value) {
    $router
      .replace({
        path: String($route.path),
        query: { ...$route.query, [key]: value },
      })
      .catch($consola.warn /*Navigation Duplicate err fix later */)
  }
}
const updateDataByEvent = () => {
  console.log('Im in')
  console.log(copyTableData.value)
  // const event = event.value
  data.value =
    event.value === HistoryEventType.ALL
      ? copyTableData.value
      : [...new Set(copyTableData.value.filter((v) => v.Type === event))]
}

const pushChartData = (array, date, amount) => {
  array.push([date, parseChartAmount(amount, decimals.value)])
}

const createTable = (): void => {
  data.value = []
  copyTableData.value = []

  const chartData: ChartData = {
    buy: [],
    list: [],
  }
  const previousPriceMap = {}

  console.log(prop.events)

  for (const newEvent of prop.events) {
    console.log(newEvent)
    const event: any = {}

    const nftId = newEvent['nft'] ? newEvent['nft']['id'] : 'id'
    // Type
    switch (newEvent['interaction']) {
      case Interaction.MINTNFT:
        event['From'] = newEvent['caller']
        event['To'] = ''
        break
      case Interaction.LIST:
      case Interaction.UNLIST:
        event['Type'] = parseInt(newEvent['meta'])
          ? Interaction.LIST
          : Interaction.UNLIST
        event['From'] = newEvent['caller']
        event['To'] = ''
        event['Amount'] = newEvent['meta']
        break
      case Interaction.SEND:
        event['From'] = newEvent['caller']
        event['To'] = newEvent['meta']
        break
      case Interaction.CONSUME:
        event['From'] = newEvent['caller']
        event['To'] = ''
        break
      case Interaction.BUY:
        event['From'] = newEvent['currentOwner']
        event['To'] = newEvent['caller']
        event['Amount'] = newEvent['meta']
        if (previousPriceMap[nftId]) {
          event['Percentage'] =
            ((parseInt(newEvent['meta']) - previousPriceMap[nftId]) /
              previousPriceMap[nftId]) *
            100
        } else {
          event['Percentage'] = 100
        }
        previousPriceMap[nftId] = parseInt(newEvent['meta'])
        break
      case InteractionBsxOnly.ROYALTY:
        event['From'] = newEvent['caller']
        event['To'] = ''
        event['Percentage'] = parseInt(newEvent['meta'])
        break
      case InteractionBsxOnly.PAY_ROYALTY:
        event['From'] = newEvent['caller']
        event['To'] = ''
        event['Amount'] = newEvent['meta']
        break
      default:
        // unsupported event
        continue
    }

    event['Type'] = event['Type'] ?? newEvent['interaction']

    // Item
    if (prop.displayItem) {
      event['Item'] = newEvent['nft']
    }

    // Amount
    event['Amount'] = event['Amount'] ?? '-'

    // Date
    const date = new Date(newEvent['timestamp'])
    event['Date'] = parseDate(date)

    // Time
    event['Time'] = formatDistanceToNow(date, { addSuffix: true })

    event['Block'] = String(newEvent['blockNumber'])

    // ID for table: Use a unique key of your data Object for each row.
    event['ID'] = newEvent['timestamp'] + newEvent['id']

    // Push to chart data
    if (newEvent['interaction'] === Interaction.LIST) {
      pushChartData(chartData.list, date, event['Amount'])
    } else if (newEvent['interaction'] === Interaction.BUY) {
      pushChartData(chartData.buy, date, event['Amount'])
    }

    copyTableData.value.push(event)
  }

  copyTableData.value = copyTableData.value.reverse()
  updateDataByEvent()

  if (!data.value.length) {
    event.value = HistoryEventType.ALL
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
