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
    return {
      option: {
        xAxis: {
          type: 'category',
          data: [],
          show: false,
        },
        yAxis: {
          type: 'value',
          show: false,
          data: [],
          min: 0,
          max: 100,
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
      },
    }
  }

  public async created() {
    const { xAxis, yAxis } = this.$data.option
    this.$data.option.xAxis = {
      ...xAxis,
      data: this.xAxisList,
    }
    this.$data.option.yAxis = {
      ...yAxis,
      data: this.yAxisList,
      min: Math.min(...this.$props.yAxisList) - 1,
      max: Math.max(...this.$props.yAxisList) + 1,
    }
    this.$data.option.series[0].data = this.yAxisList
  }
}
</script>
