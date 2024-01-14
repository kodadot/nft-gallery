<template>
  <div class="common-price-chart" data-testid="gallery-item-chart">
    <span class="chart-y-description is-size-7">
      Price ({{ chainSymbol }})
    </span>
    <NeoDropdown class="py-0 time-range-dropdown" :mobile-modal="false">
      <template #trigger="{ active }">
        <NeoButton
          :label="selectedTimeRange.label"
          class="time-range-button"
          no-shadow
          :active="active" />
      </template>

      <NeoDropdownItem
        v-for="range in timeRangeList"
        :key="range.value"
        class="flex justify-center items-center"
        :active="selectedTimeRange.value === range.value"
        :value="selectedTimeRange"
        @click="setTimeRange({ value: range.value, label: range.label })">
        {{ range.label }}
      </NeoDropdownItem>
    </NeoDropdown>

    <NeoDropdown
      :mobile-modal="false"
      class="chart-setting-icon min-width-fit-content"
      position="bottom-left">
      <template #trigger="{ active }">
        <NeoButton no-shadow variant="icon">
          <NeoIcon
            icon="gear"
            pack="fass"
            size="large"
            :variant="!active ? 'k-grey' : undefined" />
        </NeoButton>
      </template>

      <NeoDropdownItem class="no-hover px-0 py-0">
        <div class="w-full flex justify-between items-center">
          <NeoCheckbox
            v-model="vHideOutliers"
            class="m-0 no-wrap"
            root-class="flex-auto px-4 py-3">
            {{ $t('activity.hideOutliers') }}
          </NeoCheckbox>
        </div>
      </NeoDropdownItem>
      <NeoDropdownItem class="no-hover px-0 py-0">
        <div class="w-full flex justify-between items-center">
          <NeoCheckbox
            v-model="vApplySmoothing"
            class="m-0 no-wrap"
            root-class="flex-auto px-4 py-3">
            {{ $t('activity.applySmoothing') }}
          </NeoCheckbox>
        </div>
      </NeoDropdownItem>
    </NeoDropdown>

    <div :class="{ content: !chartHeight }" :style="heightStyle">
      <Line
        ref="chart"
        :data="chartData"
        :options="chartOptions"
        :plugins="chartPlugins" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getChartDataByTimeRange } from '@/utils/chart'
import {
  NeoButton,
  NeoCheckbox,
  NeoDropdown,
  NeoDropdownItem,
  NeoIcon,
} from '@kodadot1/brick'
import { useEventListener, useVModel } from '@vueuse/core'
import {
  ChartData,
  ChartDataset,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  Point,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import zoomPlugin from 'chartjs-plugin-zoom'
import { format } from 'date-fns'
import { Line } from 'vue-chartjs'

ChartJS.register(
  zoomPlugin,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const props = defineProps<{
  priceChartData?: [Date, number][][]
  chartHeight?: string
  hideOutliers: boolean
  applySmoothing: boolean
}>()
const emit = defineEmits(['update:hideOutliers', 'update:applySmoothing'])

const { $i18n } = useNuxtApp()
const { chainSymbol } = useChain()
const { isDarkMode } = useTheme()

const timeRangeList = [
  {
    value: 0,
    label: $i18n.t('priceChart.all'),
  },
  {
    value: 14,
    label: $i18n.t('topCollections.timeFrames.week'),
  },
  {
    value: 30,
    label: $i18n.t('topCollections.timeFrames.month'),
  },
  {
    value: 90,
    label: $i18n.t('topCollections.timeFrames.quarter'),
  },
]

const selectedTimeRange = ref(timeRangeList[0])

const setTimeRange = (value: { value: number; label: string }) => {
  selectedTimeRange.value = value
}

const vHideOutliers = useVModel(props, 'hideOutliers', emit)
const vApplySmoothing = useVModel(props, 'applySmoothing', emit)

const heightStyle = computed(() =>
  props.chartHeight ? `height: ${props.chartHeight}` : '',
)
let chart = ref<InstanceType<typeof ChartJS> | null>(null)

const onWindowResize = () => {
  chart.value?.resize()
}
useEventListener(window, 'resize', onWindowResize)

const lineColor = computed(() => (isDarkMode.value ? '#fff' : '#181717'))
const gridColor = computed(() => (isDarkMode.value ? '#6b6b6b' : '#cccccc'))

const displayChartData = computed(() => {
  if (props.priceChartData) {
    const timeRangeValue = selectedTimeRange.value.value
    return [
      getChartDataByTimeRange(props.priceChartData[0], timeRangeValue),
      getChartDataByTimeRange(props.priceChartData[1], timeRangeValue),
    ]
  } else {
    return []
  }
})

const commonStyle = computed(() => {
  return {
    tension: 0.2,
    pointRadius: 6,
    pointHoverRadius: 6,
    pointHoverBackgroundColor: isDarkMode.value ? '#181717' : 'white',
    borderJoinStyle: 'round' as const,
    radius: 0,
    pointStyle: 'rect',
    borderWidth: 1,
    lineTension: 0,
  }
})

const chartData = computed<ChartData<'line', Point[], unknown>>(() => {
  if (displayChartData.value?.length) {
    const salePoints = getChartPoints(displayChartData.value[0])
    const listPoints = getChartPoints(displayChartData.value[1])
    return {
      datasets: [
        {
          label: 'Sale',
          data: salePoints,
          borderColor: '#FF7AC3',
          pointBackgroundColor: '#FF7AC3',
          pointBorderColor: '#FF7AC3',
          ...commonStyle.value,
        } as ChartDataset<'line', Point[]>,
        {
          label: 'List',
          data: listPoints,
          borderColor: '#6188E7',
          pointBackgroundColor: '#6188E7',
          pointBorderColor: '#6188E7',
          ...commonStyle.value,
        } as ChartDataset<'line', Point[]>,
      ],
    }
  }
  return {
    datasets: [],
  }
})

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  maintainAspectRatio: false,
  responsive: true,
  responsiveAnimationDuration: 0,
  transitions: {
    resize: {
      animation: {
        duration: 0,
      },
    },
  },
  plugins: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    customCanvasBackgroundColor: {
      color: isDarkMode.value ? '#181717' : 'white',
    },
    legend: {
      labels: {
        usePointStyle: true,
      },
    },
    tooltip: {
      xAlign: 'center',
      yAlign: 'top',
      callbacks: {
        label: function (context) {
          return `Price: ${context.parsed.y} ${chainSymbol.value}`
        },
        title: function (context) {
          return format(context[0].parsed.x, 'yyyy-MM-dd HH:mm')
        },
      },
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
        borderColor: lineColor.value,
        color: gridColor.value,
      },
      ticks: {
        callback: (value) => {
          return format(Number(value), 'MMM dd')
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
          return `${Number(value).toFixed(2)}  `
        },
        stepSize: 3,
        color: lineColor.value,
      },
      grid: {
        drawTicks: false,
        color: gridColor.value,
        borderColor: lineColor.value,
      },
    },
  },
}))

const chartPlugins = computed(() => [
  {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
      const { ctx } = chart
      ctx.save()
      ctx.globalCompositeOperation = 'destination-over'
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ctx.fillStyle = options.color || '#FFFFFF'
      ctx.fillRect(0, 0, chart.width, chart.height)
      ctx.restore()
    },
  },
])
</script>

<style scoped>
.content {
  height: 15rem;
}

.chart-setting-icon {
  position: absolute;
  right: 8px;
  top: -5px;
}

.min-width-fit-content {
  :deep(.o-drop__menu) {
    min-width: fit-content !important;
  }
}
</style>
