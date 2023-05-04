<template>
  <div class="block">
    <b-collapse
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
            <NeoIcon :icon="props.open ? 'chevron-up' : 'chevron-down'">
            </NeoIcon>
          </a>
        </div>
      </template>
      <div class="box">
        <div class="is-flex is-justify-content-space-between box-container">
          <b-field grouped group-multiline>
            <div class="control">
              <b-checkbox v-model="showDetailIcon">NFT Details</b-checkbox>
            </div>
            <div
              v-for="(column, index) in columnsVisible"
              :key="index"
              class="control">
              <b-checkbox v-model="column.display">
                {{ column.title }}
              </b-checkbox>
            </div>
          </b-field>
        </div>
        <b-table
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
          :current-page.sync="currentPage"
          :default-sort="[defaultSortOption, 'desc']">
          <b-table-column
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
          </b-table-column>
          <b-table-column
            v-slot="props"
            :visible="columnsVisible['Amount'].display"
            numeric
            field="Amount"
            label="Amount"
            sortable>
            {{ props.row.Amount }}
          </b-table-column>
          <b-table-column
            v-slot="props"
            :visible="columnsVisible['Bought'].display"
            field="Bought"
            label="Bought"
            sortable>
            {{ props.row.BoughtFormatted }}
          </b-table-column>
          <b-table-column
            v-slot="props"
            :visible="columnsVisible['Sale'].display"
            field="Sale"
            :label="saleHeaderLabel"
            sortable>
            {{ props.row.SaleFormatted }}
          </b-table-column>
          <b-table-column
            v-if="displayPercentage"
            v-slot="props"
            :visible="columnsVisible['Percentage'].display"
            field="Percentage"
            label="Percentage"
            sortable>
            <span :class="percentageTextClassName(props.row.Percentage)">
              {{ props.row.Percentage | toPercent('-') }}
            </span>
          </b-table-column>
          <b-table-column
            v-slot="props"
            :visible="columnsVisible['Date'].display"
            field="Timestamp"
            :label="dateHeaderLabel"
            sortable>
            <b-tooltip :label="props.row.Date" position="is-right">
              <BlockExplorerLink
                :text="props.row.Time"
                :block-id="props.row.Block" />
            </b-tooltip>
          </b-table-column>
          <template slot="detail" slot-scope="props">
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
                {{ item.Percentage | toPercent('-') }}
              </td>
              <td v-show="columnsVisible['Date'].display">
                <b-tooltip :label="item.Date" position="is-right">
                  <BlockExplorerLink :text="item.Time" :block-id="item.Block" />
                </b-tooltip>
              </td>
            </tr>
          </template>
        </b-table>
      </div>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { Interaction } from '@kodadot1/minimark/v1'
import { formatDistanceToNow } from 'date-fns'

import ChainMixin from '@/utils/mixins/chainMixin'
import KeyboardEventsMixin from '@/utils/mixins/keyboardEventsMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'

import { parseDate, parsePriceForItem } from './helper'
import { Interaction as EventInteraction } from '../../service/scheme'
import { usePreferencesStore } from '@/stores/preferences'
import { NeoIcon } from '@kodadot1/brick'

const components = {
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
  BlockExplorerLink: () => import('@/components/shared/BlockExplorerLink.vue'),
  NeoIcon,
}

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

