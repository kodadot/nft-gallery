import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { Chart } from 'chart.js'

// types
import type { ChartDataset, ChartTypeRegistry } from 'chart.js'

/*
 * refer to https://stackoverflow.com/questions/51873087/unable-to-use-mixins-in-vue-with-typescript
 * import { Component, Mixins } from 'nuxt-property-decorator';
 * class ExtendedClass extends Mixins(ActualMixin) {
 */
@Component
export default class ChartMixin extends Vue {
  @Prop() labels!: string[]
  @Prop() datasets!: ChartDataset[]
  @Prop() options

  protected chart!: Chart
  protected type: keyof ChartTypeRegistry = 'line'

  protected renderChart() {
    const ctx = (this.$refs.canvas as HTMLCanvasElement)?.getContext('2d')

    // first render
    if (ctx && !this.chart) {
      this.chart = new Chart(ctx, {
        type: this.type,
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
