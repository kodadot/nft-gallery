<template>
  <div class="price-chart">
    <div class="content box">
      <canvas id="priceChart" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'

import ChartJS from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import zoomPlugin from 'chartjs-plugin-zoom'
import { getChartData } from '@/utils/chart'
import ChainMixin from '@/utils/mixins/chainMixin'
import KeyboardEventsMixin from '~/utils/mixins/keyboardEventsMixin'

ChartJS.register(zoomPlugin)

const components = {}

@Component({ components })
export default class PriceChart extends mixins(
  ChainMixin,
  KeyboardEventsMixin
) {
  @Prop() public priceChartData!: [Date, number][][]
  @Prop({ type: Boolean, default: false })
  private readonly openOnDefault!: boolean

  protected chartOptionsLine: any = {}
  protected Chart!: ChartJS<'line', any, unknown>
  protected isOpen = this.openOnDefault || false

  protected onWindowResize() {
    if (this.Chart) {
      this.Chart.resize()
    }
  }

  public async created() {
    window.addEventListener('resize', this.onWindowResize)
    this.initKeyboardEventHandler({
      e: this.bindExpandEvents,
    })
  }

  public async mounted() {
    this.getPriceChartData()
  }

  private bindExpandEvents(event) {
    if (event.key === 'p') {
      this.isOpen = !this.isOpen
    }
  }

  protected getPriceChartData() {
    this.Chart?.destroy()

    if (this.priceChartData?.length) {
      const ctx = (
        document?.getElementById('priceChart') as HTMLCanvasElement
      )?.getContext('2d')
      if (ctx) {
        const chart = new ChartJS(ctx, {
          type: 'line',
          data: {
            datasets: [
              {
                label: 'Sale',
                data: getChartData(this.priceChartData[0]),
                borderColor: '#FF7AC3',
                tension: 0,
                pointBackgroundColor: '#FF7AC3',
                pointBorderColor: '#FF7AC3',
                pointRadius: 4,
                pointHoverRadius: 6,
                borderJoinStyle: 'miter',
              },
              {
                label: 'List',
                data: getChartData(this.priceChartData[1]),
                borderColor: '#6188E7',
                tension: 0,
                pointBackgroundColor: '#6188E7',
                pointBorderColor: '#6188E7',
                pointRadius: 4,
                pointHoverRadius: 6,
                borderJoinStyle: 'miter',
              },
            ],
          },
          options: {
            plugins: {
              zoom: {
                limits: {
                  x: { min: 0, minRange: 0 },
                  y: { min: 0, minRange: 0 },
                },
                pan: {
                  enabled: false,
                },
                zoom: {
                  wheel: {
                    enabled: false,
                  },
                  pinch: {
                    enabled: false,
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
                  displayFormats: {
                    hour: 'HH:mm',
                    minute: 'HH:mm',
                  },
                  unit: 'hour',
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
                  color: 'black',
                },
              },
              y: {
                ticks: {
                  callback: (value) => {
                    return `${Number(value).toFixed(2)} ${this.unit}`
                  },
                  maxTicksLimit: 7,
                  color: 'black',
                },
                grid: {
                  color: 'black',
                },
              },
            },
          },
        })

        this.Chart = chart
      }
    }
  }
  @Watch('priceChartData')
  async watchData() {
    this.getPriceChartData()
  }
}
</script>
