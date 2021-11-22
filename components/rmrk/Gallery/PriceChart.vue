<template>
  <div class="price-chart">
    <div>
      <p class="label">
        {{ $t('Price Chart') }}
      </p>
    </div>
    <div class="mt-2">
      <canvas id="priceChart" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator';

import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

const components = {};

type PriceDataArray = [Date, string | number];

@Component({ components })
export default class PriceChart extends Vue {
  @Prop() public priceChartData!: [Date, number][][];

  protected chartOptionsLine: any = {};
  protected Chart!: Chart<'line', any, unknown>;

  protected onWindowResize() {
    if (this.Chart) {
      this.Chart.resize();
    }
  }

  public async created() {
    window.addEventListener('resize', this.onWindowResize);
  }

  public async mounted() {
    this.getPriceChartData();
  }

  protected getPriceChartData() {
    console.log(this.priceChartData);
    if (this.priceChartData.length) {
      const ctx = (
        document?.getElementById('priceChart') as HTMLCanvasElement
      )?.getContext('2d')!;
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Buy',
              data: this.priceChartData[0].map((data: PriceDataArray) => ({
                x: data[0],
                y: data[1],
              })),
              borderColor: '#00b37a',
              tension: 0.3,
              pointBackgroundColor: 'white',
              pointBorderColor: 'blue',
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: 'List',
              data: this.priceChartData[1].map((data: PriceDataArray) => ({
                x: data[0],
                y: data[1],
              })),
              borderColor: '#d32e79',
              tension: 0.3,
              pointBackgroundColor: 'white',
              pointBorderColor: 'blue',
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          plugins: {
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
                  chart.update('none');
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
                  return `${Number(value).toFixed(2)} KSM`;
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

  @Watch('priceChartData')
  async watchData(newPriceData: string[], oldPriceData: string[]) {
    this.getPriceChartData();
  }
}
</script>
