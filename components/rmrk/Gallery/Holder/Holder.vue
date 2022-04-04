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
            {{ collapseTitleOption || $t('Holders') }}
          </p>
          <a class="card-header-icon">
            <b-icon :icon="props.open ? 'chevron-up' : 'chevron-down'">
            </b-icon>
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
          :default-sort="['Amount', 'desc']">
          <b-table-column
            :visible="columnsVisible['Name'].display"
            :field="groupKey"
            :label="nameHeaderLabel"
            v-slot="props">
            <nuxt-link
              v-if="groupKey === 'Holder'"
              :to="{ name: 'rmrk-u-id', params: { id: props.row.Holder } }">
              <Identity :address="props.row.Holder" inline noOverflow />
            </nuxt-link>
            <nuxt-link
              v-else-if="groupKey === 'CollectionId'"
              :to="{
                name: 'rmrk-collection-id',
                params: { id: props.row.CollectionId },
              }">
              {{ props.row.Item.collection.name }}
            </nuxt-link>
          </b-table-column>
          <b-table-column
            :visible="columnsVisible['Amount'].display"
            numeric
            field="Amount"
            label="Amount"
            sortable
            v-slot="props">
            {{ props.row.Amount }}
          </b-table-column>
          <b-table-column
            :visible="columnsVisible['Bought'].display"
            field="Bought"
            label="Bought"
            sortable
            v-slot="props">
            {{ props.row.BoughtFormatted }}
          </b-table-column>
          <b-table-column
            :visible="columnsVisible['Sale'].display"
            field="Sale"
            label="Sale"
            sortable
            v-slot="props">
            {{ props.row.SaleFormatted }}
          </b-table-column>
          <b-table-column
            :visible="columnsVisible['Date'].display"
            field="Timestamp"
            :label="dateHeaderLabel"
            sortable
            v-slot="props">
            <b-tooltip
              :label="props.row.Date"
              position="is-right"
              append-to-body>
              <a
                target="_blank"
                rel="noopener noreferrer"
                :href="getBlockUrl(props.row.Block)">
                {{ props.row.Time }}</a
              >
            </b-tooltip>
          </b-table-column>
          <template slot="detail" slot-scope="props">
            <tr v-for="item in props.row.Items" :key="item.Item.id">
              <td v-if="showDetailIcon"></td>
              <td v-show="columnsVisible['Name'].display">
                <nuxt-link
                  :to="{
                    name: 'rmrk-gallery-id',
                    params: { id: item.Item.id },
                  }">
                  {{ item.Item.name }}
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
              <td v-show="columnsVisible['Date'].display">
                <b-tooltip
                  :label="item.Date"
                  position="is-right"
                  append-to-body>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    :href="getBlockUrl(item.Block)">
                    {{ item.Time }}</a
                  >
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
import { urlBuilderBlockNumber } from '@/utils/explorerGuide'
import ChainMixin from '@/utils/mixins/chainMixin'
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { Interaction } from '../../service/scheme'
import KeyboardEventsMixin from '~/utils/mixins/keyboardEventsMixin'
import { formatDistanceToNow } from 'date-fns'
import { parsePriceForItem, parseDate } from './helper'
import { Debounce } from 'vue-debounce-decorator'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
}

type NFTItem = {
  id: string
  name: string
}

type TableRow = {
  Holder: string
  Bought: number
  BoughtFormatted?: string
  Sale: string
  SaleFormatted?: string
  Date: string
  Time: string
  Id: string
  SortKey: number
  Block: string
  Amount: number
  Items?: TableRow[]
  Item: NFTItem
}

@Component({ components })
export default class Holder extends mixins(ChainMixin, KeyboardEventsMixin) {
  @Prop({ type: Array }) public events!: Interaction[]
  @Prop({ type: Boolean, default: false }) hideCollapse!: boolean
  @Prop({ type: String, default: '' }) groupKeyOption!: string
  @Prop({ type: String, default: 'Name' }) nameHeaderLabel!: string
  @Prop({ type: String, default: 'Date' }) dateHeaderLabel!: string
  @Prop({ type: String, default: '' }) collapseTitleOption!: string

