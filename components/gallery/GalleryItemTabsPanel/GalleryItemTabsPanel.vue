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
      value="1"
      :label="$t('tabs.activity')"
      data-testid="offer-activity"
    >
      <GalleryItemActivity
        v-if="nft?.id"
        :nft-id="nft?.id"
      />
    </NeoTabItem>

    <!-- offers -->
    <NeoTabItem
      v-if="offerVisible(urlPrefix)"
      value="2"
      :label="$t('offers')"
      data-testid="offers-activity"
    >
      <GalleryItemOffers
        v-if="nft?.id"
        :nft-id="nft.id"
      />
    </NeoTabItem>

    <!-- swaps -->
    <NeoTabItem
      v-if="offerVisible(urlPrefix)"
      value="3"
      :label="$t('swaps')"
      data-testid="offers-activity"
    >
      <GalleryItemSwaps
        v-if="nft?.id"
        :nft-id="nft.id"
      />
    </NeoTabItem>

    <!-- chart -->
    <NeoTabItem
      value="4"
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
import { offerVisible } from '@/utils/config/permission.config'

const props = withDefaults(
  defineProps<{
    activeTab?: string
  }>(),
  {
    activeTab: '0',
  },
)

const { urlPrefix } = usePrefix()
const { getNft: nft } = storeToRefs(useNftStore())

const active = ref('1')
const collectionId = ref('')

watchEffect(() => {
  if (props.activeTab) {
    active.value = props.activeTab
  }

  collectionId.value = nft.value?.collection.id || ''
})
</script>
