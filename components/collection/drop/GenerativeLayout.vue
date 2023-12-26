<template>
  <div class="unlockable-container">
    <div class="container is-fluid border-top pt-6">
      <div class="columns is-desktop">
        <div class="column is-half-desktop mobile-padding">
          <UnlockableCollectionInfo
            :collection-id="collectionId"
            :description="description" />
          <hr />

          <UnlockableTag :collection-id="collectionId" />

          <CollectionDropMintSection
            v-if="!isMobile"
            :has-user-minted="hasUserMinted"
            :is-wallet-connecting="isWalletConnecting"
            :is-image-fetching="isImageFetching"
            :minimum-funds="minimumFunds"
            :minimum-funds-description="minimumFundsDescription"
            :max-count="maxCount"
            :minted-count="mintedCount"
            :mint-count-available="mintCountAvailable"
            :disabled="mintButtonDisabled"
            :mint-button-label="mintButtonLabel"
            @mint="handleSubmitMint" />
        </div>

        <div class="column pt-5 is-flex is-justify-content-center">
          <GenerativePreview
            :content="drop.content"
            :image="drop.image"
            @select="handleSelectImage" />
        </div>

        <CollectionDropMintSection
          v-if="isMobile"
          class="column"
          :has-user-minted="hasUserMinted"
          :is-wallet-connecting="isWalletConnecting"
          :is-image-fetching="isImageFetching"
          :minimum-funds="minimumFunds"
          :minimum-funds-description="minimumFundsDescription"
          :max-count="maxCount"
          :minted-count="mintedCount"
          :mint-count-available="mintCountAvailable"
          :disabled="mintButtonDisabled"
          :mint-button-label="mintButtonLabel"
          @mint="handleSubmitMint" />
      </div>

      <CollectionUnlockableItemInfo :collection-id="collectionId" />
      <div class="my-4">
        <CarouselTypeLatestMints
          :collection-id="collectionId"
          interaction="MINT" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UnlockableCollectionInfo from '@/components/collection/unlockable/UnlockableCollectionInfo.vue'
import UnlockableTag from '@/components/collection/unlockable/UnlockableTag.vue'
import CarouselTypeLatestMints from '@/components/carousel/CarouselTypeLatestMints.vue'
import GenerativePreview from '@/components/collection/drop/GenerativePreview.vue'

withDefaults(
  defineProps<{
    collectionId: string
    description?: string
    drop: any
    mintButtonDisabled: boolean

    mintedCount: number
    mintCountAvailable: boolean
    maxCount: number
    minimumFunds: number
    minimumFundsDescription: string
    isImageFetching: boolean
    isWalletConnecting: boolean
    disabled: boolean
    mintButtonLabel: string
    hasUserMinted?: string
    isHolderOfTargetCollection?: boolean
    holderOfCollectionId?: string

    handleSelectImage: (image: string) => void
    handleSubmitMint: () => void
  }>(),
  {
    hasUserMinted: undefined,
    isHolderOfTargetCollection: false,
    holderOfCollectionId: '',
  },
)

const { width } = useWindowSize()
const isMobile = computed(() => width.value <= 768)
</script>
