<template>
  <GalleryItemPriceSection
    :title="$t('offer.highestOffer')"
    :price="highestOfferPrice"
    class="mt-4"
  >
    <div class="flex justify-end gallery-item-offer">
      <NeoButton
        v-if="!hideActionButton"
        :label="$t('transaction.offer')"
        variant="k-blue"
        size="large"
        class="w-[calc(10rem+55px)]"
        @click="onMakeOfferClick"
      />
      <MakeOffer />
    </div>
  </GalleryItemPriceSection>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import type { NFT } from '@/components/rmrk/service/scheme'
import { nftToOfferItem } from '@/components/common/shoppingCart/utils'
import { usePreferencesStore } from '@/stores/preferences'
import { useMakingOfferStore } from '@/stores/makeOffer'
import MakeOffer from '@/components/offer/MakeOffer.vue'
import GalleryItemPriceSection from '@/components/gallery/GalleryItemAction/GalleryItemActionSection.vue'
import type { NFTOffer } from '@/components/useNft'

const props = defineProps<{
  nft: NFT
  highestOffer?: NFTOffer
  hideActionButton?: boolean
}>()
const preferencesStore = usePreferencesStore()
const makeOfferStore = useMakingOfferStore()
const { doAfterLogin } = useDoAfterlogin()
const { isCurrentOwner } = useAuth()
const isOwner = computed(() => isCurrentOwner(props.nft?.currentOwner))

const highestOfferPrice = computed(() => props.highestOffer?.price || '')

const openOfferModal = () => {
  makeOfferStore.clear()
  const item = nftToOfferItem(props.nft, highestOfferPrice.value)
  makeOfferStore.setItem(item)

  preferencesStore.setMakeOfferModalOpen(true)
}

const onMakeOfferClick = () => {
  doAfterLogin({
    onLoginSuccess: () => {
      if (!isOwner.value) {
        openOfferModal()
      }
    },
  })
}

useModalIsOpenTracker({
  isOpen: computed(() => preferencesStore.makeOfferModalOpen),
  onChange: () => makeOfferStore.clear(),
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.gallery-item-offer {
  button {
    font-size: 1rem;
    height: 3.375rem;
  }
}

@include until-widescreen {
  .gallery-item-offer {
    width: 100%;
    margin-top: 1rem !important;
    button {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
