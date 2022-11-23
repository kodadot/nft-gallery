<template>
  <div class="price-chart">
    <div class="content">
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
const { $colorMode } = useNuxtApp()

const isDarkMode = computed(
  () =>
    $colorMode.preference === 'dark' ||
    document.documentElement.className.includes('dark-mode')
)

const props = defineProps<{
  priceChartData?: [Date, number][][]
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

const lineColor = computed(() => {
  if (isDarkMode.value) {
    return 'white'
  } else {
    return '#181717'
  }
})

const getPriceChartData = () => {
  Chart?.destroy()
  const { priceChartData } = props

  if (priceChartData?.length) {
    const ctx = (
      document?.getElementById('priceChart') as HTMLCanvasElement
    )?.getContext('2d')
    if (ctx) {
      const commonStyle = {
        tension: 0,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderJoinStyle: 'miter' as const,
        radius: 0,
        pointStyle: 'rect',
        borderWidth: 1,
      }
      const chart = new ChartJS(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Sale',
              data: getChartData(priceChartData[0]),
              borderColor: '#FF7AC3',
              pointBackgroundColor: '#FF7AC3',
              pointBorderColor: '#FF7AC3',
              ...commonStyle,
            },
            {
              label: 'List',
              data: getChartData(priceChartData[1]),
              borderColor: '#6188E7',
              pointBackgroundColor: '#6188E7',
              pointBorderColor: '#6188E7',
              ...commonStyle,
            },
          ],
        },
        options: {
          plugins: {
            customCanvasBackgroundColor: {
              color: isDarkMode.value ? '#181717' : 'white',
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
                color: lineColor.value,
              },
            },
            y: {
              ticks: {
                callback: (value) => {
                  return Number(value).toFixed(2)
                },
                maxTicksLimit: 7,
                color: lineColor.value,
              },
              grid: {
                color: lineColor.value,
              },
              title: {
                display: true,
                text: unit.value,
                color: lineColor.value,
                align: 'end',
              },
            },
          },
        },
        plugins: [
          {
            id: 'customCanvasBackgroundColor',
            beforeDraw: (chart, args, options) => {
              const { ctx } = chart
              ctx.save()
              ctx.globalCompositeOperation = 'destination-over'
              ctx.fillStyle = options.color || '#FFFFFF'
              ctx.fillRect(0, 0, chart.width, chart.height)
              ctx.restore()
            },
          },
        ],
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
