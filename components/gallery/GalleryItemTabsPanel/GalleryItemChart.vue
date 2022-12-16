<template>
  <div>
    <PriceChart class="mt-4" :price-chart-data="priceChartData" />
    <LazyGalleryHistory
      class="is-hidden"
      :events="nftEvents"
      @setPriceChartData="setPriceChartData" />
  </div>
</template>

<script lang="ts" setup>
import { Interaction } from '@/components/rmrk/service/scheme'
import PriceChart from '@/components/chart/PriceChart.vue'

defineProps<{
  nftEvents?: Interaction[]
}>()
const priceChartData = ref<[Date, number][][]>([])

const setPriceChartData = (data: [Date, number][][]) => {
  priceChartData.value = data
}
</script>
