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
import { doAfterCheckCurrentChainVM } from '@/components/common/ConnectWallet/openReconnectWalletModal'

const props = defineProps<{
  nft: NFT
  highestOffer?: NFTOffer
  hideActionButton?: boolean
}>()
const preferencesStore = usePreferencesStore()
const makeOfferStore = useMakingOfferStore()
const { doAfterLogin } = useDoAfterlogin()
const { isCurrentOwner, isLogIn } = useAuth()
const isOwner = computed(() => isCurrentOwner(props.nft?.currentOwner))
const swapStore = useAtomicSwapStore()

const highestOfferPrice = computed(() => props.highestOffer?.price || '')

const openOfferModal = () => {
  makeOfferStore.clear()
  const item = nftToOfferItem(props.nft, highestOfferPrice.value)
  makeOfferStore.setItem(item)

  preferencesStore.setMakeOfferModalOpen(true)
}

const onTradeActionClick = (cb: () => void) => {
  const fn = () => {
    if (!isOwner.value) {
      cb()
    }
  }

  if (isLogIn.value) {
    doAfterCheckCurrentChainVM(fn)
  }
  else {
    doAfterLogin({ onLoginSuccess: fn })
  }
}

const onMakeOfferClick = () => {
  onTradeActionClick(openOfferModal)
}

const onSwapClick = () => {
  onTradeActionClick(() => {
    const nft = props.nft
    const swap = swapStore.createSwap(nft.currentOwner)

    swapStore.updateItem({
      ...swap,
      desired: [
        {
          id: nft.id,
          collectionId: nft.collection.id,
          sn: nft.sn,
          name: nft.name,
          meta: nft.meta,
        },
      ],
    })

    navigateTo({
      name: 'prefix-swap-id',
      params: { id: nft.currentOwner },
      query: { swapId: swap.id },
    })
  })
}

useModalIsOpenTracker({
  isOpen: computed(() => preferencesStore.makeOfferModalOpen),
  onChange: () => makeOfferStore.clear(),
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.gallery-item-trade {
  button {
    font-size: 1rem;
    height: 3.375rem;
  }
}

@include until-widescreen {
  .gallery-item-trade {
    width: 100%;
    margin-top: 1rem !important;
    button {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
