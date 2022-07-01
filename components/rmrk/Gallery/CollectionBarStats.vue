<template>
  <div class="price-chart mt-4">
    <div class="is-flex is-align-items-center is-justify-content-space-between">
      <p class="label">
        {{ $t('Chart') }}
      </p>
      <b-button type="is-primary" @click="resetZoom">Reset zoom</b-button>
    </div>
    <div class="chart-container mt-5">
      <canvas
        id="collectionPriceBar"
        @mousedown="onCanvasMouseDownBar('collectionPriceBar')"
        @mouseup="onCanvasMouseUpBar('collectionPriceBar')"
        @mouseleave="onCanvasMouseLeaveBar('collectionPriceBar')" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Prop, Watch } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import zoomPlugin from 'chartjs-plugin-zoom'
import annotationPlugin from 'chartjs-plugin-annotation'
import ChainMixin from '@/utils/mixins/chainMixin'

const baseLineOptions = {
  tension: 0.3,
  pointBackgroundColor: 'white',
  pointBorderColor: 'blue',
  pointRadius: 4,
  pointHoverRadius: 6,
}

import {
  getCollectionChartData,
  getLabel,
  CollectionChartData as ChartData,
} from '@/utils/chart'
import ChartMixin from '~/utils/mixins/chartMixin'

Chart.register(zoomPlugin)
Chart.register(annotationPlugin)

const components = {}

@Component({ components })
export default class PriceChart extends mixins(ChainMixin, ChartMixin) {
  @Prop({ type: Array, required: true }) public priceData!: [
    ChartData[],
    ChartData[]
  ] // [listings, buys]

  protected chartOptionsLine: any = {}
  protected ChartBar!: Chart<'line' | 'bar', any, unknown>

  @Debounce(200)
  protected resetZoom(): void {
    this.ChartBar.resetZoom()
  }

  protected onWindowResize() {
    if (this.ChartBar) {
      this.ChartBar.resize()
    }
  }

  public async created() {
    window.addEventListener('resize', this.onWindowResize)
  }

  public async beforeDestroy() {
    this.ChartBar.destroy()
    window.removeEventListener('resize', this.onWindowResize)
  }

  public async mounted() {
    this.priceChart()
  }

  protected priceChart() {
    if (this.priceData.length) {
      const ctxBar = (
        document?.getElementById('collectionPriceBar') as HTMLCanvasElement
      )?.getContext('2d')

      if (ctxBar) {
        const chart = new Chart(ctxBar, {
          type: 'bar',

          data: {
            labels: this.priceData[1].map(getLabel),
            datasets: [
              {
                label: 'Listing Price',
                data: getCollectionChartData(this.priceData[0]),
                borderColor: '#d32e79',
                // hidden: true,
                // borderWidth: 1,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
              },
              {
                label: 'Sold Price',
                data: getCollectionChartData(this.priceData[1]),
                borderColor: '#00BB7F',
                type: 'line',
                ...baseLineOptions,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  afterLabel: ({ dataIndex, dataset }) => {
                    let count = (dataset.data[dataIndex] as any).count || 0
                    let avg = (dataset.data[dataIndex] as any).average
                    let price = (dataset.data[dataIndex] as any).value
                    if (avg) {
                      if (price) {
                        return `Price : ${price}
                        Count: ${count}
                        Average : ${avg}`
                      }
                      return `Count: ${count}
                      Average : ${avg}`
                    }

                    if (price) {
                      return `Price : ${price}
                      Count: ${count}`
                    }

                    return `Count: ${count}`
                  },
                },
              },
              zoom: {
                limits: {
                  x: { min: 0 },
                  y: { min: 0 },
                },
                pan: {
                  enabled: true,
                },
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  pinch: {
                    enabled: true,
                  },
                  mode: 'xy',
                  onZoomComplete({ chart }) {
                    chart.update('none')
                  },
                },
              },
            },
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day',
                  stepSize: 7,
                },
                grid: {
                  drawOnChartArea: false,
                  drawTicks: false,
                  drawBorder: false,
                },
                ticks: {
                  callback: (value) => {
                    return value
                  },
                  major: {
                    enabled: true,
                  },
                  maxRotation: 0,
                  minRotation: 0,
                  color: '#fff',
                },
              },
              y: {
                ticks: {
                  callback: (value) => {
                    return `${Number(value).toFixed(2)} ${this.unit}`
                  },
                  maxTicksLimit: 7,

                  color: '#fff',
                },
                grid: {
                  color: '#3a3a3a',
                },
              },
            },
          },
        })

        this.ChartBar = chart
      }
    }
  }

  @Watch('priceData')
  async watchData() {
    this.priceChart()
  }
}
</script>

<style scoped lang="scss">
@import 'bulma/sass/utilities/mixins.sass';

.chart-container {
  position: relative;
  height: 45vh;
  width: 100%;
}
@media screen and (orientation: landscape) {
  .chart-container {
    height: 80vh;
  }
}
@include tablet-only {
  .chart-container {
    height: 80vh;
  }
}
@include desktop {
  .chart-container {
    height: 456px;
  }
}
</style>
