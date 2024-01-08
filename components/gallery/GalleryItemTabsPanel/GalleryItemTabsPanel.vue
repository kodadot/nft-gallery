<template>
  <NeoTabs
    v-model="activeTab"
    type="toggle"
    expanded
    data-testid="gallery-item-tabs"
    content-class="o-tabs__content--fixed gallery-item-tab-panel">
    <!-- offers -->
    <NeoTabItem
      value="0"
      data-testid="offer-list"
      :disabled="offersDisabled"
      :label="$t('tabs.offers')"
      tag="div"
      class="p-5">
      <template #header>
        <NeoTooltip
          v-if="offersDisabled"
          :label="$t('tabs.offersDisabled')"
          content-class="offers-disabled-tooltip"
          stop-events
          append-to-body>
          {{ $t('tabs.offers') }}
        </NeoTooltip>
        <div v-else>
          {{ $t('tabs.offers') }}
        </div>
      </template>
    </NeoTabItem>

    <!-- activity -->
    <NeoTabItem
      value="1"
      :label="$t('tabs.activity')"
      data-testid="offer-activity">
      <GalleryItemActivity v-if="nft?.id" :nft-id="nft?.id" />
    </NeoTabItem>

    <!-- chart -->
    <NeoTabItem value="2" :label="$t('tabs.chart')" class="p-5">
      <GalleryItemChart :nft-events="nft?.events" />
    </NeoTabItem>
  </NeoTabs>
</template>

<script setup lang="ts">
import { NeoTabItem, NeoTabs, NeoTooltip } from '@kodadot1/brick'

import { GalleryItem } from '../useGalleryItem'
import GalleryItemActivity from './GalleryItemActivity.vue'
import GalleryItemChart from './GalleryItemChart.vue'

const props = withDefaults(
  defineProps<{
    activeTab?: string
    galleryItem: GalleryItem
  }>(),
  {
    activeTab: '0',
  },
)

const nft = computed(() => props.galleryItem.nft.value)
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
