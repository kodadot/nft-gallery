<template>
  <div class="block">
    <b-collapse
      :open="isOpen"
      class="card"
      :class="hideCollapse ? 'collapseHidden' : 'bordered'"
      animation="slide"
      aria-id="contentIdForHistory">
      <div class="box">
        <div>
          <Pagination
            v-model="currentPage"
            :total="total"
            :per-page="itemsPerPage"
            replace
            enable-listen-keyboard-event
            preserve-scroll />
        </div>
        <b-table :data="showList" class="mb-4" hoverable custom-row-key="ID">
          <b-table-column
            v-slot="props"
            field="Collection"
            label="Collection"
            cell-class="type-table">
            <nuxt-link
              :to="`/${urlPrefix}/collection/${props.row.Collection.id}`">
              {{ props.row.Collection.name }}
            </nuxt-link>
          </b-table-column>
          <b-table-column
            v-slot="props"
            field="Nft"
            label="Nft"
            cell-class="type-table">
            <nuxt-link :to="`/${urlPrefix}/gallery/${props.row.Nft.id}`">
              {{ props.row.Nft.name }}
            </nuxt-link>
          </b-table-column>
          <b-table-column
            v-slot="props"
            cell-class="short-identity__table"
            field="Buyer"
            label="Buyer">
            <nuxt-link :to="`/${urlPrefix}/u/${props.row.Buyer}`">
              <Identity :address="props.row.Buyer" />
            </nuxt-link>
          </b-table-column>
          <b-table-column
            v-slot="props"
            cell-class="short-identity__table"
            field="Amount"
            label="Amount">
            {{ props.row.Amount }}
          </b-table-column>
          <b-table-column
            v-slot="props"
            cell-class="short-identity__table"
            field="Date"
            label="Date">
            <b-tooltip
              :label="props.row.Date"
              position="is-right"
              append-to-body>
              <BlockExplorerLink
                :text="props.row.Time"
                :block-id="props.row.Block" />
            </b-tooltip>
          </b-table-column>
        </b-table>
      </div>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { DocumentNode } from 'graphql'
import { formatDistanceToNow } from 'date-fns'

import { exist } from '@/utils/exist'

import ChainMixin from '@/utils/mixins/chainMixin'
import KeyboardEventsMixin from '@/utils/mixins/keyboardEventsMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'

import formatBalance from '@/utils/format/balance'
import shortAddress from '@/utils/shortAddress'

import { Event } from '../service/types'
import { usePreferencesStore } from '@/stores/preferences'

const components = {
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  BlockExplorerLink: () => import('@/components/shared/BlockExplorerLink.vue'),
}

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

@Component({ components })
export default class Sales extends mixins(
  PrefixMixin,
  ChainMixin,
  KeyboardEventsMixin
) {
  @Prop({ type: Array }) public events!: Event[]
  @Prop({ type: Boolean, default: true })
  private readonly openOnDefault!: boolean
  @Prop({ type: Boolean, default: false }) hideCollapse!: boolean
  @Prop() public query!: DocumentNode
  @Prop() public issuer!: string
  protected first = 20
  private currentPage = parseInt(this.$route.query?.page as string) || 1
  private event: string = this.$tc('nft.event.BUY')
  private preferencesStore = usePreferencesStore()

  protected data: TableRow[] = []
  protected copyTableData: TableRow[] = []
  public isOpen = false
  public shortAddress = shortAddress

  public async created() {
    this.initKeyboardEventHandler({
      e: this.bindExpandEvents,
    })
  }

  public mounted() {
    exist(this.$route.query.event, (val) => {
      this.event = val ? decodeURIComponent(val) : 'all'
    })
    this.isOpen = this.openOnDefault
  }

  private bindExpandEvents(event) {
    if (event.key === 'h') {
      this.isOpen = !this.isOpen
    }
  }

  get total(): number {
    return this.data.length
  }

  get itemsPerPage(): number {
    return this.preferencesStore.getHistoryItemsPerPage
  }

  get showList(): TableRow[] {
    const endIndex = this.currentPage * this.itemsPerPage
    return this.data.slice(endIndex - this.itemsPerPage, endIndex)
  }

  get uniqType(): string[] {
    return [...new Map(this.copyTableData.map((v) => [v.Type, v])).keys()]
  }

  get selectedEvent(): string {
    return this.event
  }

  set selectedEvent(event: string) {
    if (event) {
      this.currentPage = 1
      this.event = event
      this.replaceUrl(event)
    }
  }

  protected updateDataByEvent() {
    const event = this.event
    this.data =
      event === 'all'
        ? this.copyTableData
        : [...new Set(this.copyTableData.filter((v) => v.Type === event))]
  }

  @Debounce(100)
  replaceUrl(value: string, key = 'event') {
    this.$router
      .replace({
        path: String(this.$route.path),
        query: { ...this.$route.query, [key]: encodeURIComponent(value) },
      })
      .catch(this.$consola.warn /*Navigation Duplicate err fix later */)
  }

  protected createTable(): void {
    this.data = []
    this.copyTableData = []
    const priceCollectorMap: Record<string, string> = {}
    const ownerCollectorMap: Record<string, string> = {}

    const chartData: ChartData = {
      buy: [],
      list: [],
    }

    for (const newEvent of this.events) {
      const event: any = {}
      let isListedByUser =
        newEvent &&
        newEvent.nft &&
        newEvent.nft.events &&
        newEvent.nft.events.find(
          (e) => e.caller === this.issuer && e.interaction == 'LIST'
        )

      if (!isListedByUser) {
        continue
      }

      const nftId = newEvent?.nft?.id

      event['Buyer'] = newEvent['caller']
      event['Type'] = this.$t('nft.event.BUY')
      event['Collection'] = newEvent.nft.collection
      event['Nft'] = newEvent.nft

      ownerCollectorMap[nftId] = newEvent['caller']
      priceCollectorMap[nftId] = newEvent['meta']

      // Amount
      const curPrice = priceCollectorMap[nftId]
      event['Amount'] = parseInt(curPrice)
        ? formatBalance(curPrice, this.decimals, this.unit)
        : '-'

      // Date
      const date = new Date(newEvent['timestamp'])
      event['Date'] = this.parseDate(date)

      // Time
      event['Time'] = formatDistanceToNow(date, { addSuffix: true })

      event['Block'] = String(newEvent['blockNumber'])

      // ID for b-table: Use a unique key of your data Object for each row.
      event['ID'] = newEvent['timestamp'] + newEvent['id']
      // Push to chart data
      chartData.buy.push([date, parseFloat(event['Amount'].substring(0, 6))])
      this.copyTableData.push(event)
    }
    this.copyTableData = this.copyTableData.reverse()
    this.updateDataByEvent()

    if (!this.data.length) {
      this.event = 'all'
    }

    this.$emit('setPriceChartData', [chartData.buy, chartData.list])
  }

  protected parseDate(date: Date): string {
    return date.toLocaleString('en-GB', {
      timeZone: 'UTC',
      timeZoneName: 'short',
    })
  }

  @Watch('events', { immediate: true })
  public watchEvents(): void {
    if (this.events) {
      this.createTable()
    }
  }

  @Watch('event', { immediate: true })
  public watchInteractionEvent(): void {
    if (this.event) {
      this.updateDataByEvent()
    }
  }
}
</script>
