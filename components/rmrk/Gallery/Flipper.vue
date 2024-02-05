<template>
  <CommonHolderTable
    :table-rows-option="flipperTableRowList"
    :group-key-option="groupKeyOption"
    open-on-default
    date-header-label="Last Activity"
    :name-header-label="nameHeaderLabel"
    sale-header-label="Sold"
    default-sort-option="Percentage"
    display-percentage
    is-flipper
    :collapse-title-option="$t('Flipper')"
    hide-collapse />
</template>

<script lang="ts" setup>
import CommonHolderTable, {
  TableRow,
} from '@/components/rmrk/Gallery/Holder/Holder.vue'
import { parseDate } from '@/utils/datetime'
import { formatDistanceToNow } from 'date-fns'
import { Interaction } from '@kodadot1/minimark/v1'

type FlipperTableRowMap = Record<string, TableRow[]>

const props = defineProps({
  events: { type: Array, default: () => [] },
  groupKeyOption: { type: String, default: 'Flipper' },
  nameHeaderLabel: { type: String, default: 'User' },
})

const flipperTableRowList = ref<TableRow[]>([])

const createTableRowListByEvents = () => {
  if (props.events.length) {
    flipperTableRowList.value = generateTableRowList()
  }
}

const generateTableRowList = (): TableRow[] => {
  const rowListMap: FlipperTableRowMap = {}

  for (const newEvent of props.events) {
    const date = new Date(newEvent['timestamp'])
    const timestamp = date.getTime()
    const dateStr = parseDate(date)
    const formatTime = formatDistanceToNow(date, { addSuffix: true })
    const block = String(newEvent['blockNumber'])
    const collectionId = newEvent['nft']['collection']['id']
    const commonInfo = {
      Date: dateStr,
      Time: formatTime,
      SortKey: timestamp,
      Timestamp: timestamp,
      Block: block,
      CollectionId: collectionId,
      Amount: 1,
    }
    const nftId = newEvent['nft'].id
    rowListMap[nftId] = rowListMap[nftId] ?? []
    if (newEvent['interaction'] === Interaction.MINTNFT) {
      rowListMap[nftId].push({
        Item: newEvent['nft'],
        Flipper: newEvent['caller'],
        Bought: 0,
        Sale: 0,
        ...commonInfo,
      })
    } else if (newEvent['interaction'] === Interaction.LIST) {
      rowListMap[nftId] = rowListMap[nftId] ?? []
      // for saving Last Activity
      rowListMap[nftId].push({
        Item: newEvent['nft'],
        Flipper: newEvent['caller'],
        Bought: 0,
        Sale: 0,
        ...commonInfo,
      })
    } else if (newEvent['interaction'] === Interaction.SEND) {
      rowListMap[nftId] = rowListMap[nftId] ?? []
      rowListMap[nftId].push(
        {
          Item: newEvent['nft'],
          Flipper: newEvent['caller'],
          Bought: 0,
          Sale: 0,
          ...commonInfo,
        },
        {
          Item: newEvent['nft'],
          Flipper: newEvent['meta'],
          Bought: 0,
          Sale: 0,
          ...commonInfo,
        },
      )
    } else if (newEvent['interaction'] === Interaction.BUY) {
      const price = parseInt(newEvent['meta'])

      rowListMap[nftId] = rowListMap[nftId] ?? []
      rowListMap[nftId].push(
        {
          Item: newEvent['nft'],
          Flipper: newEvent['caller'],
          Bought: price,
          Sale: 0,
          ...commonInfo,
        },
        {
          Item: newEvent['nft'],
          Flipper: newEvent['currentOwner'],
          Bought: 0,
          Sale: price,
          ...commonInfo,
        },
      )
    }
  }

  const itemRowMap: Record<string, Record<string, TableRow>> = {}
  for (const nftId in rowListMap) {
    rowListMap[nftId].forEach((row) => {
      const flipper = row['Flipper']
      if (flipper) {
        itemRowMap[flipper] = itemRowMap[flipper] ?? {}
        const flipperRow = itemRowMap[flipper]

        if (flipperRow[nftId]) {
          flipperRow[nftId]['Bought'] = flipperRow[nftId]['Bought'] ?? 0
          flipperRow[nftId]['Sale'] = flipperRow[nftId]['Sale'] ?? 0
          row['Bought'] = row['Bought'] ?? 0
          row['Sale'] = row['Sale'] ?? 0

          flipperRow[nftId]['Bought'] =
            (flipperRow[nftId]['Bought'] ?? 0) + row['Bought']
          flipperRow[nftId]['Sale'] =
            (flipperRow[nftId]['Sale'] ?? 0) + row['Sale']
        } else {
          flipperRow[nftId] = row
        }
      }
    })
  }

  const nftRowList: TableRow[] = []
  for (const flipper in itemRowMap) {
    nftRowList.push(...Object.values(itemRowMap[flipper]))
  }
  return nftRowList
}

watch(
  () => props.events,
  () => {
    if (props.events) {
      createTableRowListByEvents()
    }
  },
)
</script>
