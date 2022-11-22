<template>
  <o-tabs v-model="activeTab" expanded>
    <!-- offers -->
    <o-tab-item
      v-if="urlPrefix !== 'rmrk'"
      value="0"
      :label="$t('tabs.offers')">
      <GalleryItemOffers
        v-if="nft?.collection.id && nft?.id && nft.currentOwner"
        :collection-id="nft?.collection.id"
        :nft-id="nft?.id"
        :account="nft?.currentOwner" />
    </o-tab-item>

    <!-- activity -->
    <o-tab-item value="1" :label="$t('tabs.activity')" class="p-5">
      Activity
    </o-tab-item>

    <!-- chart -->
    <o-tab-item value="2" :label="$t('tabs.chart')" class="p-5">
      Chart
    </o-tab-item>
  </o-tabs>
</template>

<script setup lang="ts">
import { OTabItem, OTabs } from '@oruga-ui/oruga'

import { useGalleryItem } from '../useGalleryItem'
import GalleryItemOffers from './GalleryItemOffers.vue'

const { urlPrefix } = usePrefix()
const { nft } = useGalleryItem()

const activeTab = ref('0')
const collectionId = ref('')

watchEffect(() => {
  if (urlPrefix.value === 'rmrk') {
    activeTab.value = '1'
  }

  collectionId.value = nft.value?.collection.id || ''
})
</script>
