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
            {{ $t('history.label') }}
          </p>
          <a class="card-header-icon">
            <NeoIcon :icon="props.open ? 'chevron-up' : 'chevron-down'" />
          </a>
        </div>
      </template>
      <div class="box">
        <div class="is-flex is-justify-content-space-between box-container">
          <b-select
            v-model="selectedEvent"
            placeholder="Select an event"
            data-cy="select-event">
            <option
              v-for="option in uniqType"
              :key="option.type"
              :value="option.type">
              {{ option.value }}
            </option>
          </b-select>
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
            field="Type"
            label="Type"
            cell-class="type-table">
            {{ getEventDisplayName(props.row.Type) }}
          </b-table-column>
          <b-table-column
            v-if="displayItem"
            v-slot="props"
            cell-class="short-identity__table"
            field="Item"
            label="Item">
            <nuxt-link :to="`/${urlPrefix}/gallery/${props.row.Item.id}`">
              {{ props.row.Item.name || props.row.Item.id }}
            </nuxt-link>
          </b-table-column>
          <b-table-column
            v-slot="props"
            cell-class="short-identity__table"
            field="From"
            label="From">
            <nuxt-link :to="`/${urlPrefix}/u/${props.row.From}`">
              <Identity :address="props.row.From" />
            </nuxt-link>
          </b-table-column>
          <b-table-column
            v-slot="props"
            :visible="isToColumnVisible"
            cell-class="short-identity__table"
            field="To"
            label="To">
            <nuxt-link :to="`/${urlPrefix}/u/${props.row.toString}`">
              <Identity :address="props.row.To" />
            </nuxt-link>
          </b-table-column>
          <b-table-column
            v-slot="props"
            cell-class="short-identity__table"
            field="Amount"
            label="Amount">
            <div v-if="parseInt(props.row.Amount)">
              <CommonTokenMoney :value="props.row.Amount" />
            </div>
            <div v-else>-</div>
          </b-table-column>
          <b-table-column
            v-slot="props"
            cell-class="short-identity__table"
            :visible="isPercentageColumnVisible"
            field="Percentage"
            label="Percentage">
            <span :class="percentageTextClassName(props.row.Percentage)">
              {{ props.row.Percentage | toPercent('-') }}
            </span>
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
                :block-id="props.row.Block"
                :text="props.row.Time" />
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
import { Interaction } from '@kodadot1/minimark/v1'
import { formatDistanceToNow } from 'date-fns'

import { exist } from '@/components/search/exist'

import ChainMixin from '@/utils/mixins/chainMixin'
import KeyboardEventsMixin from '@/utils/mixins/keyboardEventsMixin'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import { usePreferencesStore } from '@/stores/preferences'

import {
  HistoryEventType,
  InteractionBsxOnly,
  parseChartAmount,
  parseDate,
  wrapEventNameWithIcon,
} from '@/utils/historyEvent'
import shortAddress from '@/utils/shortAddress'

import { Interaction as EventInteraction } from '../service/scheme'
import { NeoIcon } from '@kodadot1/brick'

const components = {
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
  Pagination: () => import('@/components/rmrk/Gallery/Pagination.vue'),
  BlockExplorerLink: () => import('@/components/shared/BlockExplorerLink.vue'),
  CommonTokenMoney: () => import('@/components/shared/CommonTokenMoney.vue'),
  NeoIcon,
}

type TableRowItem = {
  id: string
  name: string
}

type TableRow = {
  Type: HistoryEventType
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
export default class History extends mixins(
  PrefixMixin,
  ChainMixin,
  KeyboardEventsMixin
) {
  @Prop({ type: Array }) public events!: EventInteraction[]
  @Prop({ type: Boolean, default: true })
  private readonly openOnDefault!: boolean
  @Prop({ type: Boolean, default: false }) hideCollapse!: boolean
  @Prop({ type: Boolean, default: false }) displayItem!: boolean

  private currentPage = parseInt(this.$route.query?.page as string) || 1
  private event: HistoryEventType = HistoryEventType.BUY

  protected data: TableRow[] = []
  protected copyTableData: TableRow[] = []
  public isOpen = false
  public shortAddress = shortAddress
  private preferencesStore = usePreferencesStore()

  public async created() {
    this.initKeyboardEventHandler({
      e: this.bindExpandEvents,
    })
  }

  public mounted() {
    exist(this.$route.query.event, (val) => {
      this.event = (val as HistoryEventType) ?? HistoryEventType.ALL
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

  getEventDisplayName(type: Interaction) {
    return wrapEventNameWithIcon(type, this.$t(`nft.event.${type}`) as string)
  }

  get uniqType(): { type: HistoryEventType; value: string }[] {
    const eventSet = new Set(this.copyTableData.map((v) => v.Type))
    const singleEventList = Array.from(eventSet).map((type) => ({
      type,
      value: this.getEventDisplayName(type as Interaction),
    }))
    return [{ type: HistoryEventType.ALL, value: 'All' }, ...singleEventList]
  }

  get isToColumnVisible() {
    return [HistoryEventType.ALL, Interaction.BUY, Interaction.SEND].includes(
      this.event
    )
  }

  get isPercentageColumnVisible() {
    return [HistoryEventType.ALL, Interaction.BUY].includes(this.event)
  }

  get selectedEvent(): HistoryEventType {
    return this.event
  }

  set selectedEvent(event: HistoryEventType) {
    if (event) {
      this.currentPage = 1
      this.event = event
      this.replaceUrl(event)
    }
  }

  protected updateDataByEvent() {
    const event = this.event
    this.data =
      event === HistoryEventType.ALL
        ? this.copyTableData
        : [...new Set(this.copyTableData.filter((v) => v.Type === event))]
  }

  private percentageTextClassName(percentage: number) {
    if (percentage > 0) {
      return 'has-text-success'
    } else if (percentage < 0) {
      return 'has-text-danger'
    }
    return ''
  }

  @Debounce(100)
  replaceUrl(value: string, key = 'event') {
    this.$router
      .replace({
        path: String(this.$route.path),
        query: { ...this.$route.query, [key]: value },
      })
      .catch(this.$consola.warn /*Navigation Duplicate err fix later */)
  }

  protected createTable(): void {
    this.data = []
    this.copyTableData = []

    const chartData: ChartData = {
      buy: [],
      list: [],
    }
    const previousPriceMap = {}

    for (const newEvent of this.events) {
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
      if (this.displayItem) {
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

      // ID for b-table: Use a unique key of your data Object for each row.
      event['ID'] = newEvent['timestamp'] + newEvent['id']

      // Push to chart data
      if (newEvent['interaction'] === Interaction.LIST) {
        this.pushChartData(chartData.list, date, event['Amount'])
      } else if (newEvent['interaction'] === Interaction.BUY) {
        this.pushChartData(chartData.buy, date, event['Amount'])
      }

      this.copyTableData.push(event)
    }
    this.copyTableData = this.copyTableData.reverse()
    this.updateDataByEvent()

    if (!this.data.length) {
      this.event = HistoryEventType.ALL
    }

    this.$emit('setPriceChartData', [chartData.buy, chartData.list])
  }

  private pushChartData(array, date, amount) {
    array.push([date, parseChartAmount(amount, this.decimals)])
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
      this.updateDataByEvent()
    }
  }
}
</script>
