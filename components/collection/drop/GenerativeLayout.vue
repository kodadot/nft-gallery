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
            :collection-id="collectionId"
            :is-wallet-connecting="isWalletConnecting"
            :is-image-fetching="isImageFetching"
            :is-loading="isLoading"
            :minimum-funds="minimumFunds"
            :max-count="maxCount"
            :minted-count="mintedCount"
            :mint-count-available="mintCountAvailable"
            :disabled-by-backend="drop.disabled"
            :mint-button="mintButton"
            :holder-of-collection="holderOfCollection"
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
          :collection-id="collectionId"
          :user-minted-nft-id="userMintedNftId"
          :is-wallet-connecting="isWalletConnecting"
          :is-image-fetching="isImageFetching"
          :is-loading="isLoading"
          :minimum-funds="minimumFunds"
          :max-count="maxCount"
          :minted-count="mintedCount"
          :mint-count-available="mintCountAvailable"
          :disabled-by-backend="drop.disabled"
          :mint-button="mintButton"
          :holder-of-collection="holderOfCollection"
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
    mintButton: { label: string; disabled: boolean }
    mintedCount: number
    mintCountAvailable: boolean
    maxCount: number
    minimumFunds: { amount: number; description: string }
    isImageFetching: boolean
    isWalletConnecting: boolean
    isLoading: boolean
    holderOfCollection?: {
      id?: string
      isHolder?: boolean
      amount?: {
        total: number
        used: number
      }
    }
    userMintedNftId?: string

    handleSelectImage: (image: string) => void
    handleSubmitMint: () => void
  }>(),
  {
    description: '',
    userMintedNftId: undefined,
    holderOfCollection: () => ({ id: '', isHolderOfTargetCollection: false }),
  },
)

const { isMobile } = useViewport()
</script>
