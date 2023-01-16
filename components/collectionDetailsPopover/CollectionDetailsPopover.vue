<template>
  <v-tippy
    class="tippy-container"
    interactive
    :animate-fill="false"
    placement="bottom"
    :delay="[100, 800]"
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
              :to="`/${urlPrefix}/collection/${nft?.collection.id}`">
              <span data-cy="identity-display">
                {{ nft?.collection.name }}</span
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
                :value="stats.collectionDailyTradedVolumeNumber"
                inline />
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
    </div>
  </v-tippy>
</template>

<script lang="ts" setup>
import {
  useBuyEvents,
  useCollectionDetails,
  useCollectionSoldData,
} from '../collection/utils/useCollectionDetails'
import { NFT } from '../rmrk/service/scheme'

const props = defineProps<{
  nft: NFT
}>()

const CommonTokenMoney = defineAsyncComponent(
  () => import('@/components/shared/CommonTokenMoney.vue')
)

const GalleryCard = defineAsyncComponent(
  () => import('@/components/rmrk/Gallery/GalleryCard.vue')
)

const { urlPrefix } = usePrefix()

let { stats } = useCollectionDetails({
  collectionId: props.nft?.collection.id,
})

let { highestBuyPrice } = useBuyEvents({
  collectionId: props.nft?.collection.id,
})

const { nftEntities: soldItems } = useCollectionSoldData({
  address: props.nft?.issuer,
  collectionId: props.nft?.collection.id,
})
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.tippy-container {
  display: inline-block;
}

.popover-content-container {
  border: 1px solid $black;
  width: 300px;
}

.ms-dos-shadow {
  box-shadow: $primary-shadow;
}

.popover-image {
  min-width: 60px;
}

.break-word {
  overflow-wrap: break-word;
}

.popover-header {
  border-bottom: 1px solid $k-grey;

  .popover-user-heading {
    font-size: 12px;
    color: $k-grey;
  }
}

.sales-container {
  border-top: 1px solid $k-grey;
}

.sold-items {
  gap: 10px;

  .sold-item {
    width: 78px;
    height: 78px;
    border: 1px solid $black;
  }
}
</style>
