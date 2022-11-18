<template>
  <o-tabs v-model="activeTab" expanded>
    <o-tab-item
      v-if="urlPrefix !== 'rmrk'"
      value="0"
      label="Offers"
      class="p-5">
      Offers
    </o-tab-item>

    <o-tab-item value="1" label="Activity" class="p-5"> Activity </o-tab-item>

    <o-tab-item value="2" label="Listings" class="p-5">
      Listings
      <LazyGalleryHistory
        class="is-invisible"
        :events="nft?.events"
        data-cy="history"
        @setPriceChartData="setPriceChartData" />
    </o-tab-item>

    <o-tab-item value="3" label="Chart" class="p-5">
      <PriceChart class="mt-4" :price-chart-data="priceChartData" />
    </o-tab-item>
  </o-tabs>
</template>

<script setup lang="ts">
import { OTabItem, OTabs } from '@oruga-ui/oruga'
import PriceChart from '@/components/chart/PriceChart.vue'
import { useGalleryItem } from './useGalleryItem'
const { nft } = useGalleryItem()

const { urlPrefix } = usePrefix()
const activeTab = ref('0')
const priceChartData = ref<[Date, number][][]>()
onMounted(() => {
  if (urlPrefix.value === 'rmrk') {
    activeTab.value = '1'
  }
})

const setPriceChartData = (data: [Date, number][][]) => {
  priceChartData.value = data
}
</script>
