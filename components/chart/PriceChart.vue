<template>
  <div class="price-chart">
    <div class="content box">
      <canvas id="priceChart" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChartJS from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import zoomPlugin from 'chartjs-plugin-zoom'
import { getChartData } from '@/utils/chart'
import useChain from '@/composables/useChain'

ChartJS.register(zoomPlugin)

const props = defineProps<{
  priceChartData?: [Date, number][][]
  dataKey?: number
}>()
let Chart: ChartJS<'line', any, unknown>
const { unit } = useChain()

onMounted(() => {
  window.addEventListener('resize', onWindowResize)
  getPriceChartData()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
})

const getPriceChartData = () => {
  Chart?.destroy()
  const { priceChartData } = props

  if (priceChartData?.length) {
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
              data: getChartData(priceChartData[0]),
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
              data: getChartData(priceChartData[1]),
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
            annotation: {
              annotations: [],
            },
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
                  return `${Number(value).toFixed(2)} ${unit}`
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

      Chart = chart
    }
  }
}

watch(
  () => props.priceChartData,
  () => {
    getPriceChartData()
  }
)

const onWindowResize = () => {
  Chart?.resize()
}
</script>
