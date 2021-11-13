<template>
  <div class="price-chart">
    <p class="label">
      {{ $t('Price Chart') }}
    </p>
    <div class="actions">
      <p>Drag to pan. Scroll or pinch to zoom.</p>
      <button class="button cursor-pointer" @click="resetZoom">
        Reset Zoom
      </button>
    </div>
    <div class="pt-2">
      <canvas
        id="priceChart"
        @mouseleave="onCanvasMouseLeave"
        @mousedown="onCanvasMouseDown"
        @mouseup="onCanvasMouseUp"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator';

import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';
import * as luxon from 'luxon';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

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

  protected resetZoom() {
    if (this.Chart) {
      this.Chart.resetZoom();
    }
  }

  protected onCanvasMouseDown() {
    document!.getElementById('priceChart')!.style.cursor = 'grabbing';
  }

  protected onCanvasMouseUp() {
    document!.getElementById('priceChart')!.style.cursor = 'auto';
  }

  protected onCanvasMouseLeave() {
    document!.getElementById('priceChart')!.style.cursor = 'auto';
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
        document?.getElementById('priceChart') as HTMLCanvasElement
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
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          plugins: {
            zoom: {
              pan: {
                enabled: true,
                mode: 'xy',
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
                  // This update is needed to display up to date zoom level in the title.
                  // Without this, previous zoom level is displayed.
                  // The reason is: title uses the same beforeUpdate hook, and is evaluated before zoom.
                  chart.update('none');
                },
              },
            },
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
              time: {
                displayFormats: {
                  hour: 'HH:mm',
                  minute: 'HH:mm',
                },
                minUnit: 'hour',
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
.actions {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.cursor-pointer {
  cursor: pointer;
}

.pt-2 {
  padding-top: 2rem;
}
</style>
