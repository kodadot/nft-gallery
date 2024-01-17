<template>
  <canvas id="lineChart" ref="canvas" class="hover:cursor-grabbing" />
</template>

<script lang="ts" setup>
import type { ChartDataset } from 'chart.js'
import ChartJS from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import zoomPlugin from 'chartjs-plugin-zoom'
import annotationPlugin from 'chartjs-plugin-annotation'
import { useEventListener } from '@vueuse/core'

// register chart plugins
ChartJS.register(zoomPlugin)
ChartJS.register(annotationPlugin)

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
useEventListener(window, 'resize', onWindowResize)

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
