<template>
  <div class="price-chart">
    <p class="label">
      {{ $t('Price Chart') }}
    </p>
    <div
      id="chart"
      ref="chart"
      class="echart"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'

import * as ECharts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { TooltipComponent } from 'echarts/components'
import { DataZoomComponent } from 'echarts/components'

ECharts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition, TooltipComponent, DataZoomComponent])

// type EChartsOption = ECharts.ComposeOption<
//   GridComponentOption | LineSeriesOption
// >;


const components = {
  // chart: () => ECharts,
}

@Component({ components })
export default class PriceChart extends Vue {
  @Prop() public priceData!: any[];
  // @Prop() public eventData!: Date[];

  protected chartOptionsLine: any = {};
  protected Chart!: ECharts.ECharts;
  // protected date: any = [];
  // protected UTCDate: any = {};

  protected onWindowResize() {
    if (this.Chart) {
      this.Chart.resize({ width: 'auto', height: 400 })
    }
  }

  public async created() {
    window.addEventListener('resize', this.onWindowResize)
  }

  public async mounted() {
    // console.log(this.priceData)
    this.priceChart()
  }

  protected priceChart() {
    // this.createDate();
    // console.log(document.documentElement.clientWidth);
    this.Chart = ECharts.init(this.$refs.chart as HTMLElement)
    this.Chart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (params: { data: string[] }) => {
          const date = this.parseDate(
            params.data[0] as unknown as Date
          )
          const price = params.data[1] + ' KSM'
          return '<center>' + date + '<br>' + price + '</center>'
        },
        backgroundColor: '#363636',
        textStyle: {
          color: '#fff',
          fontFamily: 'Fira Code',
        },
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLabel: {
          fontFamily: 'Fira Code',
          color: '#fff',
          hideOverlap: true,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} KSM',
          fontFamily: 'Fira Code',
          color: '#fff',
        },
        splitLine: {
          lineStyle: {
            color: '#f8f8f8',
            opacity: '.2'
          }
        },
        nameTextStyle: {
          color: '#fff',
          fontFamily: 'Fira Code',
        },
      },
      dataZoom: {
        type: 'slider',
        bottom: '2%',
      },
      series: [
        {
          name: 'priceHistory',
          type: 'line',
          smooth: 'true',
          lineStyle: {
            color: '#d32e79',
          },
          data: this.priceData,
        },
      ],
    })

    this.Chart.resize({ width: 'auto', height: 400 })
  }

  protected parseDate(date: Date) {
    const utcDate: string = date.toUTCString()
    return utcDate.substring(4)
  }

  protected formatDate(date: Date) {
    const yyyy = date.getUTCFullYear()
    const mm = this.padDigits(date.getUTCMonth() + 1)
    const dd = this.padDigits(date.getUTCDate())
    const hrs = this.padDigits(date.getUTCHours())
    const mins = this.padDigits(date.getUTCMinutes())
    const secs = this.padDigits(date.getUTCSeconds())
    const YYYY_MM_DD_HRS_MINS_SECS =
      yyyy + '/' + mm + '/' + dd + '\n' + hrs + ':' + mins + ':' + secs
    return YYYY_MM_DD_HRS_MINS_SECS
  }

  protected padDigits(time: number) {
    return time.toString().padStart(2, '0')
  }

  @Watch('priceData')
  async watchData(newPriceData: string[], oldPriceData: string[]) {
    // console.log(this.priceData)
    this.priceChart()
  }
}
</script>
