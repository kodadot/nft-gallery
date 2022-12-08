<template>
  <o-tabs v-model="activeTab" expanded content-class="o-tabs__content--fixed">
    <!-- offers -->
    <GalleryTab
      :disabled="urlPrefix === 'rmrk'"
      value="0"
      :label="$t('tabs.offers')"
      :disabled-tooltip="$t('tabs.offersDisabledRMRK')">
      <GalleryItemOffers
        v-if="
          urlPrefix !== 'rmrk' &&
          nft?.collection.id &&
          nft?.id &&
          nft.currentOwner
        "
        :collection-id="nft?.collection.id"
        :nft-id="nft?.id"
        :account="nft?.currentOwner" />
    </GalleryTab>

    <!-- activity -->
    <o-tab-item value="1" :label="$t('tabs.activity')" class="p-5">
      Activity
      <LazyGalleryHistory
        class="is-invisible"
        :events="nft?.events"
        data-cy="history"
        @setPriceChartData="setPriceChartData" />
    </o-tab-item>

    <!-- chart -->
    <o-tab-item value="2" :label="$t('tabs.chart')" class="p-5">
      <PriceChart class="mt-4" :price-chart-data="priceChartData" />
    </o-tab-item>
  </o-tabs>
</template>

<script setup lang="ts">
import { OTabItem, OTabs } from '@oruga-ui/oruga'

import { useGalleryItem } from '../useGalleryItem'
import GalleryItemOffers from './GalleryItemOffers.vue'
import PriceChart from '@/components/chart/PriceChart.vue'
import GalleryTab from '~~/components/gallery/GalleryTab.vue'

const { urlPrefix } = usePrefix()
const { nft } = useGalleryItem()
const priceChartData = ref<[Date, number][][]>([])

const activeTab = ref('0')
const collectionId = ref('')

const setPriceChartData = (data: [Date, number][][]) => {
  priceChartData.value = data
}

watchEffect(() => {
  if (urlPrefix.value === 'rmrk') {
    activeTab.value = '1'
  }

  collectionId.value = nft.value?.collection.id || ''
})
</script>
