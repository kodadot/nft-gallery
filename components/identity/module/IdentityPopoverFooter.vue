<template>
  <div class="popover-stats-container flex flex-col pt-2">
    <div class="pb-2">
      <div class="flex items-center justify-between">
        <span class="is-size-6">{{ $t('profile.collected') }}</span>

        <p class="is-size-6" data-testid="identity-collected">
          {{ totalCollected }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <span class="is-size-6">{{ $t('profile.created') }}</span>

        <p class="is-size-6" data-testid="identity-created">
          {{ totalCreated }}
        </p>
      </div>
      <div class="flex items-center justify-between">
        <span class="is-size-6">{{ $t('profile.sold') }}</span>

        <p class="is-size-6" data-testid="identity-sold">
          {{ totalSold }}
        </p>
      </div>
    </div>
    <div v-if="nfts.length" class="sales-container pt-2">
      <h6 class="popover-user-heading pb-2">
        {{ $t('profile.highestSales') }}
      </h6>
      <div class="flex sold-items">
        <div v-for="nft in nfts" :key="nft.id" class="sold-item">
          <GalleryCard
            :id="nft.id"
            hide-name
            :metadata="nft.metadata"
            :route="`/${urlPrefix}/gallery`"
            :data-testid="nfts.indexOf(nft)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useIdentityStats from '../utils/useIdentityStats'
import { type EventMinimalNft } from '@/composables/useMinimalEvents'

const GalleryCard = defineAsyncComponent(
  () => import('../../rmrk/Gallery/GalleryCard.vue'),
)

const address = inject('address')
const { urlPrefix } = usePrefix()
const { totalCollected, totalCreated, totalSold } = useIdentityStats({
  address,
})

defineProps<{
  nfts: EventMinimalNft[]
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
