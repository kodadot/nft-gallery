<template>
  <v-chart class="chart" :option="option" />
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { min } from 'date-fns/esm'

use([
  GridComponent,
  SVGRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])

const data = [
  ['2000-06-05', 116],
  ['2000-06-06', 129],
  ['2000-06-07', 135],
  ['2000-06-08', 86],
  ['2000-06-09', 73],
  ['2000-06-10', 85],
  ['2000-06-11', 73],
  ['2000-06-12', 68],
  ['2000-06-13', 92],
  ['2000-06-14', 130],
  ['2000-06-15', 245],
  ['2000-06-16', 139],
  ['2000-06-17', 115],
  ['2000-06-18', 111],
  ['2000-06-19', 309],
  ['2000-06-20', 206],
  ['2000-06-21', 137],
  ['2000-06-22', 128],
  ['2000-06-23', 85],
  ['2000-06-24', 94],
  ['2000-06-25', 71],
  ['2000-06-26', 106],
  ['2000-06-27', 84],
  ['2000-06-28', 93],
  ['2000-06-29', 85],
  ['2000-06-30', 73],
  ['2000-07-01', 83],
  ['2000-07-02', 125],
  ['2000-07-03', 107],
  ['2000-07-04', 82],
  ['2000-07-05', 44],
  ['2000-07-06', 72],
  ['2000-07-07', 106],
  ['2000-07-08', 107],
  ['2000-07-09', 66],
  ['2000-07-10', 91],
  ['2000-07-11', 92],
  ['2000-07-12', 113],
  ['2000-07-13', 107],
  ['2000-07-14', 131],
  ['2000-07-15', 111],
  ['2000-07-16', 64],
  ['2000-07-17', 69],
  ['2000-07-18', 88],
  ['2000-07-19', 77],
  ['2000-07-20', 83],
  ['2000-07-21', 111],
  ['2000-07-22', 57],
  ['2000-07-23', 55],
  ['2000-07-24', 60],
]

const dateList = data.map(function (item) {
  return item[0]
})
const valueList = data.map(function (item) {
  return item[1]
})

const option = {
  xAxis: {
    type: 'category',
    data: dateList,
    show: false,
  },
  yAxis: {
    type: 'value',
    show: false,
    data: valueList,
    min: 50,
    max: 350,
  },
  series: [
    {
      data: valueList,
      type: 'line',
      smooth: 0.3,
      showSymbol: false,
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

@Component({
  components: { VChart },
})
export default class MiniHistory extends Vue {
  data() {
    return {
      option,
    }
  }
}
</script>

<style scoped>
.chart {
  width: 200px;
  height: 100px;
  cursor: default;
}
</style>
