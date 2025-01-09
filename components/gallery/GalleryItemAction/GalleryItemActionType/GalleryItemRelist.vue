<template>
  <div>
    <GalleryItemPriceSection
      title="Price"
      :price="nftPrice"
    >
      <div class="flex gallery-item-relist">
        <NeoButton
          :label="
            isListed ? $t('transaction.price.change') : $t('transaction.list')
          "
          size="large"
          fixed-width
          :variant="isListed ? undefined : 'primary'"
          @click="openListCartModal"
        />
      </div>
    </GalleryItemPriceSection>

    <ListingCartModal />
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import type { NFT } from '@/types'
import { nftToListingCartItem } from '@/components/common/shoppingCart/utils'
import { useCollectionDetails } from '@/components/collection/utils/useCollectionDetails'
import ListingCartModal from '@/components/common/listingCart/ListingCartModal.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { useListingCartStore } from '@/stores/listingCart'

const props = defineProps<{
  nft: NFT
}>()

const preferencesStore = usePreferencesStore()
const listingCartStore = useListingCartStore()

const { stats } = useCollectionDetails({
  collectionId: computed(() => props.nft.collection.id),
})
const nftPrice = computed(() => props.nft.price || '')

const openListCartModal = () => {
  listingCartStore.clear()
  listingCartStore.setItem(
    nftToListingCartItem(
      props.nft,
      String(stats.value.collectionFloorPrice ?? ''),
    ),
  )
  preferencesStore.listingCartModalOpen = true
}

watch(
  () => preferencesStore.listingCartModalOpen,
  (isOpen) => {
    if (!isOpen) {
      onListingModalClose()
    }
  },
)

const onListingModalClose = () => {
  setTimeout(() => {
    listingCartStore.clear()
  }, 500) // wait for modal animation
}

const isListed = computed(() => Boolean(Number(nftPrice.value)))
</script>

<style lang="scss" scoped>
.gallery-item-relist {
  button {
    font-size: 1rem;
    height: 3.375rem;
  }
}

// until 1215px
@media screen and (max-width: 1215px) {
  .gallery-item-relist {
    width: 100%;
    margin-top: 1rem !important;
    button {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
