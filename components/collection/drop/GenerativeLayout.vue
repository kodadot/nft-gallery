<template>
  <div class="border-t">
    <div
      class="relative w-full mx-auto px-[1.25rem] md:px-[2.5rem] min-[1440px]:max-w-[1440px] pt-6">
      <div class="columns is-variable is-4-tablet">
        <div class="column is-half-desktop mobile-padding lg:max-w-[600px]">
          <div class="font-bold is-size-5 mb-4">
            {{ $t('tooltip.created') }}
          </div>
          <CollectionDropCreatedBy v-if="address" :address="address" />
          <CollectionUnlockableCollectionInfo
            class="mt-7"
            :collection-id="collectionId"
            :description="description" />

          <hr class="hidden md:block mt-7 mb-0" />

          <CollectionDropGenerativePreview
            v-model:amount-to-mint="amount"
            :available-amount-to-mint="availableAmountToMint"
            class="md:hidden mt-7"
            :minted="userMintedCount"
            :drop="drop"
            :collection-id="collectionId"
            :is-wallet-connecting="isWalletConnecting"
            :is-image-fetching="isImageFetching"
            :is-loading="isLoading"
            :minimum-funds="minimumFunds"
            :max-count="maxCount"
            :minted-count="mintedCount"
            :mint-count-available="mintCountAvailable"
            :mint-button="mintButton"
            :holder-of-collection="holderOfCollection"
            @mint="handleSubmitMint"
            @generation:start="handleNftGeneration"
            @generation:end="handleNftGenerationEnd" />

          <CollectionDropPhase
            class="mt-7"
            :minimum-funds="minimumFunds"
            :mint-count-available="mintCountAvailable"
            :disabled-by-backend="drop.disabled"
            :mint-button="mintButton"
            :holder-of-collection="holderOfCollection" />

          <CollectionUnlockableTag :collection-id="collectionId" />
        </div>

        <div class="column hidden md:flex justify-end mt-[-245px]">
          <CollectionDropGenerativePreview
            v-model:amount-to-mint="amount"
            :available-amount-to-mint="availableAmountToMint"
            :minted="userMintedCount"
            :drop="drop"
            :collection-id="collectionId"
            :is-wallet-connecting="isWalletConnecting"
            :is-image-fetching="isImageFetching"
            :is-loading="isLoading"
            :minimum-funds="minimumFunds"
            :max-count="maxCount"
            :minted-count="mintedCount"
            :mint-count-available="mintCountAvailable"
            :mint-button="mintButton"
            :holder-of-collection="holderOfCollection"
            @mint="handleSubmitMint"
            @generation:start="handleNftGeneration"
            @generation:end="handleNftGenerationEnd" />
        </div>
      </div>

      <CollectionUnlockableItemInfo :collection-id="collectionId" />

      <hr class="my-20" />

      <LazyCollectionDropItemsGrid class="mb-4" :collection-id="collectionId" />
    </div>
  </div>

  <CollectionDropCursorParty
    :drop-alias="drop.alias"
    :user-minted-count="userMintedCount" />
</template>

<script setup lang="ts">
import { DropItem } from '@/params/types'
import type {
  HolderOfCollectionProp,
  MinimumFundsProp,
  MintButtonProp,
} from './types'
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'
import { DropEventType } from '@/composables/party/types'
import { GenerativePreviewItem } from '@/composables/drop/useGenerativePreview'

const props = withDefaults(
  defineProps<{
    collectionId: string
    amountToMint: number
    availableAmountToMint: number
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
    userMintedCount: number
    handleSelectImage: (preview: GenerativePreviewItem) => void
    handleSubmitMint: () => void
  }>(),
  {
    description: '',
    holderOfCollection: undefined,
  },
)

const amount = useVModel(props, 'amountToMint')

const { emitEvent, completeLastEvent } = useCursorDropEvents(props.drop.alias)
const { collection: collectionInfo } = useCollectionMinimal({
  collectionId: computed(() => props.collectionId),
})
const address = computed(() => collectionInfo.value?.currentOwner)

const handleNftGeneration = (preview: GenerativePreviewItem) => {
  emitEvent(DropEventType.DROP_GENERATING)
  props.handleSelectImage(preview)
}

const handleNftGenerationEnd = () => {
  completeLastEvent(DropEventType.DROP_GENERATING)
}
</script>
