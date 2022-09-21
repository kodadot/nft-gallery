<template>
  <canvas id="chartBoxPlot" />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js'
import {
  BoxAndWiskers,
  BoxPlotController,
} from '@sgratzl/chartjs-chart-boxplot'
import annotationPlugin from 'chartjs-plugin-annotation'

// types
import type { ChartDataset } from 'chart.js'

// register chart plugins
Chart.register(
  BoxPlotController,
  BoxAndWiskers,
  LinearScale,
  CategoryScale,
  Tooltip
)
Chart.register(annotationPlugin)

@Component({})
export default class BoxPlot extends Vue {
  @Prop() labels!: string[]
  @Prop() datasets!: ChartDataset[]
  @Prop() options

  protected chart!: Chart
  protected renderChart() {
    const ctx = (
      document.querySelector('#chartBoxPlot') as HTMLCanvasElement
    ).getContext('2d')

    // first render
    if (ctx && !this.chart) {
      this.chart = new Chart(ctx, {
        type: 'boxplot',
        data: {
          labels: this.labels,
          datasets: this.datasets,
        },
        options: this.options,
      })
    }

    // update chart
    if (ctx && this.chart) {
      this.chart.data.labels = this.labels
      this.chart.data.datasets = this.datasets
      this.chart.options = this.options
      this.chart.update()
    }
  }

  protected mounted() {
    this.renderChart()
  }

  @Watch('datasets')
  onChangeDatasets() {
    this.renderChart()
  }
}
</script>
