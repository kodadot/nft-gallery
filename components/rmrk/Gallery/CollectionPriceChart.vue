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
        id="collectionPriceChart"
        @mousedown="onCanvasMouseDown"
        @mouseup="onCanvasMouseUp"
        @mouseleave="onCanvasMouseLeave" />
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
  mapToAverage,
  getCollectionMedian,
  getMovingAverage,
} from '@/utils/chart'

Chart.register(zoomPlugin)
Chart.register(annotationPlugin)

const components = {}

@Component({ components })
export default class PriceChart extends mixins(ChainMixin) {
  @Prop({ type: Array, required: true }) public priceData!: [
    ChartData[],
    ChartData[]
  ] // [listings, buys]

  protected chartOptionsLine: any = {}
  protected Chart!: Chart<'line', any, unknown>

  @Debounce(200)
  protected resetZoom(): void {
    this.Chart.resetZoom()
  }

  protected onWindowResize() {
    if (this.Chart) {
      this.Chart.resize()
    }
  }

  protected onCanvasMouseDown(): void {
    document!.getElementById('collectionPriceChart')!.style.cursor = 'grabbing'
  }

  protected onCanvasMouseUp(): void {
    document!.getElementById('collectionPriceChart')!.style.cursor = 'auto'
  }

  protected onCanvasMouseLeave(): void {
    document!.getElementById('collectionPriceChart')!.style.cursor = 'auto'
  }

  public async created() {
    window.addEventListener('resize', this.onWindowResize)
  }

  public async mounted() {
    this.priceChart()
  }

  protected priceChart() {
    if (this.priceData.length) {
      const ctx = (
        document?.getElementById('collectionPriceChart') as HTMLCanvasElement
      )?.getContext('2d')

      if (ctx) {
        const median = getCollectionMedian(this.priceData[1])
        const chart = new Chart(ctx, {
          type: 'line',

          data: {
            labels: this.priceData[1].map(getLabel),
            datasets: [
              {
                label: 'Floor Price',
                data: getCollectionChartData(this.priceData[0]),
                borderColor: '#d32e79',
                ...baseLineOptions,
              },
              {
                label: 'Sold NFT Price',
                data: getCollectionChartData(this.priceData[1]),
                borderColor: '#00BB7F',
                ...baseLineOptions,
              },
              {
                label: 'Trailing Average',
                data: getMovingAverage(
                  getCollectionChartData(this.priceData[1], mapToAverage)
                ) as any,
                borderColor: 'yellow',
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
                    return `Count: ${
                      (dataset.data[dataIndex] as any).count || 0
                    }`
                  },
                },
              },
              annotation: {
                annotations: {
                  median: {
                    type: 'line',
                    yMin: median,
                    yMax: median,
                    borderColor: '#00BB7F',
                    borderWidth: 2,
                    borderDash: [10, 5],
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

        this.Chart = chart
      }
    }
  }

  @Watch('priceData')
  async watchData(newPriceData: string[], oldPriceData: string[]) {
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
    height: 656px;
  }
}
</style>
