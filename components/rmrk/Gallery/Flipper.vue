<template>
  <CommonHolderTable
    :tableRowsOption="flipperTableRowList"
    groupKeyOption="Flipper"
    openOnDefault
    dateHeaderLabel="Last Activity"
    nameHeaderLabel="User"
    saleHeaderLabel="Sold"
    :collapseTitleOption="$t('Flipper')"
    hideCollapse />
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'nuxt-property-decorator'
import { Interaction } from '../service/scheme'
import { TableRow } from '@/components/rmrk/Gallery/Holder/Holder.vue'
import { parseDate } from '@/components/rmrk/Gallery/Holder/helper'
import { formatDistanceToNow } from 'date-fns'

const components = {
  CommonHolderTable: () =>
    import('@/components/rmrk/Gallery/Holder/Holder.vue'),
}

type FlipperTableRowMap = Record<string, TableRow[]>

@Component({ components })
export default class Flipper extends Vue {
  @Prop({ type: Array }) events!: Interaction[]
  private flipperTableRowList: TableRow[] = []

  createTableRowListByEvents() {
    if (this.events.length) {
      this.flipperTableRowList = this.generateTableRowList()
    }
  }

  private generateTableRowList(): TableRow[] {
    const rowListMap: FlipperTableRowMap = {}

    for (const newEvent of this.events) {
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
      if (newEvent['interaction'] === 'MINTNFT') {
        rowListMap[nftId].push({
          Item: newEvent['nft'],
          Flipper: newEvent['caller'],
          Bought: 0,
          Sale: 0,
          ...commonInfo,
        })
      } else if (newEvent['interaction'] === 'LIST') {
        const listPrice = parseInt(newEvent['meta'])

        rowListMap[nftId] = rowListMap[nftId] ?? []
        const len = rowListMap[nftId].length
        if (len && rowListMap[nftId][len - 1]['Bought']) {
          rowListMap[nftId].push({
            Item: newEvent['nft'],
            Flipper: newEvent['caller'],
            Bought: 0,
            Sale: listPrice,
            ...commonInfo,
          })
        }
      } else if (newEvent['interaction'] === 'SEND') {
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
          }
        )
      } else if (newEvent['interaction'] === 'BUY') {
        const bought = parseInt(newEvent['meta'])

        rowListMap[nftId] = rowListMap[nftId] ?? []
        rowListMap[nftId].push({
          Item: newEvent['nft'],
          Flipper: newEvent['caller'],
          Bought: bought,
          Sale: 0,
          ...commonInfo,
        })
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

  @Watch('events', { immediate: true })
  public watchEvent(): void {
    if (this.events) {
      this.createTableRowListByEvents()
    }
  }
}
</script>
