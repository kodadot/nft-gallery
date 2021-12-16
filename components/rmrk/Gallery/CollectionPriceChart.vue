<template>
  <div class="price-chart mt-4">
    <div class="is-flex is-align-items-center is-justify-content-space-between">
      <p class="label">
        {{ $t('Price Chart') }}
      </p>
      <b-button type="is-primary" @click="resetZoom">Reset zoom</b-button>
    </div>
    <div class="chart-container mt-5">
      <canvas
        id="collectionPriceChart"
        @mousedown="onCanvasMouseDown"
        @mouseup="onCanvasMouseUp"
        @mouseleave="onCanvasMouseLeave"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Prop, Watch } from 'nuxt-property-decorator';
import { Debounce } from 'vue-debounce-decorator';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChainMixin from '@/utils/mixins/chainMixin';

import { getChartData, getMedianPoint, getMovingAverage } from '@/utils/chart';

Chart.register(zoomPlugin);
Chart.register(annotationPlugin);

const components = {};

@Component({ components })
export default class PriceChart extends mixins(ChainMixin) {
  @Prop() public priceData!: [Date, number][][];

  protected chartOptionsLine: any = {};
  protected Chart!: Chart<'line', any, unknown>;

  @Debounce(200)
  protected resetZoom(): void {
    this.Chart.resetZoom();
  }

  protected onWindowResize() {
    if (this.Chart) {
      this.Chart.resize();
    }
  }

  protected onCanvasMouseDown(): void {
    document!.getElementById('collectionPriceChart')!.style.cursor = 'grabbing';
  }

  protected onCanvasMouseUp(): void {
    document!.getElementById('collectionPriceChart')!.style.cursor = 'auto';
  }

  protected onCanvasMouseLeave(): void {
    document!.getElementById('collectionPriceChart')!.style.cursor = 'auto';
  }

  public async created() {
    window.addEventListener('resize', this.onWindowResize);
  }

  public async mounted() {
    this.priceChart();
  }

  protected priceChart() {
    if (this.priceData.length) {
      const ctx = (
        document?.getElementById('collectionPriceChart') as HTMLCanvasElement
      )?.getContext('2d')!;

      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.priceData[1].map((item) => item[0]),
          datasets: [
            {
              label: 'Floor Price',
              data: getChartData(this.priceData[0]),
              borderColor: '#d32e79',
              tension: 0.3,
              pointBackgroundColor: 'white',
              pointBorderColor: 'blue',
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: 'Sold NFT Price',
              data: getChartData(this.priceData[1]),
              borderColor: '#00BB7F',
              tension: 0.3,
              pointBackgroundColor: 'white',
              pointBorderColor: 'blue',
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: 'Trailing Average',
              data: getMovingAverage(this.priceData[1]) as any,
              borderColor: 'yellow',
              tension: 0.3,
              pointBackgroundColor: 'white',
              pointBorderColor: 'blue',
              pointRadius: 0,
              pointHoverRadius: 0,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            annotation: {
              annotations: {
                median: {
                  type: 'line',
                  yMin: getMedianPoint(this.priceData[1]),
                  yMax: getMedianPoint(this.priceData[1]),
                  borderColor: '#00BB7F',
                  borderWidth: 2,
                  borderDash: [10, 5],
                },
              },
            },
            zoom: {
              limits: {
                x: { min: 0 },
                y: { min: 0 },
              },
              pan: {
                enabled: true,
              },
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: 'xy',
                onZoomComplete({ chart }) {
                  chart.update('none');
                },
              },
            },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                stepSize: 7,
              },
              grid: {
                drawOnChartArea: false,
                drawTicks: false,
                drawBorder: false,
              },
              ticks: {
                callback: (value) => {
                  return value;
                },
                major: {
                  enabled: true,
                },
                maxRotation: 0,
                minRotation: 0,
                color: '#fff',
              },
            },
            y: {
              ticks: {
                callback: (value) => {
                  return `${Number(value).toFixed(2)} ${this.unit}`;
                },
                maxTicksLimit: 7,

                color: '#fff',
              },
              grid: {
                color: '#3a3a3a',
              },
            },
          },
        },
      });

      this.Chart = chart;
    }
  }

  @Watch('priceData')
  async watchData(newPriceData: string[], oldPriceData: string[]) {
    this.priceChart();
  }
}
</script>

<style scoped lang="scss">
@import "bulma/sass/utilities/mixins.sass";

.chart-container {
  position: relative;
  height: 400px; 
  width: 100%
}
@include desktop {
  .chart-container {
    height: 656px; 
  }
}
</style>
