<template>
  <div class="popover-stats-container flex flex-col pt-2">
    <div class="pb-2">
      <div class="flex items-center justify-between">
        <span class="text-base">{{ $t('profile.collected') }}</span>

        <p class="text-base" data-testid="identity-collected">
          {{ totalCollected }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-base">{{ $t('profile.created') }}</span>

        <p class="text-base" data-testid="identity-created">
          {{ totalCreated }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-base">{{ $t('profile.sold') }}</span>

        <p class="text-base" data-testid="identity-sold">
          {{ totalSold }}
        </p>
      </div>
    </div>
    <div v-if="soldItems.length" class="sales-container pt-2">
      <h6 class="popover-user-heading pb-2">
        {{ $t('profile.highestSales') }}
      </h6>
      <div class="flex sold-items">
        <div v-for="nft in soldItems" :key="nft.id" class="sold-item">
          <GalleryCard
            :id="nft.id"
            hide-name
            :metadata="nft.metadata"
            :current-owner="nft.currentOwner"
            :route="`/${urlPrefix}/gallery`"
            :data-testid="soldItems.indexOf(nft)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useIdentityStats from '../utils/useIdentityStats'

import type { NFT } from '@/components/rmrk/service/scheme'

const GalleryCard = defineAsyncComponent(
  () => import('../../rmrk/Gallery/GalleryCard.vue'),
)

const address = inject('address')
const { urlPrefix } = usePrefix()
const { totalCollected, totalCreated, totalSold } = useIdentityStats({
  address,
})

defineProps<{
  soldItems: NFT[]
}>()
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.sold-items {
  gap: 10px;

  .sold-item {
    width: 76px;
    height: 76px;
  }
}

.sales-container {
  @apply border-t border-k-grey;
}

.popover-user-heading {
  font-size: 12px;

  @include ktheme() {
    color: theme('k-grey');
  }
}
</style>
