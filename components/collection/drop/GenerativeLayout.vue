<template>
  <div class="unlockable-container">
    <div class="container is-fluid border-t pt-6">
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
            :current-account-minted-token="currentAccountMintedToken"
            @mint="handleSubmitMint" />
        </div>

        <div class="column pt-5 flex justify-center">
          <CollectionDropGenerativePreview
            :minted="userMintedCount"
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
          :current-account-minted-token="currentAccountMintedToken"
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
import { type DropMintedStatus } from '@/services/fxart'
import type {
  HolderOfCollectionProp,
  MinimumFundsProp,
  MintButtonProp,
} from './types'

withDefaults(
  defineProps<{
    collectionId: string
    description?: string
    drop: DropItem
    mintButton: MintButtonProp
    mintedCount: number
    mintCountAvailable: boolean
    maxCount: number
    minimumFunds: MinimumFundsProp
    isImageFetching: boolean
    isWalletConnecting: boolean
    isLoading: boolean
    holderOfCollection?: HolderOfCollectionProp
    userMintedNftId?: string
    userMintedCount: number
    currentAccountMintedToken?: DropMintedStatus

    handleSelectImage: (image: string) => void
    handleSubmitMint: () => void
  }>(),
  {
    description: '',
    userMintedNftId: undefined,
    currentAccountMintedToken: undefined,
    holderOfCollection: undefined,
  },
)

const { isMobile } = useViewport()
</script>
