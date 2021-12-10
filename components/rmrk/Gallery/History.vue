<template>
  <div class="block">
    <b-collapse
      class="card"
      animation="slide"
      aria-id="contentIdForHistory"
    >
      <template #trigger="props">
        <div
          class="card-header"
          role="button"
          aria-controls="contentIdForHistory"
        >
          <p class="card-header-title">
            {{ $t('History') }}
          </p>
          <a class="card-header-icon">
            <b-icon :icon="props.open ? 'chevron-up' : 'chevron-down'">
            </b-icon>
          </a>
        </div>
      </template>
      <div class="card-content">
        <div class="content">
          <b-field>
            <b-select placeholder="Select an event" v-model="selectedEvent">
              <option value="all">All</option>
              <option
                v-for="option in uniqType"
                :value="option.Type"
                :key="option.Type">
                {{ option.Type }}
              </option>
            </b-select>
          </b-field>

          <b-table :data="data" class="mb-4" hoverable>
            <b-table-column
              field="Type"
              label="Type"
              v-slot="props"
            >
              {{ props.row.Type }}
            </b-table-column>
            <b-table-column
              cell-class="short-identity__table"
              field="From"
              label="From"
              v-slot="props"
            >
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: { id: props.row.From },
                }"
              >
                <Identity :address="props.row.From" inline noOverflow />
              </nuxt-link>
            </b-table-column>
            <b-table-column
              cell-class="short-identity__table"
              field="To"
              label="To"
              v-slot="props"
            >
              <nuxt-link
                :to="{ name: 'rmrk-u-id', params: { id: props.row.To } }"
              >
                <Identity :address="props.row.To" inline noOverflow />
              </nuxt-link>
            </b-table-column>
            <b-table-column
              cell-class="short-identity__table"
              field="Amount"
              label="Amount"
              v-slot="props"
            >
              {{ props.row.Amount }}
            </b-table-column>
            <b-table-column
              cell-class="short-identity__table"
              field="Date"
              label="Date"
              v-slot="props"
            >
              <a
                target="_blank"
                rel="noopener noreferrer"
                :href="getBlockUrl(props.row.Block)"
                >{{ props.row.Date }}</a
              >
            </b-table-column>
          </b-table>
        </div>
      </div>
    </b-collapse>
    <price-chart class="mt-4" :priceChartData="priceChartData" />
  </div>
</template>

<script lang="ts">
import { urlBuilderBlockNumber } from '@/utils/explorerGuide';
import formatBalance from '@/utils/formatBalance';
import ChainMixin from '@/utils/mixins/chainMixin';
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator';
import { Interaction } from '../service/scheme';
import i18n from '@/i18n'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  PriceChart: () => import('@/components/rmrk/Gallery/PriceChart.vue'),
};

type TableRow = {
  Type: string;
  From: string;
  To: string;
  Amount: string;
  Date: string;
  Block: string;
};

type ChartData = { buy: [Date, number][]; list: [Date, number][] };

@Component({ components })
export default class History extends mixins(ChainMixin) {
  @Prop({ type: Array }) public events!: Interaction[];
  protected data: TableRow[] = [];
  protected copyTableData: TableRow[] = [];
  protected priceChartData: [Date, number][][] = [];

  get uniqType(): any[] {
    return [...new Map(this.copyTableData.map(v => [v.Type, v])).values()]
  }

  get selectedEvent(): string {
    return 'all'
  }

  set selectedEvent(event: string) {
    if (event) {
      this.data = event === 'all'
        ? this.copyTableData
        : [...new Set(this.copyTableData.filter(v => v.Type === event))]
    }
  }

  protected createTable(): void {
    let prevOwner = '';
    let curPrice = '0.0000000';
    this.data = [];
    this.copyTableData = [];

    const chartData: ChartData = {
      buy: [],
      list: [],
    };

    for (const newEvent of this.events) {
      const event: any = {};

      // Type
      if (newEvent['interaction'] === 'MINTNFT') {
        event['Type'] = i18n.t('nft.event.MINTNFT');
        event['From'] = newEvent['caller'];
        event['To'] = '';
      } else if (newEvent['interaction'] === 'LIST') {
        event['Type'] = i18n.t('nft.event.LIST');
        event['From'] = newEvent['caller'];
        event['To'] = '';
        prevOwner = event['From'];
        curPrice = newEvent['meta'];
      } else if (newEvent['interaction'] === 'SEND') {
        event['Type'] = i18n.t('nft.event.SEND');
        event['From'] = newEvent['caller'];
        event['To'] = newEvent['meta'];
      } else if (newEvent['interaction'] === 'CONSUME') {
        event['Type'] = i18n.t('nft.event.CONSUME');
        event['From'] = newEvent['caller'];
        event['To'] = '';
      } else if (newEvent['interaction'] === 'BUY') {
        event['Type'] = i18n.t('nft.event.BUY');
      } else event['Type'] = newEvent['interaction'];

      // From
      if (!('From' in event)) event['From'] = prevOwner;

      // To
      if (!('To' in event)) {
        event['To'] = newEvent['caller'];
        prevOwner = event['To'];
      }

      // Amount
      event['Amount'] = formatBalance(curPrice, this.decimals, this.unit);

      // Date
      const date = new Date(newEvent['timestamp']);
      event['Date'] = this.parseDate(date);

      event['Block'] = String(newEvent['blockNumber']);

      // Push to chart data
      if (newEvent['interaction'] === 'LIST') {
        chartData.list.push([
          date,
          parseFloat(event['Amount'].substring(0, 6)),
        ]);
      } else if (newEvent['interaction'] === 'BUY') {
        chartData.buy.push([date, parseFloat(event['Amount'].substring(0, 6))]);
      }

      this.data.push(event);
      this.copyTableData.push(event);
    }

    this.data = this.data.reverse();
    this.copyTableData = this.copyTableData.reverse();
    this.priceChartData = [chartData.buy, chartData.list];
  }

  protected parseDate(date: Date): string {
    const utcDate: string = date.toUTCString();
    return utcDate.substring(4);
  }

  protected getBlockUrl(block: string): string {
    return urlBuilderBlockNumber(
      block,
      this.$store.getters['explorer/getCurrentChain'],
      'subscan'
    );
  }

  @Watch('events', { immediate: true })
  public watchEvent(): void {
    if (this.events) {
      this.createTable();
    }
  }
}
</script>
<style>
.short-identity__table {
  max-width: 50em;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
