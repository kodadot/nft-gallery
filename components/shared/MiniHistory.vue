<template>
  <v-chart class="chart" :option="option" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  GridComponent,
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])

type DataList = Array<string>
type ValueList = Array<number>

@Component({
  components: { VChart },
})
export default class MiniHistory extends Vue {
  @Prop() public xAxisList!: DataList
  @Prop() public yAxisList!: ValueList

  data() {
    let option = {
      xAxis: {
        type: 'category',
        data: this.xAxisList,
        show: false,
      },
      yAxis: {
        type: 'value',
        show: false,
        data: [],
        min: -1,
        max: 1,
      },
      series: [
        {
          data: [],
          type: 'line',
          smooth: 0.3,
          showSymbol: false,
          animation: false,
          lineStyle: {
            width: 2.5,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#a3cf06', // color at 0%
                },
                {
                  offset: 1,
                  color: 'green', // color at 100%
                },
              ],
              global: false, // default is false
            },
          },
        },
      ],
    }

    return {
      option,
    }
  }
  private get min() {
    return Math.min(...this.yAxisList) - 1
  }

  private get max() {
    return Math.max(...this.yAxisList) + 1
  }

  private get seriesData() {
    return this.yAxisList
  }

  public async created() {
    const { xAxis, yAxis } = this.option
    xAxis.data = this.xAxisList
    yAxis.data = this.seriesData
    yAxis.min = this.min
    yAxis.max = this.max
    this.$set(this.option.series[0], 'data', this.seriesData)
  }
}
</script>
