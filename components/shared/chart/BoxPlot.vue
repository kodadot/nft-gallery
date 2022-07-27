<template>
  <canvas id="chartBoxPlot" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
import { Chart, LinearScale, CategoryScale, Tooltip } from 'chart.js'
import {
  BoxPlotController,
  BoxAndWiskers,
} from '@sgratzl/chartjs-chart-boxplot'
import annotationPlugin from 'chartjs-plugin-annotation'

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
  @Prop() datasets!: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  @Prop() options

  protected chart!: Chart<'boxplot', unknown, unknown>

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