  private readonly openOnDefault!: boolean
  private currentPage = parseInt(this.$route.query?.page as string) || 1
  private customGroups: TableRow[] = []
  private columnsVisible = {
    Name: { title: 'Name', display: true },
    Amount: { title: 'Amount', display: true },
    Bought: { title: 'Bought', display: true },
    Sale: { title: 'Sale', display: true },
    Date: { title: 'Date', display: true },
  }
  public isOpen = false
  private showDetailIcon = true

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
  }

  private bindPaginationEvents(event) {
    switch (event.key) {
      case 'n':
        if (this.currentPage < Math.ceil(this.total / this.itemsPerPage))
          this.currentPage = this.currentPage + 1
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
    return this.$store.getters['preferences/getHistoryItemsPerPage']
  }

  get showList(): TableRow[] {
    return this.customGroups
  }

  get groupKey() {
    return this.groupKeyOption || 'Holder'
  }

  protected createTable(): void {
    const NFTList = this.generateNFTList()
    this.customGroups = this.generatecustomGroups(NFTList)
  }

  private generateNFTList(): TableRow[] {
    const itemRowMap: Record<string, any> = {}

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
      const nftId = newEvent['nft']?.id
      if (newEvent['interaction'] === 'MINTNFT') {
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
      } else if (newEvent['interaction'] === 'LIST') {
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
      } else if (newEvent['interaction'] === 'SEND') {
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
      } else if (newEvent['interaction'] === 'CONSUME') {
        if (!itemRowMap[nftId]) {
          itemRowMap[nftId] = {
            Item: newEvent['nft'],
            Holder: '-',
            Bought: 0,
            Sale: 0,
            ...commonInfo,
          }
        }
      } else if (newEvent['interaction'] === 'BUY') {
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
    if (this.groupKey === 'Holder') {
      return item['Holder']
    } else if (this.groupKey === 'CollectionId') {
      return item['Item']['collection']['id']
    }
    return item['Holder']
  }

  private getCustomRowFilter(): (item: TableRow) => boolean {
    if (this.groupKey === 'Holder') {
      return (item) => item.Holder !== '-'
    } else if (this.groupKey === 'CollectionId') {
      return (item) => item.Holder === this.$route.params.id
    }
    return () => true
  }

  private generatecustomGroups(itemRowList: TableRow[]): TableRow[] {
    const customGroups: Record<string, TableRow> = {}
    itemRowList.filter(this.getCustomRowFilter()).forEach((item: TableRow) => {
      item = {
        Bought: 0,
        Sale: 0,
        ...item,
      }
      const groupName = this.getGroupNameFromRow(item)
      if (customGroups[groupName]) {
        customGroups[groupName].Items?.push(item)
        customGroups[groupName]['Bought'] =
          customGroups[groupName]['Bought'] + item['Bought']
        customGroups[groupName]['Sale'] =
          customGroups[groupName]['Sale'] + item['Sale']
      } else {
        customGroups[groupName] = {
          ...item,
          Id: item['CollectionId'] + item['Item']['id'],
          Items: [item],
        }
      }
    })

    const customGroupsList = Object.values(customGroups)

    customGroupsList.forEach((group) => {
      parsePriceForItem(group, this.decimals, this.unit)
      if (!group['Items']) return
      let groupItems: TableRow[] = group['Items']
      group['Amount'] = groupItems.length
      groupItems.forEach((item) => {
        parsePriceForItem(item, this.decimals, this.unit)
      })
      group['Items'] = groupItems.sort((a, b) => b.SortKey - a.SortKey)
    })
    return customGroupsList
  }

  protected getBlockUrl(block: string): string {
    return urlBuilderBlockNumber(
      block,
      this.$store.getters['explorer/getCurrentChain'],
      'subscan'
    )
  }

  @Watch('events', { immediate: true })
  public watchEvent(): void {
    if (this.events) {
      this.createTable()
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
      .catch(console.warn /*Navigation Duplicate err fix later */)
  }
}
</script>
<style lang="scss">
.collapseHidden {
  .collapse-trigger {
    display: none;
  }
}

.box {
  .table-nav {
    display: flex;
    justify-content: space-between;
  }
  .box-container {
    @media screen and (max-width: 768px) {
      flex-direction: column-reverse;
    }
  }
}
</style>
