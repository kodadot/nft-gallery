<template>
  <div class="price-chart">
    <p class="label">
      {{ $t('Price Chart') }}
    </p>
    <div class="pt-2">
      <canvas id="priceChart2" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator';

import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';

const components = {};

@Component({ components })
export default class PriceChart extends Vue {
  @Prop() public priceData!: any[];

  protected chartOptionsLine: any = {};
  protected Chart!: Chart;

  protected onWindowResize() {
    if (this.Chart) {
      this.Chart.resize();
    }
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
        document?.getElementById('priceChart2') as HTMLCanvasElement
      )?.getContext('2d')!;
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Price',
              data: this.priceData.map((data) => ({ x: data[0], y: data[1] })),
              borderColor: '#d32e79',
              tension: 0.3,
              pointBackgroundColor: 'white',
              pointBorderColor: 'blue',
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              labels: {
                filter: function (item, chart) {
                  return !item.text.includes('Price');
                },
              },
            },
          },
          scales: {
            x: {
              type: 'time',
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

  @Watch('priceData')
  async watchData(newPriceData: string[], oldPriceData: string[]) {
    this.priceChart();
  }
}
</script>

<style scoped>
.pt-2 {
  padding-top: 2rem;
}
</style>
