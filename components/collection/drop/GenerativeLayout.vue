<template>
  <div class="unlockable-container">
    <div class="container is-fluid border-top pt-6">
      <div class="columns is-desktop">
        <div class="column is-half-desktop mobile-padding">
          <CollectionUnlockableCollectionInfo
            :collection-id="collectionId"
            :description="description" />
          <hr />

          <CollectionUnlockableTag :collection-id="collectionId" />

          <CollectionDropMintSection
            v-if="!isMobile"
            :user-minted-nft-id="userMintedNftId"
            :is-wallet-connecting="isWalletConnecting"
            :is-image-fetching="isImageFetching"
            :is-loading="isLoading"
            :minimum-funds="minimumFunds"
            :minimum-funds-description="minimumFundsDescription"
            :max-count="maxCount"
            :minted-count="mintedCount"
            :mint-count-available="mintCountAvailable"
            :mint-button-disabled="mintButtonDisabled"
            :mint-button-label="mintButtonLabel"
            :is-holder-of-target-collection="isHolderOfTargetCollection"
            :holder-of-collection-id="holderOfCollectionId"
            @mint="handleSubmitMint" />
        </div>

        <div class="column pt-5 is-flex is-justify-content-center">
          <CollectionDropGenerativePreview
            :content="drop.content"
            :image="drop.image"
            @select="handleSelectImage" />
        </div>

        <CollectionDropMintSection
          v-if="isMobile"
          class="column"
          :user-minted-nft-id="userMintedNftId"
          :is-wallet-connecting="isWalletConnecting"
          :is-image-fetching="isImageFetching"
          :is-loading="isLoading"
          :minimum-funds="minimumFunds"
          :minimum-funds-description="minimumFundsDescription"
          :max-count="maxCount"
          :minted-count="mintedCount"
          :mint-count-available="mintCountAvailable"
          :mint-button-disabled="mintButtonDisabled"
          :mint-button-label="mintButtonLabel"
          :is-holder-of-target-collection="isHolderOfTargetCollection"
          :holder-of-collection-id="holderOfCollectionId"
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
import { DropItem } from '@/params/types'

withDefaults(
  defineProps<{
    collectionId: string
    description?: string
    drop: DropItem
    mintButtonDisabled: boolean

    mintedCount: number
    mintCountAvailable: boolean
    maxCount: number
    minimumFunds: bigint
    minimumFundsDescription: string
    isImageFetching: boolean
    isWalletConnecting: boolean
    isLoading: boolean
    mintButtonLabel: string
    userMintedNftId?: string
    isHolderOfTargetCollection?: boolean
    holderOfCollectionId?: string

    handleSelectImage: (image: string) => void
    handleSubmitMint: () => void
  }>(),
  {
    description: undefined,
    userMintedNftId: undefined,
    isHolderOfTargetCollection: false,
    holderOfCollectionId: '',
  },
)

const { width } = useWindowSize()
const isMobile = computed(() => width.value <= 768)
</script>
