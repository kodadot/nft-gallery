<template>
  <o-tabs v-model="activeTab" expanded content-class="o-tabs__content--fixed">
    <!-- offers -->
    <DisablableTab
      value="0"
      :disabled="offersDisabled"
      :label="$t('tabs.offers')"
      :disabled-tooltip="$t('tabs.offersDisabled')">
      <GalleryItemOffers
        v-if="
          !['rmrk', 'rmrk2'].includes(urlPrefix) &&
          nft?.collection.id &&
          nft?.id &&
          nft.currentOwner
        "
        :collection-id="nft?.collection.id"
        :nft-id="nft?.id"
        :account="nft?.currentOwner" />
    </DisablableTab>

    <!-- activity -->
    <o-tab-item value="1" :label="$t('tabs.activity')">
      <GalleryItemActivity
        v-if="nft?.id"
        ref="activityTabRef"
        :nft-id="nft?.id" />
    </o-tab-item>

    <!-- chart -->
    <o-tab-item value="2" :label="$t('tabs.chart')" class="p-5">
      <GalleryItemChart :nft-events="nft?.events" />
    </o-tab-item>
  </o-tabs>
</template>

<script setup lang="ts">
import { OTabItem, OTabs } from '@oruga-ui/oruga'

import { useGalleryItem } from '../useGalleryItem'
import GalleryItemActivity from './GalleryItemActivity.vue'
import GalleryItemChart from './GalleryItemChart.vue'
import GalleryItemOffers from './GalleryItemOffers.vue'
import { DisablableTab } from '@kodadot1/brick'
const props = withDefaults(
  defineProps<{
    activeTab?: string
  }>(),
  {
    activeTab: '0',
  }
)

const activityTabRef = ref<InstanceType<typeof GalleryItemActivity>>()

defineExpose({
  refreshActivityTab: () => {
    activityTabRef.value?.refreshTable()
  },
})

const { urlPrefix } = usePrefix()
const { nft } = useGalleryItem()
const { offersDisabled } = useChain()

const activeTab = ref('0')
const collectionId = ref('')

watchEffect(() => {
  if (props.activeTab) {
    activeTab.value = props.activeTab
  }
  if (offersDisabled) {
    activeTab.value = '1'
  }

  collectionId.value = nft.value?.collection.id || ''
})
</script>
