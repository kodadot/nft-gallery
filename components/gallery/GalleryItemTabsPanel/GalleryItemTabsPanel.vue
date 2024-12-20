<template>
  <NeoTabs
    v-model="active"
    type="toggle"
    expanded
    data-testid="gallery-item-tabs"
    content-class="o-tabs__content--fixed gallery-item-tab-panel"
  >
    <!-- activity -->
    <NeoTabItem
      :value="GALLERY_ITEM_TABS.ACTIVITY"
      :label="$t('tabs.activity')"
    >
      <GalleryItemActivity
        v-if="nft?.id"
        :nft-id="nft?.id"
      />
    </NeoTabItem>

    <!-- offers -->
    <NeoTabItem
      v-if="offerVisible(urlPrefix)"
      :value="GALLERY_ITEM_TABS.OFFERS"
      :label="$t('offers')"
    >
      <GalleryItemOffers
        v-if="nft?.id"
        :nft-id="nft.id"
      />
    </NeoTabItem>

    <!-- swaps -->
    <NeoTabItem
      v-if="swapVisible(urlPrefix)"
      :value="GALLERY_ITEM_TABS.SWAPS"
      :label="$t('swaps')"
    >
      <GalleryItemSwaps
        v-if="nft?.id"
        :nft-id="nft.id"
      />
    </NeoTabItem>

    <!-- chart -->
    <NeoTabItem
      :value="GALLERY_ITEM_TABS.CHART"
      :label="$t('tabs.chart')"
      class="p-5"
    >
      <GalleryItemChart :nft-events="nft?.events" />
    </NeoTabItem>
  </NeoTabs>
</template>

<script setup lang="ts">
import { NeoTabItem, NeoTabs } from '@kodadot1/brick'
import GalleryItemActivity from './GalleryItemActivity.vue'
import GalleryItemOffers from './GalleryItemOffers.vue'
import GalleryItemSwaps from './GalleryItemSwaps.vue'
import GalleryItemChart from './GalleryItemChart.vue'
import { GALLERY_ITEM_TABS } from './types'
import { offerVisible, swapVisible } from '@/utils/config/permission.config'

const props = withDefaults(
  defineProps<{
    activeTab?: GALLERY_ITEM_TABS
  }>(),
  {
    activeTab: GALLERY_ITEM_TABS.ACTIVITY,
  },
)

const { urlPrefix } = usePrefix()
const { getNft: nft } = storeToRefs(useNftStore())

const active = ref<GALLERY_ITEM_TABS>(props.activeTab)

watch(() => props.activeTab, activeTab => active.value = activeTab)
</script>

<style lang="scss">
@import '@/assets/styles/abstracts/variables';

.o-tabs__content--fixed.gallery-item-tab-panel {
  @include mobile {
    height: 28rem;
  }
}
.offers-disabled-tooltip {
  transform: translateX(calc(-50% + 3rem));
  .o-tip__arrow--top {
    transform: translateX(-3rem);
  }
}
</style>
