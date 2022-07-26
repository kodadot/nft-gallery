<template>
  <div>
    <div class="chart-container">
      <canvas ref="chartBoxPlot" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import format from 'date-fns/format'
import { Chart, LinearScale, CategoryScale } from 'chart.js'
import {
  BoxPlotController,
  BoxAndWiskers,
} from '@sgratzl/chartjs-chart-boxplot'

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

  protected floorData = {}
  protected soldData = {}

  protected randomValues(count, min, max) {
    const delta = max - min
    return Array.from({ length: count }).map(() => Math.random() * delta + min)
  }

  mounted() {
    console.clear()
    console.log(this.priceData)
    const plotlyChart = []

    if (this.priceData[0]?.length > 0) {
      this.priceData[0].forEach((item) => {
        const key = format(new Date(item.date), 'MMM yy')

        if (this.floorData[key] === undefined) {
          this.floorData[key] = []
        }

        this.floorData[key].push(item.value)
      })

      console.log(this.floorData)
      console.log(Object.keys(this.floorData))
      console.log(Object.values(this.floorData))
      // Object.keys(this.floorData).forEach((item) => {
      //   plotlyChart.push({
      //     name: item,
      //     y: this.floorData[item],
      //     type: 'box',
      //   })
      // })
      // console.log(plotlyChart)
    }

    const ctx = (this.$refs.chartBoxPlot as HTMLCanvasElement).getContext('2d')
    const boxplotData = {
      // define label tree
      labels: Object.keys(this.floorData),
      datasets: [
        {
          label: 'Floor Price',
          backgroundColor: 'rgba(230, 0, 126, 0.3)',
          borderColor: '#e6007e',
          borderWidth: 1,
          outlierColor: 'white',
          padding: 10,
          itemRadius: 0,
          data: Object.values(this.floorData),
        },
      ],
    }

    if (ctx) {
      new Chart(ctx, {
        type: 'boxplot',
        data: boxplotData,
        options: {
          responsive: true,
        },
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 100%;
  margin-top: 10rem;
}
</style>
