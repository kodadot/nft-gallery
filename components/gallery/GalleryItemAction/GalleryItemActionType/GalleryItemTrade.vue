<template>
  <GalleryItemPriceSection
    :title="$t('offer.highestOffer')"
    :price="highestOfferPrice"
    class="mt-4"
  >
    <div
      v-if="!hideActionButton"
      class="flex justify-end gallery-item-trade"
    >
      <NeoButton
        data-testid="gallery-item-trade-make-offer"
        :label="$t('transaction.offer')"
        variant="k-blue"
        size="large"
        class="w-[8.375rem] !h-[55px]"
        @click="onMakeOfferClick"
      />
      <NeoButton
        size="large"
        class="!w-[6.25rem] !h-[55px]"
        @click="onSwapClick"
      >
        <div class="flex gap-2">
          <NeoIcon
            icon="arrow-right-arrow-left"
          />
          <span> {{ $t('swap.swap') }}</span>
        </div>
      </NeoButton>
      <TradeMakeOfferModal />
    </div>
  </GalleryItemPriceSection>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import type { NFT } from '@/types'
import { nftToOfferItem } from '@/components/common/shoppingCart/utils'
import { usePreferencesStore } from '@/stores/preferences'
import { useMakingOfferStore } from '@/stores/makeOffer'
import GalleryItemPriceSection from '@/components/gallery/GalleryItemAction/GalleryItemActionSection.vue'
import type { NFTOffer } from '@/composables/useNft'

const props = defineProps<{
  nft: NFT
  highestOffer?: NFTOffer
  hideActionButton?: boolean
}>()
const preferencesStore = usePreferencesStore()
const makeOfferStore = useMakingOfferStore()
const swapStore = useAtomicSwapStore()
const { isCurrentAccount } = useAuth()
const isOwner = computed(() => isCurrentAccount(props.nft?.currentOwner))
const { onTradeActionClick } = useTradeActionClick(isOwner)
const highestOfferPrice = computed(() => props.highestOffer?.price || '')

const openOfferModal = () => {
  makeOfferStore.clear()
  const item = nftToOfferItem(props.nft, highestOfferPrice.value)
  makeOfferStore.setItem(item)

  preferencesStore.setMakeOfferModalOpen(true)
}

const onMakeOfferClick = () => {
  onTradeActionClick(openOfferModal)
}

const onSwapClick = () => {
  onTradeActionClick(() => {
    const nft = props.nft
    const swap = swapStore.createSwap(nft.currentOwner, {
      desired: [nftToSwapItem(nft)],
    })

    navigateToSwap(swap)
  })
}

useModalIsOpenTracker({
  isOpen: computed(() => preferencesStore.makeOfferModalOpen),
  onChange: () => makeOfferStore.clear(),
})
</script>

<style lang="scss" scoped>
.gallery-item-trade {
  @apply bulma-until-widescreen:w-full bulma-until-widescreen:mt-4;

  button {
    font-size: 1rem;
    height: 3.375rem;
    @apply bulma-until-widescreen:size-full;
  }
}
</style>
