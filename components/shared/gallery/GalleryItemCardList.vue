<template>
  <div :id="INFINITE_SCROLL_CONTAINER_ID" class="columns is-multiline">
    <div
      v-for="(nft, index) in formatNFT(items)"
      :key="nft.id"
      :class="`column ${classLayout} column-padding ${INFINITE_SCROLL_ITEM_CLASS_NAME}`">
      <NftCard :nft="nft" :data-cy="index" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RmrkType } from '@/components/rmrk/service/scheme'

import {
  INFINITE_SCROLL_CONTAINER_ID,
  INFINITE_SCROLL_ITEM_CLASS_NAME,
} from '@/utils/mixins/infiniteScrollMixin'
import { formatNFT } from '@/utils/carousel'
import NftCard from '@/components/shared/gallery/NftCard.vue'
import { usePreferencesStore } from '@/stores/preferences'

defineProps<{ items: RmrkType[] }>()

const preferencesStore = usePreferencesStore()
const classLayout = computed(() => preferencesStore.getLayoutClass)
</script>
