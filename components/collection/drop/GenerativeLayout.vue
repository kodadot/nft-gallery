<template>
  <div class="border-t">
    <div
      class="relative w-full mx-auto px-[1.25rem] md:px-[2.5rem] min-[1440px]:max-w-[1440px]">
      <div class="columns is-variable is-4-tablet">
        <div class="column is-half-desktop mobile-padding lg:max-w-[600px]">
          <div class="flex justify-between flex-wrap max-w-[504px]">
            <div class="mt-7 mr-2">
              <div class="font-bold is-size-5 mb-4 capitalize">
                {{ $t('tooltip.created') }}
              </div>
              <CollectionDropCreatedBy v-if="address" :address="address" />
            </div>
            <div class="mt-7">
              <div class="font-bold is-size-5 mb-4 capitalize">
                {{ $t('tooltip.collectedBy') }}
              </div>
              <CollectionDropCollectedBy :addresses="ownerAddresses" />
            </div>
          </div>

          <CollectionUnlockableCollectionInfo
            class="mt-7"
            :collection-id="collectionId"
            :description="description" />

          <hr class="hidden md:block mt-7 mb-0" />

          <CollectionDropGenerativePreview
            class="md:hidden mt-7"
            :minted="userMintedCount"
            :drop="drop"
            :user-minted-nft-id="userMintedNftId"
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
            :mint-button="mintButton"
            :holder-of-collection="holderOfCollection"
            :drop-status="formattedDropItem?.status"
            :drop-start-time="formattedDropItem?.dropStartTime" />

          <CollectionUnlockableTag :collection-id="collectionId" />
        </div>

        <div class="column hidden md:flex justify-end mt-[-213px]">
          <CollectionDropGenerativePreview
            :minted="userMintedCount"
            :drop="drop"
            :user-minted-nft-id="userMintedNftId"
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
      <div class="mb-4 mt-10">
        <CarouselTypeLatestMints
          :collection-id="collectionId"
          interaction="MINT" />
      </div>
    </div>
  </div>

  <CollectionDropCursorParty
    :drop-alias="drop.alias"
    :user-minted-count="userMintedCount" />
</template>

<script setup lang="ts">
import { DropItem } from '@/params/types'
import { Drop, getFormattedDropItem } from '@/components/drops/useDrops'
import { useCollectionActivity } from '@/composables/collectionActivity/useCollectionActivity'
import type {
  HolderOfCollectionProp,
  MinimumFundsProp,
  MintButtonProp,
} from './types'
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'
import { DropEventType } from '@/composables/party/types'

const props = withDefaults(
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
    handleSelectImage: (image: string) => void
    handleSubmitMint: () => void
  }>(),
  {
    description: '',
    userMintedNftId: undefined,
  },
)

const { emitEvent, completeLastEvent } = useCursorDropEvents(props.drop.alias)
const { collection: collectionInfo } = useCollectionMinimal({
  collectionId: computed(() => props.collectionId),
})
const address = computed(() => collectionInfo.value?.currentOwner)

const { owners } = useCollectionActivity({ collectionId: props.collectionId })
const ownerAddresses = computed(() => Object.keys(owners.value || {}))

const formattedDropItem = ref<Drop>()
watch(
  [collectionInfo],
  async () => {
    if (collectionInfo.value) {
      formattedDropItem.value = await getFormattedDropItem(
        collectionInfo.value,
        props.drop,
      )
    }
  },
  { immediate: true },
)

const handleNftGeneration = ({ image }: { image: string }) => {
  emitEvent(DropEventType.DROP_GENERATING)
  props.handleSelectImage(image)
}

const handleNftGenerationEnd = () => {
  completeLastEvent(DropEventType.DROP_GENERATING)
}
</script>