@Component({
  components,
})
export default class CommonHolderTable extends mixins(
  PrefixMixin,
  ChainMixin,
  KeyboardEventsMixin
) {
  @Prop({ type: Array }) public events!: NftHolderEvent[]
  @Prop({ type: Array }) public tableRowsOption!: TableRow[]
  @Prop({ type: Boolean, default: false }) hideCollapse!: boolean
  @Prop({ type: String, default: '' }) groupKeyOption!: string
  @Prop({ type: String, default: 'Name' }) nameHeaderLabel!: string
  @Prop({ type: String, default: 'Date' }) dateHeaderLabel!: string
  @Prop({ type: String, default: 'Sale' }) saleHeaderLabel!: string
  @Prop({ type: String, default: '' }) collapseTitleOption!: string
  @Prop({ type: String, default: 'Amount' }) defaultSortOption!: string
  @Prop({ type: Boolean, default: false }) displayPercentage!: boolean
  @Prop({ type: Boolean, default: false }) isFlipper!: boolean

  private readonly openOnDefault!: boolean
  private currentPage = parseInt(this.$route.query?.page as string) || 1
  private customGroups: TableRow[] = []
  private columnsVisible = {
    Name: { title: 'Name', display: true },
    Amount: { title: 'Amount', display: true },
    Bought: { title: 'Bought', display: true },
    Sale: { title: 'Sale', display: true },
    Percentage: { title: 'Percentage', display: true },
    Date: { title: 'Date', display: true },
  }
  public isOpen = false
  private showDetailIcon = true
  private preferencesStore = usePreferencesStore()

  public async created() {
    this.initKeyboardEventHandler({
      e: this.bindExpandEvents,
      g: this.bindPaginationEvents,
    })
    this.initColumnVisibleConfig()
  }

  private initColumnVisibleConfig() {
    this.columnsVisible['Name'].title = this.nameHeaderLabel
    this.columnsVisible['Date'].title = this.dateHeaderLabel
    this.columnsVisible['Sale'].title = this.saleHeaderLabel
  }

  private bindPaginationEvents(event) {
    switch (event.key) {
      case 'n':
        if (this.currentPage < Math.ceil(this.total / this.itemsPerPage)) {
          this.currentPage = this.currentPage + 1
        }
        break
      case 'p':
        if (this.currentPage > 1) {
          this.currentPage = this.currentPage - 1
        }
        break
    }
  }

  public mounted() {
    this.isOpen = this.openOnDefault
  }

  private bindExpandEvents(event) {
    if (event.key === 'h') {
      this.isOpen = !this.isOpen
    }
  }

  get total(): number {
    return this.customGroups.length
  }

  get itemsPerPage(): number {
    return this.preferencesStore.getHistoryItemsPerPage
  }

  get showList(): TableRow[] {
    return this.customGroups
  }

  get groupKey() {
    return this.groupKeyOption || 'Holder'
  }

  private percentageTextClassName(percentage: number) {
    if (percentage >= 100) {
      return 'has-text-success'
    } else if (percentage > 0) {
      return 'has-text-danger'
    }
    return ''
  }

  protected createTable(): void {
    const NFTList = this.generateNFTList()
    this.customGroups = this.generateCustomGroups(NFTList)
  }

  protected createTableByTableRow(): void {
    this.customGroups = this.generateCustomGroups(this.tableRowsOption)
  }

  private generateNFTList(): TableRow[] {
    const itemRowMap: Record<string, TableRow> = {}

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

  private getGroupNameFromRow(item: TableRow): string {
    let groupName
    switch (this.groupKey) {
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

  private getCustomRowFilter(): (item: TableRow) => boolean {
    switch (this.groupKey) {
      case 'Holder':
        return (item) => item.Holder !== '-'
      case 'CollectionId':
        if (this.isFlipper) {
          return (item) => item.Flipper === this.$route.params.id
        }
        return (item) => item.Holder === this.$route.params.id
      default:
        return () => true
    }
  }

  private getCustomId(item: TableRow): string {
    let customId
    switch (this.groupKey) {
      case 'Flipper':
        customId = item['Flipper']
        break
      case 'Holder':
      case 'CollectionId':
        customId = item['CollectionId'] + item['Item']['id']
    }
    return customId || item['Timestamp']
  }

  private generateCustomGroups(itemRowList: TableRow[]): TableRow[] {
    const customGroups: Record<string, TableRow> = {}
    itemRowList.filter(this.getCustomRowFilter()).forEach((item: TableRow) => {
      item = {
        ...item,
        Bought: item.Bought ?? 0,
        Sale: item.Sale ?? 0,
      } as TableRow

      const groupName = this.getGroupNameFromRow(item)
      if (customGroups[groupName]) {
        customGroups[groupName].Items?.push(item)
        customGroups[groupName].Bought =
          (customGroups[groupName]['Bought'] ?? 0) + (item['Bought'] ?? 0)
        customGroups[groupName]['Sale'] =
          (customGroups[groupName]['Sale'] ?? 0) + (item['Sale'] ?? 0)
      } else {
        customGroups[groupName] = {
          ...item,
          Id: this.getCustomId(item),
          Items: [item],
        }
      }
    })

    const customGroupsList = Object.values(customGroups)

    customGroupsList.forEach((group) => {
      parsePriceForItem(group, this.decimals, this.unit)
      if (!group['Items']) {
        return
      }
      let groupItems: TableRow[] = group['Items']
      group['Amount'] = groupItems.length
      groupItems.forEach((item) => {
        parsePriceForItem(item, this.decimals, this.unit)
      })
      group['Items'] = groupItems.sort(
        (a, b) => (b.SortKey ?? 0) - (a.SortKey ?? 0)
      )
      group['Percentage'] = group['Percentage'] / group['Amount']
    })
    return customGroupsList
  }

  @Watch('events', { immediate: true })
  public watchEvent(): void {
    if (this.events) {
      this.createTable()
    }
  }
  @Watch('tableRowsOption', { immediate: true })
  public watchTableRows(): void {
    if (this.tableRowsOption) {
      this.createTableByTableRow()
    }
  }

  @Watch('currentPage')
  watchPageValue(val) {
    this.replaceUrl(String(val))
  }

  @Debounce(100)
  replaceUrl(value: string, key = 'page') {
    this.$router
      .replace({
        path: String(this.$route.path),
        query: { ...this.$route.query, [key]: value },
      })
      .catch(this.$consola.warn /*Navigation Duplicate err fix later */)
  }
}
</script>
