<template>
  <div class="w-[300px] border border-border-color shadow-[4px_4px] p-5">
    <div class="border-b border-k-grey pb-2">
      <h6 class="text-xs text-k-grey">
        {{ $t('collection') }}
      </h6>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <nuxt-link
            class="text-base break-words mr-2 text-k-blue hover:text-k-blue-hover"
            :to="`/${urlPrefix}/collection/${
              nft?.collection?.id || nft.collectionId
            }`"
          >
            <span data-testid="identity-display">
              {{ nft?.collection?.name || nft?.collectionName || '--' }}</span>
          </nuxt-link>
        </div>
      </div>
    </div>

    <div class="flex flex-col pt-2">
      <div class="pb-2">
        <div class="flex items-center justify-between">
          <span class="text-base">{{ $t('statsOverview.uniqueOwners') }}</span>

          <p
            class="text-base"
            data-testid="identity-collected"
          >
            {{ stats.uniqueOwnersPercent }}
          </p>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-base">{{ $t('statsOverview.highestSale') }}</span>

          <p
            class="text-base"
            data-testid="identity-collected"
          >
            <CommonTokenMoney
              :value="highestBuyPrice"
              inline
            />
          </p>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-base">{{ $t('statsOverview.floorPrice') }}</span>

          <p
            class="text-base"
            data-testid="identity-collected"
          >
            <CommonTokenMoney
              :value="stats.collectionFloorPrice"
              inline
            />
          </p>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-base">{{ $t('statsOverview.totalVolume') }}</span>

          <p
            class="text-base"
            data-testid="identity-collected"
          >
            <CommonTokenMoney
              :value="stats.collectionTradedVolumeNumber"
              inline
            />
          </p>
        </div>
      </div>
      <div
        v-if="soldItems.length"
        class="border-t border-k-grey pt-2"
      >
        <h6 class="text-xs text-k-grey pb-2">
          {{ $t('profile.highestSales') }}
        </h6>
        <div class="flex gap-[10px]">
          <div
            v-for="nftItem in soldItems"
            :key="nftItem.id"
            class="w-[76px] h-[76px]"
          >
            <GalleryCard
              :id="nftItem.id"
              hide-name
              :metadata="nftItem.metadata"
              :current-owner="nftItem.currentOwner"
              :route="`/${urlPrefix}/gallery`"
              :data-testid="soldItems.indexOf(nftItem)"
            />
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
