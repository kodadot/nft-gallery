<template>
  <canvas id="lineChart" ref="canvas" />
</template>

<script lang="ts" setup>
import ChartJS from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import type { ChartDataset } from 'chart.js'
import { useEventListener } from '@vueuse/core'

onMounted(async () => {
  const { default: zoomPlugin } = await import('chartjs-plugin-zoom')
  const { default: annotationPlugin } = await import(
    'chartjs-plugin-annotation'
  )

  ChartJS.register(zoomPlugin)
  ChartJS.register(annotationPlugin)
})

const props = defineProps<{
  labels?: string[]
  datasets?: ChartDataset[]
  options?: []
}>()

const Chart = ref<ChartJS<'line', any, unknown>>()

onMounted(() => {
  renderChart()
})

const onWindowResize = () => {
  Chart.value?.resize()
}

if (process.client) {
  useEventListener(window, 'resize', onWindowResize)
}

const renderChart = () => {
  Chart.value?.destroy()
  // const ctx = (this.$refs.canvas as HTMLCanvasElement)?.getContext('2d')
  const ctx = (
    document?.getElementById('lineChart') as HTMLCanvasElement
  )?.getContext('2d')

  // first render
  if (ctx && !Chart.value) {
    Chart.value = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: props.labels,
        datasets: props.datasets,
      },
      options: props.options,
    })
  }

  // update chart
  if (ctx && Chart.value) {
    Chart.value.data.labels = props.labels
    Chart.value.data.datasets = props.datasets
    Chart.value.options = props.options
    Chart.value.update()
  }
}
</script>

<style scoped lang="scss">
canvas:active {
  cursor: grabbing;
}
</style>
