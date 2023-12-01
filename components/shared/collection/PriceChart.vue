<template>
  <div class="price-chart mt-4">
    <div class="is-flex is-align-items-center is-justify-content-space-between">
      <p class="label">
        {{ $t('Chart') }}
      </p>
      <NeoButton variant="primary" no-shadow @click="emit('resetZoom')">
        Reset zoom
      </NeoButton>
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

<script lang="ts" setup>
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
import LineChart from '@/components/shared/chart/LineChart.vue'

const props = defineProps<{
  priceData: [ChartData[], ChartData[]] // [listings, buys]
}>()
const emit = defineEmits(['resetZoom'])

const { unit } = useChain()

const labels = ref<Date[]>([])
const datasets = ref<ChartDataset[]>([])
const options = ref({})

onMounted(() => {
  priceChart()
})

watch(
  () => props.priceData,
  () => priceChart,
)

const priceChart = () => {
  if (props.priceData[0]?.length || props.priceData[1]?.length) {
    const median = getCollectionMedian(props.priceData[1])
    const labelsListing = props.priceData[0].map(getLabel)
    const labelsBuy = props.priceData[1].map(getLabel)

    labels.value = [...new Set([...labelsListing, ...labelsBuy])]
    datasets.value = [
      {
        label: 'Floor Price',
        data: getCollectionChartData(props.priceData[0]) as any,
        borderColor: '#d32e79',
        ...baseLineOptions,
      },
      {
        label: 'Sold NFT Price',
        data: getCollectionChartData(props.priceData[1]),
        borderColor: '#00BB7F',
        ...baseLineOptions,
      },
    ]

    if (props.priceData[1][0]?.average) {
      datasets.value.push({
        label: 'Trailing Average',
        data: getMovingAverage(
          getCollectionChartData(props.priceData[1], mapToAverage),
        ),
        borderColor: 'yellow',
        ...baseLineOptions,
      })
    }

    options.value = {
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          xAlign: 'center',
          yAlign: 'top',
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
              return `${Number(value).toFixed(2)} ${unit.value}`
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
