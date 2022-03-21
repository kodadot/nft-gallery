<template>
  <div class="block">
    <b-collapse
      :open="isOpen"
      class="card bordered"
      animation="slide"
      aria-id="contentIdForHistory">
      <template #trigger="props">
        <div
          class="card-header"
          role="button"
          aria-controls="contentIdForHistory">
          <p class="card-header-title">
            {{ $t('History') }}
          </p>
          <a class="card-header-icon">
            <b-icon :icon="props.open ? 'chevron-up' : 'chevron-down'">
            </b-icon>
          </a>
        </div>
      </template>
      <div class="box">
        <div class="is-flex is-justify-content-space-between box-container">
          <b-select placeholder="Select an event" v-model="selectedEvent">
            <option value="all">All</option>
            <option v-for="option in uniqType" :value="option" :key="option">
              {{ option }}
            </option>
          </b-select>
          <Pagination
            :total="total"
            :perPage="itemsPerPage"
            v-model="currentPage"
            replace
            preserveScroll />
        </div>
        <b-table :data="showList" class="mb-4" hoverable custom-row-key="ID">
          <b-table-column
            field="Type"
            label="Type"
            v-slot="props"
            cell-class="type-table">
            {{ props.row.Type }}
          </b-table-column>
          <b-table-column
            v-if="isCollectionPage"
            cell-class="short-identity__table"
            field="Item"
            label="Item"
            v-slot="props">
            <nuxt-link
              :to="{
                name: 'rmrk-gallery-id',
                params: { id: props.row.Item.id },
              }">
              {{ props.row.Item.name }}
            </nuxt-link>
          </b-table-column>
          <b-table-column
            cell-class="short-identity__table"
            field="From"
            label="From"
            v-slot="props">
            <nuxt-link
              :to="{
                name: 'rmrk-u-id',
                params: { id: props.row.From },
              }">
              <Identity :address="props.row.From" inline noOverflow />
            </nuxt-link>
          </b-table-column>
          <b-table-column
            :visible="['all', '🤝 BUY', '🎁 GIFT'].includes(event)"
            cell-class="short-identity__table"
            field="To"
            label="To"
            v-slot="props">
            <nuxt-link
              :to="{ name: 'rmrk-u-id', params: { id: props.row.To } }">
              <Identity :address="props.row.To" inline noOverflow />
            </nuxt-link>
          </b-table-column>
          <b-table-column
            cell-class="short-identity__table"
            field="Amount"
            label="Amount"
            v-slot="props">
            {{ props.row.Amount }}
          </b-table-column>
          <b-table-column
            cell-class="short-identity__table"
            field="Date"
            label="Date"
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
        </b-table>
      </div>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import { urlBuilderBlockNumber } from '@/utils/explorerGuide'
import formatBalance from '@/utils/formatBalance'
import ChainMixin from '@/utils/mixins/chainMixin'
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import { Interaction } from '../service/scheme'
import KeyboardEventsMixin from '~/utils/mixins/keyboardEventsMixin'
import shortAddress from '@/utils/shortAddress'
import { formatDistanceToNow } from 'date-fns'
import { exist } from '@/components/rmrk/Gallery/Search/exist'
import { Debounce } from 'vue-debounce-decorator'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
}

type TableRowItem = {
  id: string
  name: string
}

type TableRow = {
  Type: string
  Item?: TableRowItem // only in collection
  From: string
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
export default class History extends mixins(ChainMixin, KeyboardEventsMixin) {
  @Prop({ type: Array }) public events!: Interaction[]
  @Prop({ type: Boolean, default: false })
  private readonly openOnDefault!: boolean
  private currentPage = 1
  private event: string = this.$tc('nft.event.BUY')
  private isCollectionPage = !!(this.$route?.name === 'rmrk-collection-id')

  protected data: TableRow[] = []
  protected copyTableData: TableRow[] = []
  public isOpen = this.openOnDefault
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
    return this.$store.getters['preferences/getHistoryItemsPerPage']
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

  protected filterData() {
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
      .catch(console.warn /*Navigation Duplicate err fix later */)
  }

  protected createTable(): void {
    let prevOwner = ''
    let curPrice = '0'
    this.data = []
    this.copyTableData = []

    const chartData: ChartData = {
      buy: [],
      list: [],
    }

    for (const newEvent of this.events) {
      const event: any = {}

      // Type
      if (newEvent['interaction'] === 'MINTNFT') {
        event['Type'] = this.$t('nft.event.MINTNFT')
        event['From'] = newEvent['caller']
        event['To'] = ''
        curPrice = '0'
      } else if (newEvent['interaction'] === 'LIST') {
        event['Type'] = parseInt(newEvent['meta'])
          ? this.$t('nft.event.LIST')
          : this.$t('nft.event.UNLIST')
        event['From'] = newEvent['caller']
        event['To'] = ''
        prevOwner = event['From']
        curPrice = newEvent['meta']
      } else if (newEvent['interaction'] === 'SEND') {
        event['Type'] = this.$t('nft.event.SEND')
        event['From'] = newEvent['caller']
        event['To'] = newEvent['meta']
        curPrice = '0'
      } else if (newEvent['interaction'] === 'CONSUME') {
        event['Type'] = this.$t('nft.event.CONSUME')
        event['From'] = newEvent['caller']
        event['To'] = ''
        curPrice = '0'
      } else if (newEvent['interaction'] === 'BUY') {
        event['Type'] = this.$t('nft.event.BUY')
      } else event['Type'] = newEvent['interaction']

      // Item
      if (this.isCollectionPage) {
        event['Item'] = newEvent['nft']
      }

      // From
      if (!('From' in event)) event['From'] = prevOwner

      // To
      if (!('To' in event)) {
        event['To'] = newEvent['caller']
        prevOwner = event['To']
      }

      // Amount
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
      event['ID'] = newEvent['id']

      // Push to chart data
      if (newEvent['interaction'] === 'LIST') {
        chartData.list.push([date, parseFloat(event['Amount'].substring(0, 6))])
      } else if (newEvent['interaction'] === 'BUY') {
        chartData.buy.push([date, parseFloat(event['Amount'].substring(0, 6))])
      }

      this.data.push(event)
      this.copyTableData.push(event)
    }

    this.data = this.data.reverse()
    this.filterData()
    this.copyTableData = this.copyTableData.reverse()
    this.$emit('setPriceChartData', [chartData.buy, chartData.list])
  }

  protected parseDate(date: Date): string {
    const utcDate: string = date.toUTCString()
    return utcDate.substring(4)
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

  @Watch('event', { immediate: true })
  public watchInteractionEvent(): void {
    if (this.event) {
      this.filterData()
    }
  }
}
</script>
<style lang="scss">
.short-identity__table {
  max-width: 50em;
  overflow: hidden;
  text-overflow: ellipsis;
}

.type-table {
  white-space: nowrap;
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
