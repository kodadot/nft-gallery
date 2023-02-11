<template>
  <div class="popover-stats-container is-flex is-flex-direction-column pt-2">
    <div class="pb-2">
      <div
        class="is-flex is-align-items-center is-justify-content-space-between">
        <span class="is-size-6">{{ $t('profile.collected') }}</span>

        <p class="is-size-6" data-cy="identity-collected">
          {{ totalCollected }}
        </p>
      </div>
      <div
        class="is-flex is-align-items-center is-justify-content-space-between">
        <span class="is-size-6">{{ $t('profile.created') }}</span>

        <p class="is-size-6" data-cy="identity-created">
          {{ totalCreated }}
        </p>
      </div>
      <div
        class="is-flex is-align-items-center is-justify-content-space-between">
        <span class="is-size-6">{{ $t('profile.sold') }}</span>

        <p class="is-size-6" data-cy="identity-sold">
          {{ totalSold }}
        </p>
      </div>
    </div>
    <div v-if="soldItems.length" class="sales-container pt-2">
      <h6 class="popover-user-heading pb-2">
        {{ $t('profile.highestSales') }}
      </h6>
      <div class="is-flex sold-items">
        <div v-for="nft in soldItems" :key="nft.id" class="sold-item">
          <GalleryCard
            :id="nft.id"
            hide-name
            :metadata="nft.metadata"
            :current-owner="nft.currentOwner"
            :route="`/${urlPrefix}/gallery`"
            :data-cy="soldItems.indexOf(nft)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useIdentityStats from '../utils/useIdentityStats'

import type { NFT } from '@/components/rmrk/service/scheme'

const GalleryCard = defineAsyncComponent(
  () => import('../../rmrk/Gallery/GalleryCard.vue')
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
@import '@/styles/abstracts/variables';

.sold-items {
  gap: 10px;
  .sold-item {
    width: 78px;
    height: 78px;
    border: 1px solid $black;
    // add white stroke
    box-shadow: 0 0 0 1px $white;
  }
}

.sales-container {
  border-top: 1px solid $k-grey;
}

.popover-user-heading {
  font-size: 12px;
  color: $k-grey;
}
</style>
