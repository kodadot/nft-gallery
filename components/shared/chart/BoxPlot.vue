<template>
  <div class="mt-6">
    <div class="is-flex is-align-items-center is-justify-content-space-between">
      <p class="label">Box Plot Chart</p>
      <b-select v-model="selectedRange" @input="selectRange($event)">
        <option v-for="option in range" :value="option" :key="option">
          {{ option }}
        </option>
      </b-select>
    </div>
    <div class="chart-container">
      <canvas ref="chartBoxPlot" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
import format from 'date-fns/format'
import { Chart, LinearScale, CategoryScale } from 'chart.js'
import {
  BoxPlotController,
  BoxAndWiskers,
} from '@sgratzl/chartjs-chart-boxplot'
import annotationPlugin from 'chartjs-plugin-annotation'
import { filterOutliers, getHSpread } from '@/utils/chart'

// types
import { CollectionChartData as ChartData } from '@/utils/chart'

// register chart plugins
Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale)
Chart.register(annotationPlugin)

const defaultDataset = {
  borderWidth: 1,
  padding: 10,
  itemRadius: 0,
  outlierBackgroundColor: 'white',
  outlierBorderColor: 'white',
  outlierRadius: 2,
  outlierBorderWidth: 2,
}

@Component({})
export default class BoxPlot extends Vue {
  @Prop({ type: Array, required: true }) public priceData!: [
    ChartData[],
    ChartData[]
  ] // [listings, buys]

  protected range = ['yearly', 'quarterly', 'monthly']
  protected selectedRange = 'yearly'
  protected listData = {}
  protected buyData = {}
  protected iqrData = {
    listings: [],
    buys: [],
  }
  protected chartBoxPlot!: Chart<'boxplot', unknown, unknown>

  protected selectRange(range: string): void {
    this.selectedRange = range
    this.generateChart()
  }

  protected groupData(data: ChartData[], type = 'listings') {
    const groupedData = type === 'listings' ? this.listData : this.buyData
    const formatType = {
      yearly: 'yyyy',
      quarterly: 'QQQ yy',
      monthly: 'MMM yy',
    }

    data.forEach(({ date, value }) => {
      const dateStr = format(new Date(date), formatType[this.selectedRange])

      if (!groupedData[dateStr]) {
        groupedData[dateStr] = []
      }

      groupedData[dateStr].push(value)
      this.iqrData[type].push(value)
    })

    // remove some outliers
    Object.keys(groupedData).forEach((item) => {
      if (type === 'listings') {
        console.log(filterOutliers(groupedData[item]))
      }
      groupedData[item] = filterOutliers(groupedData[item])
    })
  }

  protected generateChart() {
    this.listData = {}
    this.buyData = {}

    if (this.priceData[0]?.length > 0 || this.priceData[1]?.length > 0) {
      this.groupData(this.priceData[0], 'listings')
      this.groupData(this.priceData[1], 'buys')
    }

    const ctx = (this.$refs.chartBoxPlot as HTMLCanvasElement).getContext('2d')
    const labels = [
      ...new Set([...Object.keys(this.listData), ...Object.keys(this.buyData)]),
    ]
    const boxplotData = {
      labels,
      datasets: [
        {
          label: 'List',
          backgroundColor: 'rgba(230, 0, 126, 0.3)',
          borderColor: '#e6007e',
          data: Object.values(this.listData),
          ...defaultDataset,
        },
        {
          label: 'Buy',
          backgroundColor: 'rgba(0, 187, 127, 0.3)',
          borderColor: '#00BB7F',
          data: Object.values(this.buyData),
          ...defaultDataset,
        },
      ],
    }
    const { iqr: iqrList } = getHSpread(this.iqrData.listings)
    const { iqr: iqrBuy } = getHSpread(this.iqrData.buys)

    if (ctx && iqrList && iqrBuy) {
      if (this.chartBoxPlot) {
        this.chartBoxPlot.data = boxplotData
        this.chartBoxPlot.update()
      } else {
        this.chartBoxPlot = new Chart(ctx, {
          type: 'boxplot',
          data: boxplotData,
          options: {
            responsive: true,
            scales: {
              y: {
                ticks: {
                  color: 'white',
                  callback: (value) => {
                    return `${value} ${this.$store.getters['chain/getChainProperties'].tokenSymbol}`
                  },
                  stepSize: 0.1,
                  maxTicksLimit: 10,
                },
              },
            },
            plugins: {
              tooltip: {
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
              },
              annotation: {
                annotations: [
                  {
                    type: 'label',
                    borderColor: 'white',
                    content: 'asdf',
                    xValue: 9,
                    yValue: 30,
                  },
                  {
                    type: 'line',
                    borderColor: '#e6007e',
                    borderWidth: 0,
                    label: {
                      content: () => `IQR List: ${iqrList.toFixed(2)}`,
                      position: 'start',
                      display: true,
                    },
                    scaleID: 'y',
                    value: () => iqrList,
                  },
                  {
                    type: 'line',
                    borderColor: '#00BB7F',
                    borderWidth: 0,
                    label: {
                      content: () => `IQR Buy: ${iqrBuy.toFixed(2)}`,
                      position: 'end',
                      display: true,
                    },
                    scaleID: 'y',
                    value: () => iqrList,
                  },
                ],
              },
            },
          },
        })
      }
    }
  }

  protected mounted() {
    this.generateChart()
  }

  @Watch('priceData')
  async watchData() {
    this.generateChart()
  }
}
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
