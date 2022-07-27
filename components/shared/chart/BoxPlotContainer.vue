<template>
  <div class="mt-6">
    <div v-if="status === 'show'">
      <div
        class="is-flex is-align-items-center is-justify-content-space-between">
        <p class="label mb-0">Box Plot Chart</p>
        <b-select @input="selectRange($event)" :value="selectedRange">
          <option v-for="option in range" :value="option" :key="option">
            {{ option.charAt(0).toUpperCase() + option.slice(1) }}
          </option>
        </b-select>
      </div>
      <BoxPlot
        type="boxplot"
        :labels="labels"
        :datasets="datasets"
        :options="chartOptions" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
import format from 'date-fns/format'
import { filterOutliers, getHSpread } from '@/utils/chart'

// types
import { CollectionChartData as ChartData } from '@/utils/chart'

@Component({
  components: {
    BoxPlot: () => import('~/components/shared/chart/BoxPlot.vue'),
  },
})
export default class BoxPlotContainer extends Vue {
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
  protected datasets: any[] = [] // eslint-disable-line @typescript-eslint/no-explicit-any
  protected annotation = {}

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
  protected defaultOptions = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          color: 'white',
          callback: (value) => {
            return `${value} ${this.$store.getters['chain/getChainProperties'].tokenSymbol}`
          },
        },
      },
    },
  }
  protected defaultTooltips = {
    displayColors: false,
    callbacks: {
      title: (ctx) => {
        return `${ctx[0].dataset.label} ${ctx[0].label}`
      },
      label: (ctx) => {
        const median = ctx.parsed.median.toFixed(2)
        const q1 = ctx.parsed.q1.toFixed(2)
        const q3 = ctx.parsed.q3.toFixed(2)
        const iqr = (parseFloat(q3) - parseFloat(q1)).toFixed(2)
        const min = ctx.parsed.min.toFixed(2)
        const max = ctx.parsed.max.toFixed(2)

        const boxplotValues = [
          `Median: ${median}`,
          `Q3: ${q3}`,
          `Q1: ${q1}`,
          `IQR: ${iqr}`,
          `Min: ${min}`,
          `Max: ${max}`,
        ]
        return boxplotValues
      },
    },
  }

  // computed
  get selectedRange(): string {
    if (typeof this.$route.query.boxPlot === 'string') {
      return this.$route.query.boxPlot
    }

    return 'yearly'
  }

  get chartOptions() {
    return {
      ...this.defaultOptions,
      plugins: {
        annotation: this.annotation,
        tooltip: this.defaultTooltips,
      },
    }
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

  protected getAnnotation({ labels }) {
    const { iqr: iqrList } = getHSpread(this.listIqr)
    const { iqr: iqrBuy } = getHSpread(this.buyIqr)
    const baseAttributes = {
      type: 'line',
      borderWidth: 0,
      scaleID: 'y',
    }
    const dataIqrList = iqrList
      ? {
          ...baseAttributes,
          borderColor: '#e6007e',
          label: {
            content: () => `IQR List: ${iqrList.toFixed(2)}`,
            position: 'start',
            display: true,
          },
          value: () => iqrList,
        }
      : baseAttributes
    const dataIqrBuy = iqrBuy
      ? {
          ...baseAttributes,
          borderColor: '#00BB7F',
          label: {
            content: () => `IQR Buy: ${iqrBuy.toFixed(2)}`,
            position: 'end',
            display: true,
          },
          value: () => iqrList,
        }
      : baseAttributes
    const annotations = labels.length === 1 ? [] : [dataIqrList, dataIqrBuy]

    return {
      annotations,
    }
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

    this.annotation = this.getAnnotation({ labels: this.labels })
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
