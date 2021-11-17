<template>
  <div class="price-chart mt-4">
    <div class="actions">
      <p class="label">
        {{ $t('Price Chart') }}
      </p>
      <button class="button" @click="resetZoom">Reset zoom</button>
    </div>
    <div class="pt-2 chart-div">
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
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator';

import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

const components = {};

@Component({ components })
export default class PriceChart extends Vue {
  @Prop() public priceData!: any[];

  protected chartOptionsLine: any = {};
  protected Chart!: Chart;

  protected resetZoom() {
    this.Chart.resetZoom();
  }

  protected onWindowResize() {
    if (this.Chart) {
      this.Chart.resize();
    }
  }

  protected onCanvasMouseDown() {
    document!.getElementById('collectionPriceChart')!.style.cursor = 'grabbing';
  }

  protected onCanvasMouseUp() {
    document!.getElementById('collectionPriceChart')!.style.cursor = 'auto';
  }

  protected onCanvasMouseLeave() {
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
          datasets: [
            {
              label: 'Floor Price',
              data: this.priceData[0].map((data) => ({
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
            {
              label: 'Sold NFT Price',
              data: this.priceData[1].map((data) => ({
                x: data[0],
                y: data[1],
              })),
              borderColor: '#00BB7F',
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

.chart-div {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.actions {
  display: flex;
  justify-content: space-between;
}
</style>
