<template>
  <b-collapse
    :open="isOpen"
    class="card bordered"
    animation="slide"
    aria-id="contentIdForHistory"
  >
    <template #trigger="props">
      <div
        class="card-header"
        role="button"
        aria-controls="contentIdForHistory"
      >
        <p class="card-header-title">
          {{ $t('Price Chart') }}
        </p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'chevron-up' : 'chevron-down'"> </b-icon>
        </a>
      </div>
    </template>
    <div class="price-chart">
      <div class="content box">
        <canvas id="priceChart" />
      </div>
    </div>
  </b-collapse>
</template>

<script lang="ts">
import { Component, mixins, Prop, Watch } from 'nuxt-property-decorator';

import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';
import zoomPlugin from 'chartjs-plugin-zoom';
import { getChartData } from '@/utils/chart';
import ChainMixin from '@/utils/mixins/chainMixin';

Chart.register(zoomPlugin);

const components = {};

@Component({ components })
export default class PriceChart extends mixins(ChainMixin) {
  @Prop() public priceChartData!: [Date, number][][];
  @Prop({ type: Boolean, default: false })
  private readonly openOnDefault!: boolean;

  protected chartOptionsLine: any = {};
  protected Chart!: Chart<'line', any, unknown>;
  protected isOpen = this.openOnDefault;

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
    if (this.Chart) this.Chart.destroy();

    if (this.priceChartData.length) {
      const ctx = (
        document?.getElementById('priceChart') as HTMLCanvasElement
      )?.getContext('2d');
      if (ctx) {
        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            datasets: [
              {
                label: 'Buy',
                data: getChartData(this.priceChartData[0]),
                borderColor: '#00b37a',
                tension: 0.3,
                pointBackgroundColor: 'white',
                pointBorderColor: 'blue',
                pointRadius: 4,
                pointHoverRadius: 6,
              },
              {
                label: 'List',
                data: getChartData(this.priceChartData[1]),
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
  }

  @Watch('priceChartData')
  async watchData(newPriceData: string[], oldPriceData: string[]) {
    this.getPriceChartData();
  }
}
</script>
