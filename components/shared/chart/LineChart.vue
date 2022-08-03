<template>
  <canvas ref="canvas" />
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import zoomPlugin from 'chartjs-plugin-zoom'
import annotationPlugin from 'chartjs-plugin-annotation'

// mixins
import ChartMixin from './chartMixin'

// register chart plugins
Chart.register(zoomPlugin)
Chart.register(annotationPlugin)

@Component
export default class LineChart extends mixins(ChartMixin) {
  @Debounce(200)
  protected resetZoom() {
    this.chart.resetZoom()
  }

  protected onWindowResize() {
    if (this.chart) {
      this.chart.resize()
    }
  }

  public async created() {
    window.addEventListener('resize', this.onWindowResize)
    this.$parent.$on('resetZoom', this.resetZoom)
  }
}
</script>

<style scoped lang="scss">
canvas:active {
  cursor: grabbing;
}
</style>
