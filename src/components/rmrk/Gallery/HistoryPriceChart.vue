<template>
  <div class="block">
    <b-collapse class="card" animation="slide"
      aria-id="contentIdForA11y3" :open="collapsed">
      <template #trigger="props">
        <div
          class="card-header"
          role="button"
          aria-controls="contentIdForA11y3">
          <p class="card-header-title">
            {{ $t('Price Chart') }}
          </p>
          <a class="card-header-icon">
            <b-icon
              :icon="props.open ? 'chevron-up' : 'chevron-down'">
            </b-icon>
          </a>
        </div>
      </template>
      <div class="card-content">
        <div class="content">
          <PriceChart :priceData="priceData" ref="chart"/>
        </div>
      </div>

    </b-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from 'vue-property-decorator'
import { Interaction } from '../service/scheme'
import formatBalance from '@/utils/formatBalance'
import ChainMixin from '@/utils/mixins/chainMixin'
import { onlyPriceChartEvent } from '../utils'

const components = {
  PriceChart: () => import('@/components/rmrk/Gallery/PriceChart.vue'),
}

type PricePoint = [Date, string]

@Component({ components })
export default class HistoryPriceChart extends Mixins(ChainMixin) {
  @Prop({ type: Array }) public events!: Interaction[];

  protected collapsed = true;
  protected priceData: PricePoint[] = [];

  public mounted(): void {
    this.collapsed = true

    setTimeout(() => {
      this.collapsed = false
    }, 200)
  }

  protected createTable(events: Interaction[]): void {
    this.priceData = events.filter(onlyPriceChartEvent).map(event => {
      const date = new Date(event.timestamp)
      const price = formatBalance(event.meta, this.decimals, false)
      return [date, price]
    })
  }

  @Watch('events', { immediate: true })
  public watchEvent(events: Interaction[]): void {
    if (this.events) {
      this.createTable(events)
    }
  }

}
</script>
<style>

</style>

<style scoped lang="scss">
  @import "@/styles/variables";
</style>
