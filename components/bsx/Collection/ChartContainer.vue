<template>
  <div>
    <LineChart :datasets="datasets" :labels="labels" :options="options" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    LineChart: () => import('@/components/shared/chart/LineChart.vue'),
  },
})
export default class ChartContainer extends Vue {
  protected labels = ['2022']
  protected datasets = [
    {
      label: 'Dataset 1',
      backgroundColor: 'rgba(255,0,0,0.5)',
      borderColor: 'red',
      borderWidth: 1,
      outlierColor: '#999999',
      padding: 10,
      itemRadius: 0,
      data: [
        [
          0.294, 0.294, 0.294, 0.294, 0.294, 0.294, 0.294, 0.441, 0.882, 0.98,
          1.176, 1.47,
        ],
      ],
    },
    {
      label: 'Dataset 2',
      backgroundColor: 'rgba(0,0,255,0.5)',
      borderColor: 'blue',
      borderWidth: 1,
      outlierColor: '#999999',
      padding: 10,
      itemRadius: 0,
      data: [[0.882, 0.882, 1.029, 1.323, 1.323]],
    },
  ]
  protected options = {
    responsive: true,
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Box Plot Chart',
    },
  }
}
</script>
