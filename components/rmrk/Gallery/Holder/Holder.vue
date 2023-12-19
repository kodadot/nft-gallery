<template>
  <div class="block">
    <NeoCollapse
      :open="isOpen"
      class="card"
      :class="hideCollapse ? 'collapseHidden' : 'bordered'"
      animation="slide"
      aria-id="contentIdForHistory">
      <template #trigger="props">
        <div
          class="card-header"
          role="button"
          aria-controls="contentIdForHistory">
          <p class="card-header-title">
            {{ collapseTitleOption || $t('holders') }}
          </p>
          <a class="card-header-icon">
            <NeoIcon :icon="props.open ? 'chevron-up' : 'chevron-down'" />
          </a>
        </div>
      </template>
      <div class="flex justify-between box-container">
        <NeoField grouped group-multiline>
          <div class="control">
            <NeoCheckbox v-model="showDetailIcon">NFT Details</NeoCheckbox>
          </div>
          <div
            v-for="(column, index) in columnsVisible"
            :key="index"
            class="control">
            <NeoCheckbox v-model="column.display">
              {{ column.title }}
            </NeoCheckbox>
          </div>
        </NeoField>
      </div>
      <NeoTable
        v-model:current-page="currentPage"
        :data="showList"
        class="mb-4"
        hoverable
        custom-row-key="Id"
        :show-detail-icon="showDetailIcon"
        :detail-key="groupKey"
        custom-detail-row
        detailed
        paginated
        :per-page="itemsPerPage"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
        :default-sort="[defaultSortOption, 'desc']">
        <NeoTableColumn
          v-slot="props"
          :visible="columnsVisible['Name'].display"
          :field="groupKey"
          cell-class="short-name-column"
          :label="nameHeaderLabel">
          <nuxt-link
            v-if="groupKey === 'Holder' || groupKey === 'Flipper'"
            :to="`/${urlPrefix}/u/${props.row[groupKey]}?tab=${
              groupKey === 'Holder' ? 'holdings' : 'gains'
            }`">
            <Identity :address="props.row[groupKey]" />
          </nuxt-link>
          <nuxt-link
            v-else
            :to="`/${urlPrefix}/collection/${props.row.CollectionId}`">
            <Identity
              :address="props.row.Item.collection.issuer"
              :custom-name-option="props.row.Item.collection.name" />
          </nuxt-link>
        </NeoTableColumn>
        <NeoTableColumn
          v-slot="props"
          :visible="columnsVisible['Amount'].display"
          numeric
          field="Amount"
          label="Amount"
          sortable>
          {{ props.row.Amount }}
        </NeoTableColumn>
        <NeoTableColumn
          v-slot="props"
          :visible="columnsVisible['Bought'].display"
          field="Bought"
          label="Bought"
          sortable>
          {{ props.row.BoughtFormatted }}
        </NeoTableColumn>
        <NeoTableColumn
          v-slot="props"
          :visible="columnsVisible['Sale'].display"
          field="Sale"
          :label="saleHeaderLabel"
          sortable>
          {{ props.row.SaleFormatted }}
        </NeoTableColumn>
        <NeoTableColumn
          v-if="displayPercentage"
          v-slot="props"
          :visible="columnsVisible['Percentage'].display"
          field="Percentage"
          label="Percentage"
          sortable>
          <span :class="percentageTextClassName(props.row.Percentage)">
            {{ toPercent(props.row.Percentage, '-') }}
          </span>
        </NeoTableColumn>
        <NeoTableColumn
          v-slot="props"
          :visible="columnsVisible['Date'].display"
          field="Timestamp"
          :label="dateHeaderLabel"
          sortable>
          <NeoTooltip :label="props.row.Date" position="left">
            <BlockExplorerLink
              :text="props.row.Time"
              :block-id="props.row.Block" />
          </NeoTooltip>
        </NeoTableColumn>
        <template #detail="props">
          <tr v-for="item in props.row.Items" :key="item.Item.id">
            <td v-if="showDetailIcon"></td>
            <td
              v-show="columnsVisible['Name'].display"
              class="short-name-column">
              <nuxt-link :to="`/${urlPrefix}/gallery/${item.Item.id}`">
                {{ item.Item.name || item.Item.id }}
              </nuxt-link>
            </td>
            <td
              v-show="columnsVisible['Amount'].display"
              class="has-text-right">
              {{ item.Amount }}
            </td>
            <td v-show="columnsVisible['Bought'].display">
              {{ item.BoughtFormatted }}
            </td>
            <td v-show="columnsVisible['Sale'].display">
              {{ item.SaleFormatted }}
            </td>
            <td
              v-if="displayPercentage"
              v-show="columnsVisible['Percentage'].display"
              :class="percentageTextClassName(item.Percentage)">
              {{ toPercent(item.Percentage, '-') }}
            </td>
            <td v-show="columnsVisible['Date'].display">
              <NeoTooltip :label="item.Date" position="left">
                <BlockExplorerLink :text="item.Time" :block-id="item.Block" />
              </NeoTooltip>
            </td>
          </tr>
        </template>
      </NeoTable>
    </NeoCollapse>
  </div>
</template>

<script lang="ts" setup>
import { Interaction } from '@kodadot1/minimark/v1'
import { formatDistanceToNow } from 'date-fns'
import { toPercent } from '@/utils/filters'
import { parseDate, parsePriceForItem } from './helper'
import { Interaction as EventInteraction } from '../../service/scheme'
import { usePreferencesStore } from '@/stores/preferences'
import {
  NeoCheckbox,
  NeoCollapse,
  NeoField,
  NeoIcon,
  NeoTable,
  NeoTableColumn,
  NeoTooltip,
} from '@kodadot1/brick'

import Identity from '@/components/identity/IdentityIndex.vue'
import BlockExplorerLink from '@/components/shared/BlockExplorerLink.vue'

export type NftHolderEvent = {
  nft: {
    id: string
    name: string
    collection: {
      id: string
    }
  }
} & EventInteraction

type NFTItem = {
  id: string
  name: string
}

export type TableRow = {
  Holder?: string
  Flipper?: string
  Bought?: number
  BoughtFormatted?: string
  Sale?: number
  SaleFormatted?: string
  Id?: string
  SortKey?: number
  Amount: number
  Items?: TableRow[]
  Item: NFTItem
} & BaseTableRow

type BaseTableRow = {
  Date: string
  Time: string
  Timestamp: number
  Block: string
  CollectionId: string
  Amount: number
}

const prop = withDefaults(
  defineProps<{
    events?: NftHolderEvent[]
    tableRowsOption?: TableRow[]
    hideCollapse?: boolean
    groupKeyOption: string
    nameHeaderLabel: string
    dateHeaderLabel: string
    saleHeaderLabel: string
    collapseTitleOption: string
    defaultSortOption: string
    displayPercentage?: boolean
    isFlipper?: boolean
  }>(),
  {
    events: () => [],
    tableRowsOption: () => [],
    hideCollapse: false,
    groupKeyOption: '',
    nameHeaderLabel: 'Name',
    dateHeaderLabel: 'Date',
    saleHeaderLabel: 'Sale',
    collapseTitleOption: '',
    defaultSortOption: 'Amount',
    displayPercentage: false,
    isFlipper: false,
  },
)

const route = useRoute()
const preferencesStore = usePreferencesStore()
const { decimals, unit } = useChain()
const { urlPrefix } = usePrefix()
const { replaceUrl } = useReplaceUrl()

const isOpen = ref(false)
const showDetailIcon = ref(true)
const currentPage = ref(parseInt(route.query?.page) || 1)
const customGroups = ref<TableRow[]>([])
const columnsVisible = ref({
  Name: { title: 'Name', display: true },
  Amount: { title: 'Amount', display: true },
  Bought: { title: 'Bought', display: true },
  Sale: { title: 'Sale', display: true },
  Percentage: { title: 'Percentage', display: true },
  Date: { title: 'Date', display: true },
})

const itemsPerPage = computed(() => preferencesStore.getHistoryItemsPerPage)
const showList = computed(() => customGroups.value)
const groupKey = computed(() => prop.groupKeyOption || 'Holder')

const percentageTextClassName = (percentage: number) => {
  if (percentage > 0) {
    return 'has-text-success'
  } else if (percentage < 0) {
    return 'has-text-danger'
  }
  return ''
}

const createTable = () => {
  const NFTList = generateNFTList()
  customGroups.value = generateCustomGroups(NFTList)
}

const createTableByTableRow = () => {
  customGroups.value = generateCustomGroups(prop.tableRowsOption)
}

const generateNFTList = (): TableRow[] => {
  const itemRowMap: Record<string, TableRow> = {}

  for (const newEvent of prop.events) {
    const date = new Date(newEvent['timestamp'])
    const timestamp = date.getTime()
    const dateStr = parseDate(date)
    const formatTime = formatDistanceToNow(date, { addSuffix: true })
    const block = String(newEvent['blockNumber'])
    const collectionId = newEvent['nft']['collection']['id']
    const commonInfo = {
      Date: dateStr,
      Time: formatTime,
      Timestamp: timestamp,
      Block: block,
      CollectionId: collectionId,
      Amount: 1,
    }
    const nftId = newEvent['nft'].id
    if (newEvent['interaction'] === Interaction.MINTNFT) {
      if (!itemRowMap[nftId]) {
        itemRowMap[nftId] = {
          Item: newEvent['nft'],
          Holder: newEvent['caller'],
          SortKey: timestamp,
          Bought: 0,
          Sale: 0,
          ...commonInfo,
        }
      }
    } else if (newEvent['interaction'] === Interaction.LIST) {
      const listPrice = parseInt(newEvent['meta'])
      if (itemRowMap[nftId]) {
        if (!('Sale' in itemRowMap[nftId])) {
          itemRowMap[nftId]['Sale'] = listPrice
        }
      } else {
        itemRowMap[nftId] = {
          Item: newEvent['nft'],
          Holder: newEvent['caller'],
          Sale: listPrice,
          ...commonInfo,
        }
      }
    } else if (newEvent['interaction'] === Interaction.SEND) {
      if (itemRowMap[nftId]) {
        if (!('Bought' in itemRowMap[nftId])) {
          itemRowMap[nftId]['Bought'] = 0
          itemRowMap[nftId]['SortKey'] = timestamp
        }
      } else {
        itemRowMap[nftId] = {
          Item: newEvent['nft'],
          Holder: newEvent['meta'],
          SortKey: timestamp,
          Bought: 0,
          Sale: 0,
          ...commonInfo,
        }
      }
    } else if (newEvent['interaction'] === Interaction.CONSUME) {
      if (!itemRowMap[nftId]) {
        itemRowMap[nftId] = {
          Item: newEvent['nft'],
          Holder: '-',
          Bought: 0,
          Sale: 0,
          ...commonInfo,
        }
      }
    } else if (newEvent['interaction'] === Interaction.BUY) {
      const bought = parseInt(newEvent['meta'])
      if (itemRowMap[nftId]) {
        if (!('Bought' in itemRowMap[nftId])) {
          itemRowMap[nftId]['Bought'] = bought
          itemRowMap[nftId]['SortKey'] = timestamp
        }
      } else {
        itemRowMap[nftId] = {
          Item: newEvent['nft'],
          Holder: newEvent['caller'],
          SortKey: timestamp,
          Bought: bought,
          Sale: 0,
          ...commonInfo,
        }
      }
    }
  }
  return Object.values(itemRowMap)
}

const getGroupNameFromRow = (item: TableRow): string => {
  let groupName
  switch (groupKey.value) {
    case 'Holder':
      groupName = item['Holder']
      break
    case 'CollectionId':
      groupName = item['Item']['collection']['id']
      break
    case 'Flipper':
      groupName = item['Flipper']
      break
  }
  return groupName || item['Holder']
}

const getCustomRowFilter = (): ((item: TableRow) => boolean) => {
  switch (groupKey.value) {
    case 'Holder':
      return (item) => item.Holder !== '-'
    case 'CollectionId':
      if (prop.isFlipper) {
        return (item) => item.Flipper === route.params.id
      }
      return (item) => item.Holder === route.params.id
    default:
      return () => true
  }
}

const getCustomId = (item: TableRow): string => {
  let customId
  switch (groupKey.value) {
    case 'Flipper':
      customId = item['Flipper']
      break
    case 'Holder':
    case 'CollectionId':
      customId = item['CollectionId'] + item['Item']['id']
  }
  return customId || item['Timestamp']
}

const generateCustomGroups = (itemRowList: TableRow[]): TableRow[] => {
  const customGroups: Record<string, TableRow> = {}
  itemRowList.filter(getCustomRowFilter()).forEach((item: TableRow) => {
    item = {
      ...item,
      Bought: item.Bought ?? 0,
      Sale: item.Sale ?? 0,
    } as TableRow

    const groupName = getGroupNameFromRow(item)
    if (customGroups[groupName]) {
      customGroups[groupName].Items?.push(item)
      customGroups[groupName].Bought =
        (customGroups[groupName]['Bought'] ?? 0) + (item['Bought'] ?? 0)
      customGroups[groupName]['Sale'] =
        (customGroups[groupName]['Sale'] ?? 0) + (item['Sale'] ?? 0)
    } else {
      customGroups[groupName] = {
        ...item,
        Id: getCustomId(item),
        Items: [item],
      }
    }
  })

  const customGroupsList = Object.values(customGroups)

  customGroupsList.forEach((group) => {
    parsePriceForItem(group, decimals.value, unit.value)
    if (!group['Items']) {
      return
    }
    let groupItems: TableRow[] = group['Items']
    group['Amount'] = groupItems.length
    groupItems.forEach((item) => {
      parsePriceForItem(item, decimals.value, unit.value)
    })
    group['Items'] = groupItems.sort(
      (a, b) => (b.SortKey ?? 0) - (a.SortKey ?? 0),
    )
    group['Percentage'] = group['Percentage'] / group['Amount']
  })
  return customGroupsList
}

watch(() => prop.events, createTable)

watch(() => prop.tableRowsOption, createTableByTableRow)

watch(currentPage, (val) => replaceUrl({ page: String(val) }))
</script>
