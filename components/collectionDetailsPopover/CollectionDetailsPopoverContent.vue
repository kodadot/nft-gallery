<template>
  <div class="popover-content-container p-5 ms-dos-shadow">
    <div class="popover-header pb-2">
      <h6 class="popover-user-heading">{{ $t('collection') }}</h6>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <nuxt-link
            class="is-size-6 break-word mr-2 text-k-blue hover:text-k-blue-hover"
            :to="`/${urlPrefix}/collection/${
              nft?.collection?.id || nft.collectionId
            }`">
            <span data-testid="identity-display">
              {{ nft?.collection?.name || nft?.collectionName || '--' }}</span
            >
          </nuxt-link>
        </div>
      </div>
    </div>

    <div class="popover-stats-container flex flex-col pt-2">
      <div class="pb-2">
        <div class="flex items-center justify-between">
          <span class="is-size-6">{{ $t('statsOverview.uniqueOwners') }}</span>

          <p class="is-size-6" data-testid="identity-collected">
            {{ stats.uniqueOwnersPercent }}
          </p>
        </div>
        <div class="flex items-center justify-between">
          <span class="is-size-6">{{ $t('statsOverview.highestSale') }}</span>

          <p class="is-size-6" data-testid="identity-collected">
            <CommonTokenMoney :value="highestBuyPrice" inline />
          </p>
        </div>
        <div class="flex items-center justify-between">
          <span class="is-size-6">{{ $t('statsOverview.floorPrice') }}</span>

          <p class="is-size-6" data-testid="identity-collected">
            <CommonTokenMoney :value="stats.collectionFloorPrice" inline />
          </p>
        </div>
        <div class="flex items-center justify-between">
          <span class="is-size-6">{{ $t('statsOverview.totalVolume') }}</span>

          <p class="is-size-6" data-testid="identity-collected">
            <CommonTokenMoney
              :value="stats.collectionTradedVolumeNumber"
              inline />
          </p>
        </div>
      </div>
      <div v-if="soldItems.length" class="sales-container pt-2">
        <h6 class="popover-user-heading pb-2">
          {{ $t('profile.highestSales') }}
        </h6>
        <div class="flex sold-items">
          <div v-for="nftItem in soldItems" :key="nftItem.id" class="sold-item">
            <GalleryCard
              :id="nftItem.id"
              hide-name
              :metadata="nftItem.metadata"
              :current-owner="nftItem.currentOwner"
              :route="`/${urlPrefix}/gallery`"
              :data-testid="soldItems.indexOf(nftItem)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CarouselNFT } from '../base/types'
import {
  useBuyEvents,
  useCollectionDetails,
  useCollectionSoldData,
} from '../collection/utils/useCollectionDetails'

const props = defineProps<{
  nft: CarouselNFT
}>()

const CommonTokenMoney = defineAsyncComponent(
  () => import('@/components/shared/CommonTokenMoney.vue'),
)

const GalleryCard = defineAsyncComponent(
  () => import('@/components/rmrk/Gallery/GalleryCard.vue'),
)

const { urlPrefix } = usePrefix()

const { stats } = useCollectionDetails({
  collectionId: computed(
    () => (props.nft?.collection?.id || props.nft?.collectionId) as string,
  ),
})

const { highestBuyPrice } = useBuyEvents({
  collectionId: props.nft?.collection?.id || props.nft?.collectionId,
})

const { nftEntities: soldItems } = useCollectionSoldData({
  address: props.nft?.issuer,
  collectionId: props.nft?.collection?.id || props.nft?.collectionId,
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.popover-content-container {
  @include ktheme() {
    border: 1px solid theme('border-color');
  }

  width: 300px;
}

.ms-dos-shadow {
  @include ktheme() {
    box-shadow: theme('primary-shadow');
  }
}

.popover-image {
  min-width: 60px;
}

.break-word {
  overflow-wrap: break-word;
}

.popover-header {
  @apply border-b border-k-grey;

  .popover-user-heading {
    font-size: 12px;

    @include ktheme() {
      color: theme('k-grey');
    }
  }
}

.sales-container {
  @apply border-t border-k-grey;
}

.sold-items {
  gap: 10px;

  .sold-item {
    width: 76px;
    height: 76px;
  }
}
</style>
