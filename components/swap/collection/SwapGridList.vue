<template>
  <div
    class="flex flex-col gap-4 my-10!"
  >
    <DynamicGrid
      :grid-section="GridSection.PROFILE_GALLERY"
      grid-size="medium"
      :mobile-cols="2"
      class="my-5"
    >
      <ItemsGridImage
        v-for="(nft, index) in desiredNfts"
        :key="index"
        :nft="nft"
        hide-action
        hide-collection-popover
        hide-listing
        skeleton-variant="primary"
        hide-video-controls
        variant="minimal"
      />

      <SwapSurchargeCard
        v-if="surcharge?.direction === 'Receive'"
        :surcharge="surcharge"
      />
    </DynamicGrid>
  </div>
</template>

<script setup lang="ts">
import ItemsGridImage from '@/components/items/ItemsGrid/ItemsGridImage.vue'
import type { NFTWithMetadata } from '@/composables/useNft'

const swapStore = useAtomicSwapStore()
const { swap } = storeToRefs(swapStore)
const surcharge = computed(() => swap.value?.surcharge)
const desiredNfts = computed(() => swap.value?.desired as NFTWithMetadata[])
</script>
