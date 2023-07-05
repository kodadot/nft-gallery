<template>
  <NeoTabs
    v-model="activeTab"
    type="toggle"
    expanded
    data-cy="gallery-item-tabs"
    content-class="o-tabs__content--fixed gallery-item-tab-panel">
    <!-- offers -->
    <NeoTabItem
      value="0"
      data-cy="offer-list"
      :disabled="offersDisabled"
      :label="$t('tabs.offers')"
      tag="div"
      class="p-5">
      <template #header>
        <NeoTooltip
          v-if="offersDisabled"
          :label="$t('tabs.offersDisabled')"
          stop-events
          append-to-body>
          {{ $t('tabs.offers') }}
        </NeoTooltip>
        <div v-else>
          {{ $t('tabs.offers') }}
        </div>
      </template>

      <GalleryItemOffers
        v-if="isSnek && nft?.collection.id && nft?.id && nft.currentOwner"
        :collection-id="nft?.collection.id"
        :nft-id="nft?.id"
        :account="nft?.currentOwner" />
      <div v-else></div>
    </NeoTabItem>

    <!-- activity -->
    <NeoTabItem value="1" :label="$t('tabs.activity')" data-cy="offer-activity">
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
import GalleryItemOffers from './GalleryItemOffers.vue'

const props = withDefaults(
  defineProps<{
    activeTab?: string
    galleryItem: GalleryItem
  }>(),
  {
    activeTab: '0',
  }
)

const { urlPrefix } = usePrefix()
const nft = computed(() => props.galleryItem.nft.value)
const { offersDisabled } = useChain()

const activeTab = ref('0')
const collectionId = ref('')

const isSnek = computed(() => ['bsx', 'snek'].includes(urlPrefix.value))

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
@import '@/styles/abstracts/variables';

.o-tabs__content--fixed.gallery-item-tab-panel {
  @include mobile {
    height: 28rem;
  }
}
</style>
