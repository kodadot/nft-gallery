<template>
  <div class="mt-6">
    <div v-if="status === 'show'">
      <div
        class="is-flex is-align-items-center is-justify-content-space-between">
        <p class="label mb-0">Box Plot Chart</p>
        <b-select :value="selectedRange" @input="selectRange($event)">
          <option v-for="option in range" :key="option" :value="option">
            {{ option.charAt(0).toUpperCase() + option.slice(1) }}
          </option>
        </b-select>
      </div>
      <Canvas
        type="boxplot"
        :labels="labels"
        :datasets="datasets"
        :options="chartOptions" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import format from 'date-fns/format'
import { filterOutliers } from '@/utils/chart'
import ChainMixin from '@/utils/mixins/chainMixin'
import containerOptions from './containerOptions'

// types
import { CollectionChartData as ChartData } from '@/utils/chart'
import type { ChartDataset } from 'chart.js'

@Component({
  components: {
    Canvas: () => import('~/components/shared/chart/BoxPlot/Canvas.vue'),
  },
})
export default class BoxPlotContainer extends mixins(ChainMixin) {
  @Prop({ type: Array, required: true }) public priceData!: [
    ChartData[],
    ChartData[]
  ] // [listings, buys]

  // data
  protected status: 'show' | 'hideChart' = 'show'
  protected range = ['yearly', 'quarterly', 'monthly']
  protected list = {}
  protected listIqr = []
  protected buy = {}
  protected buyIqr = []

  // attribute for box plot
  protected labels: string[] = []
  protected datasets: ChartDataset[] = []

  // default attribute
  protected defaultDataset = {
    borderWidth: 1,
    padding: 10,
    itemRadius: 0,
    outlierBackgroundColor: 'white',
    outlierBorderColor: 'white',
    outlierRadius: 2,
    outlierBorderWidth: 2,
  }

  // computed
  get selectedRange(): string {
    if (typeof this.$route.query.boxPlot === 'string') {
      return this.$route.query.boxPlot
    }

    return 'yearly'
  }

  get chartOptions() {
    const options = containerOptions({
      labels: this.labels,
      unit: this.unit,
      valueList: this.listIqr,
      valueBuy: this.buyIqr,
    })

    return options
  }

  // methods
  protected selectRange(range: string): void {
    this.$router.push({
      path: this.$route.path,
      query: {
        ...this.$route.query,
        boxPlot: range,
      },
    })
  }

  protected dataByRange(data: ChartData[], type = 'list') {
    const whichData = this[type]
    const whichRange = {
      yearly: 'yyyy',
      quarterly: 'QQQ yy',
      monthly: 'MMM yy',
    }

    data.forEach(({ date, value }) => {
      const dateStr = format(new Date(date), whichRange[this.selectedRange])

      if (!whichData[dateStr]) {
        whichData[dateStr] = []
      }

      whichData[dateStr].push(value)
      this[`${type}Iqr`].push(value)
    })

    // remove some outliers
    Object.keys(whichData).forEach((item) => {
      whichData[item] = filterOutliers(whichData[item])
    })
  }

  protected initData() {
    this.list = {}
    this.buy = {}

    if (this.priceData[0]?.length < 4 && this.priceData[1]?.length < 4) {
      this.status = 'hideChart'
      return
    }

    if (this.priceData[0]?.length > 0 || this.priceData[1]?.length > 0) {
      this.dataByRange(this.priceData[0], 'list')
      this.dataByRange(this.priceData[1], 'buy')
    }

    this.labels = [
      ...new Set([...Object.keys(this.list), ...Object.keys(this.buy)]),
    ]

    this.datasets = [
      {
        label: 'List',
        backgroundColor: 'rgba(230, 0, 126, 0.3)',
        borderColor: '#e6007e',
        data: Object.values(this.list),
        ...this.defaultDataset,
      },
      {
        label: 'Buy',
        backgroundColor: 'rgba(0, 187, 127, 0.3)',
        borderColor: '#00BB7F',
        data: Object.values(this.buy),
        ...this.defaultDataset,
      },
    ]
  }

  protected mounted() {
    this.initData()
  }

  @Watch('$route.query')
  protected onQueryChange(newQuery, oldQuery) {
    if (newQuery.boxPlot !== oldQuery.boxPlot) {
      this.initData()
    }
  }

  @Watch('priceData')
  async watchData() {
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
.chart-container {
  background-color: white;
  width: 100%;
  height: 100%;
}
</style>
