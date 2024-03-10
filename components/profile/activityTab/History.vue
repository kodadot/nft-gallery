<template>
  <div ref="container" class="block">
    <slot
      name="header"
      :current-page="currentPage"
      :total="total"
      :per-page="itemsPerPage"
      :desktop="desktop"
      :update-current-page="updateCurrentPage" />

    <div v-if="!desktop" class="flex justify-end my-5">
      <Pagination
        :value="currentPage"
        :total="total"
        :per-page="itemsPerPage"
        :range-before="2"
        :range-after="2"
        replace
        enable-listen-keyboard-event
        preserve-scroll />
    </div>

    <div
      :class="{
        'mt-4': desktop,
      }">
      <ResponsiveTable
        :no-results-main="$t('activity.noResults')"
        :no-results-sub="$t('activity.noResultsSub')"
        :items="showList"
        :show-no-results="!showList.length">
        <template #columns>
          <div class="flex-1">
            <span>{{ $t('activity.event.item') }}</span>
          </div>
          <div class="w-1/12">
            <span>{{ $t('activity.event.event') }}</span>
          </div>
          <div class="flex-1">
            <span>{{ $t('activity.event.amount') }}</span>
          </div>
          <div class="flex-1">
            <span>{{ $t('activity.event.from') }}</span>
          </div>
          <div v-if="isToColumnVisible" class="flex-1">
            <span>{{ $t('activity.event.to') }}</span>
          </div>
          <div class="flex-1">
            <span>{{ $t('activity.event.time') }}</span>
          </div>
        </template>

        <template #rows="{ variant }">
          <HistoryRow
            v-for="item in showList"
            :key="item.ID"
            data-testid="history-item-row"
            :event="item"
            :variant="variant"
            :with-to-column="isToColumnVisible" />
        </template>
      </ResponsiveTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Interaction } from '@kodadot1/minimark/v1'
import { formatDistanceToNow } from 'date-fns'

import { exist } from '@/utils/exist'
import { usePreferencesStore } from '@/stores/preferences'

import { HistoryEventType, InteractionBsxOnly } from '@/utils/historyEvent'
import { parseDate } from '@/utils/datetime'

import { Interaction as EventInteraction } from '@/components/rmrk/service/scheme'
import ResponsiveTable from '@/components/shared/ResponsiveTable.vue'
import Pagination from '@/components/rmrk/Gallery/Pagination.vue'
import HistoryRow from './HistoryRow.vue'
import { emptyObject } from '@/utils/empty'

const prop = withDefaults(
  defineProps<{
    events?: EventInteraction[]
    openOnDefault?: boolean
    hideCollapse?: boolean
    displayItem?: boolean
    id: string
  }>(),
  {
    events: () => [],
    openOnDefault: true,
    hideCollapse: false,
    displayItem: false,
  },
)

const route = useRoute()

const container = ref<HTMLDivElement | null>(null)
const { desktop } = useResponsive(container)

const currentPage = ref(parseInt(route.query?.page) || 1)
const event = ref<HistoryEventType>(HistoryEventType.BUY)
const data = ref<Event[]>([])
const copyTableData = ref([])
const isOpen = ref(false)
const preferencesStore = usePreferencesStore()

onMounted(() => {
  exist(route.query.event, (val) => {
    event.value = (val as HistoryEventType) ?? HistoryEventType.ALL
  })
  isOpen.value = prop.openOnDefault
})

const updateCurrentPage = (value) => {
  currentPage.value = value
}

const total = computed(() => data.value.length)
const itemsPerPage = computed(() => preferencesStore.getHistoryItemsPerPage)
const showList = computed(() => {
  const endIndex = currentPage.value * itemsPerPage.value
  return data.value.slice(endIndex - itemsPerPage.value, endIndex)
})

const isToColumnVisible = computed(() => {
  return [HistoryEventType.ALL, Interaction.BUY, Interaction.SEND].includes(
    event.value,
  )
})

const updateDataByEvent = () => {
  data.value =
    event.value === HistoryEventType.ALL
      ? copyTableData.value
      : [...new Set(copyTableData.value.filter((v) => v.Type === event))]
}

export interface Event {
  ID: string
  Type: string
  From: string
  To: string
  Amount: string
  Date: string
  Time: string
  Block: string
  Item?: any
  Percentage?: number
}

const createTable = (): void => {
  data.value = []
  copyTableData.value = []

  const previousPriceMap = {}

  for (const newEvent of prop.events) {
    const event = emptyObject<Event>()

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
        if (newEvent['caller'] !== prop.id) {
          event['Type'] = 'SELL'
        }
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

    copyTableData.value.push(event)
  }

  copyTableData.value = copyTableData.value.reverse()
  updateDataByEvent()

  if (!data.value.length) {
    event.value = HistoryEventType.ALL
  }
}

watch(() => prop.events, createTable)

watch(event, updateDataByEvent)

watch(
  () => route.query?.page,
  (newPage) => {
    currentPage.value = parseInt(newPage as string) || 1
  },
)
</script>
