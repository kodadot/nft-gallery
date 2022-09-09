<template>
  <div class="price-chart mt-4">
    <div class="is-flex is-align-items-center is-justify-content-space-between">
      <p class="label">
        {{ $t('Chart') }}
      </p>
      <b-button type="is-primary" @click="resetZoom">Reset zoom</b-button>
    </div>
    <div class="chart-container mt-5">
      <LineChart
        ref="lineChart"
        :datasets="datasets"
        :labels="labels"
        :options="options" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
import ChainMixin from '@/utils/mixins/chainMixin'

const baseLineOptions = {
  tension: 0.3,
  pointBackgroundColor: 'white',
  pointBorderColor: 'blue',
  pointRadius: 4,
  pointHoverRadius: 6,
}

import {
  CollectionChartData as ChartData,
  getCollectionChartData,
  getCollectionMedian,
  getLabel,
  getMovingAverage,
  mapToAverage,
} from '@/utils/chart'

// types
import type { ChartDataset } from 'chart.js'

@Component({
  components: {
    LineChart: () => import('@/components/shared/chart/LineChart.vue'),
  },
})
export default class PriceChart extends mixins(ChainMixin) {
  @Prop({ type: Array, required: true }) public priceData!: [
    ChartData[],
    ChartData[]
  ] // [listings, buys]

  protected labels: Date[] = []
  protected datasets: ChartDataset[] = []
  protected options = {}

  protected resetZoom() {
    this.$emit('resetZoom')
  }

  protected async mounted() {
    this.priceChart()
  }

  protected priceChart() {
    if (this.priceData[0]?.length || this.priceData[1]?.length) {
      const median = getCollectionMedian(this.priceData[1])
      const labelsListing = this.priceData[0].map(getLabel)
      const labelsBuy = this.priceData[1].map(getLabel)

      this.labels = [...new Set([...labelsListing, ...labelsBuy])]
      this.datasets = [
        {
          label: 'Floor Price',
          data: getCollectionChartData(this.priceData[0]) as any,
          borderColor: '#d32e79',
          ...baseLineOptions,
        },
        {
          label: 'Sold NFT Price',
          data: getCollectionChartData(this.priceData[1]),
          borderColor: '#00BB7F',
          ...baseLineOptions,
        },
      ]

      if (this.priceData[1][0]?.average) {
        this.datasets.push({
          label: 'Trailing Average',
          data: getMovingAverage(
            getCollectionChartData(this.priceData[1], mapToAverage)
          ),
          borderColor: 'yellow',
          ...baseLineOptions,
        })
      }

      this.options = {
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              afterLabel: ({ dataIndex, dataset }) => {
                return `Count: ${dataset.data[dataIndex]?.count || 0}`
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
            pan: {
              enabled: false,
            },
            zoom: {
              drag: {
                enabled: true,
                backgroundColor: '',
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
            },
            ticks: {
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
      }
    }
  }

  @Watch('priceData')
  watchData() {
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
