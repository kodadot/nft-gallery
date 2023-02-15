<template>
  <v-tippy
    class="is-flex"
    interactive
    :animate-fill="false"
    placement="bottom"
    :delay="0"
    data-cy="identity">
    <template #trigger>
      <slot name="trigger" />
    </template>
    <div class="popover-content-container p-5 ms-dos-shadow">
      <div class="popover-header pb-2">
        <h6 class="popover-user-heading">{{ $t('collection') }}</h6>
        <div
          class="is-flex is-align-items-center is-justify-content-space-between">
          <div class="is-flex is-align-items-center">
            <nuxt-link
              class="is-size-6 break-word mr-2 has-text-link"
              :to="`/${urlPrefix}/collection/${
                nft?.collection?.id || nft.collectionId
              }`">
              <span data-cy="identity-display">
                {{
                  nft?.collection?.name ||
                  nft?.collectionName ||
                  nft.collection.id
                }}</span
              >
            </nuxt-link>
          </div>
        </div>
      </div>

      <div
        class="popover-stats-container is-flex is-flex-direction-column pt-2">
        <div class="pb-2">
          <div
            class="is-flex is-align-items-center is-justify-content-space-between">
            <span class="is-size-6">{{
              $t('statsOverview.uniqueOwners')
            }}</span>

            <p class="is-size-6" data-cy="identity-collected">
              {{ stats.uniqueOwnersPercent }}
            </p>
          </div>
          <div
            class="is-flex is-align-items-center is-justify-content-space-between">
            <span class="is-size-6">{{ $t('statsOverview.highestSale') }}</span>

            <p class="is-size-6" data-cy="identity-collected">
              <CommonTokenMoney :value="highestBuyPrice" inline />
            </p>
          </div>
          <div
            class="is-flex is-align-items-center is-justify-content-space-between">
            <span class="is-size-6">{{ $t('statsOverview.floorPrice') }}</span>

            <p class="is-size-6" data-cy="identity-collected">
              <CommonTokenMoney :value="stats.collectionFloorPrice" inline />
            </p>
          </div>
          <div
            class="is-flex is-align-items-center is-justify-content-space-between">
            <span class="is-size-6">{{ $t('statsOverview.totalVolume') }}</span>

            <p class="is-size-6" data-cy="identity-collected">
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
          <div class="is-flex sold-items">
            <div
              v-for="nftItem in soldItems"
              :key="nftItem.id"
              class="sold-item">
              <GalleryCard
                :id="nftItem.id"
                hide-name
                :metadata="nftItem.metadata"
                :current-owner="nftItem.currentOwner"
                :route="`/${urlPrefix}/gallery`"
                :data-cy="soldItems.indexOf(nftItem)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-tippy>
</template>

<script lang="ts" setup>
import { CarouselNFT } from '../base/types'
import {
  useBuyEvents,
  useCollectionDetails,
  useCollectionSoldData,
} from '../collection/utils/useCollectionDetails'

const props = defineProps<{
  nft: CarouselNFT
}>()

const CommonTokenMoney = defineAsyncComponent(
  () => import('@/components/shared/CommonTokenMoney.vue')
)

const GalleryCard = defineAsyncComponent(
  () => import('@/components/rmrk/Gallery/GalleryCard.vue')
)

const { urlPrefix } = usePrefix()

let { stats } = useCollectionDetails({
  collectionId: props.nft?.collection?.id || props.nft?.collectionId,
})

let { highestBuyPrice } = useBuyEvents({
  collectionId: props.nft?.collection?.id || props.nft?.collectionId,
})

const { nftEntities: soldItems } = useCollectionSoldData({
  address: props.nft?.issuer,
  collectionId: props.nft?.collection?.id || props.nft?.collectionId,
})
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

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
  @include ktheme() {
    border-bottom: 1px solid theme('k-grey');
  }

  .popover-user-heading {
    font-size: 12px;

    @include ktheme() {
      color: theme('k-grey');
    }
  }
}

.sales-container {
  @include ktheme() {
    border-top: 1px solid theme('k-grey');
  }
}

.sold-items {
  gap: 10px;

  .sold-item {
    width: 78px;
    height: 78px;

    @include ktheme() {
      border: 1px solid theme('border-color');
    }
  }
}
</style>
