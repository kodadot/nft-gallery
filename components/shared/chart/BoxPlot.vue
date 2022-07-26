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
import { filterOutliers } from '@/utils/chart'

// types
import { CollectionChartData as ChartData } from '@/utils/chart'

// register chart plugins
Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale)

@Component({})
export default class BoxPlot extends Vue {
  @Prop({ type: Array, required: true }) public priceData!: [
    ChartData[],
    ChartData[]
  ] // [listings, buys]

  protected range = ['quarterly', 'monthly']
  protected selectedRange = 'quarterly'
  protected listData = {}
  protected buyData = {}
  protected chartBoxPlot!: Chart<'boxplot', unknown, unknown>

  protected selectRange(range: string): void {
    this.selectedRange = range
    this.generateChart()
  }

  protected groupData(data: ChartData[], type = 'listings') {
    const groupedData = type === 'listings' ? this.listData : this.buyData
    const formatType = {
      quarterly: 'QQQ yy',
      monthly: 'MMM yy',
    }

    data.forEach(({ date, value }) => {
      const dateStr = format(new Date(date), formatType[this.selectedRange])
      if (!groupedData[dateStr]) {
        groupedData[dateStr] = []
      }
      groupedData[dateStr].push(value)
    })

    // remove some outliers
    Object.keys(this.listData).forEach((item) => {
      this.listData[item] = filterOutliers(this.listData[item])
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
    const defaultDataset = {
      borderWidth: 1,
      outlierColor: 'white',
      padding: 10,
      itemRadius: 0,
    }
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
          defaultDataset,
        },
      ],
    }

    if (ctx) {
      if (this.chartBoxPlot) {
        this.chartBoxPlot.data = boxplotData
        this.chartBoxPlot.update()
      } else {
        this.chartBoxPlot = new Chart(ctx, {
          type: 'boxplot',
          data: boxplotData,
          options: {
            responsive: true,
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
