<template>
  <div
    data-partykit="generative-preview-card"
    class="border bg-background-color shadow-primary p-5 pb-6 w-full h-min lg:max-w-[490px] relative">
    <BaseMediaItem
      :src="sanitizeIpfsUrl(displayUrl)"
      :mime-type="generativeImageUrl ? 'text/html' : ''"
      preview
      is-detail
      class="border" />

    <NeoButton
      v-if="isLoading"
      class="mt-5 h-[40px] border-k-grey pointer-events-auto cursor-wait hover:!bg-transparent"
      expanded
      rounded
      no-shadow
      disabled>
      <div class="inline-flex items-center">
        <span class="mr-2">{{ $t('mint.unlockable.generating') }}</span>
        <NeoIcon icon="circle-notch" spin />
      </div>
    </NeoButton>

    <NeoButton
      v-else
      class="mt-5 h-[40px] border-k-grey hover:!bg-transparent"
      expanded
      rounded
      no-shadow
      @click="generateNft()">
      <div class="inline-flex items-center">
        <span>{{ $t('drops.createNewVariation') }}</span>
        <NeoIcon icon="arrow-rotate-left" class="ml-2" />
      </div>
    </NeoButton>

    <hr class="my-5" />

    <div class="flex justify-between items-center mb-4">
      <div class="font-bold">
        <span v-if="!!Number(drop.price)">{{ formattedPrice }}</span>
        <span v-else>{{ $t('free') }}</span>
      </div>
      <div class="flex justify-end items-center">
        <div class="mr-4 text-neutral-7">{{ mintedPercent }}% ~</div>
        <div class="font-bold">
          {{ mintedCount }}/{{ maxCount }}
          {{ $t('statsOverview.minted') }}
        </div>
      </div>
    </div>

    <CollectionUnlockableSlider
      class="text-neutral-5 dark:text-neutral-9"
      :value="mintedCount / maxCount" />

    <div class="flex mt-6 gap-4">
      <NeoStepper
        v-model="amount"
        :max="availableAmountToMint"
        class="[&>.neo-input]:h-full [&>.neo-input>input]:h-full w-[200px]" />

      <CollectionDropMintButton
        :collection-id="collectionId"
        :is-wallet-connecting="isWalletConnecting"
        :is-image-fetching="isImageFetching"
        :is-loading="isLoading"
        :minimum-funds="minimumFunds"
        :max-count="maxCount"
        :mint-count-available="mintCountAvailable"
        :mint-button="mintButton"
        :holder-of-collection="holderOfCollection"
        @mint="emit('mint')" />
    </div>

    <div
      class="flex justify-center w-full absolute -bottom-20 sm:-bottom-16 text-sm left-[50%] -translate-x-[50%]">
      <p class="p-2 bg-neutral-3 text-k-grey-fix dark:bg-neutral-11">
        <NeoIcon
          icon="fa-sharp fa-solid fa-hourglass-half"
          pack="fa-regular" />&nbsp; Please Note: Algorithms May Take Longer To
        Generate
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoStepper } from '@kodadot1/brick'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { DropItem } from '@/params/types'
import type {
  HolderOfCollectionProp,
  MinimumFundsProp,
  MintButtonProp,
} from '@/components/collection/drop/types'
import useGenerativeIframeData from '@/composables/drop/useGenerativeIframeData'
import useGenerativePreview from '@/composables/drop/useGenerativePreview'

const emit = defineEmits(['generation:start', 'generation:end', 'mint'])
const props = defineProps<{
  amountToMint: number
  availableAmountToMint: number
  drop: DropItem
  minted: number
  collectionId: string
  mintedCount: number
  mintCountAvailable: boolean
  maxCount: number
  minimumFunds: MinimumFundsProp
  isImageFetching: boolean
  isWalletConnecting: boolean
  isLoading: boolean
  mintButton: MintButtonProp
  holderOfCollection?: HolderOfCollectionProp
}>()

const amount = useVModel(props, 'amountToMint')

const { imageDataPayload, imageDataLoaded } = useGenerativeIframeData()
const { accountId } = useAuth()
const { chainSymbol, decimals } = useChain()

const mintedPercent = computed(() => {
  const percent = (props.mintedCount / props.maxCount) * 100
  return Math.round(percent)
})

const { formatted: formattedPrice } = useAmount(
  computed(() => props.drop.price),
  decimals,
  chainSymbol,
)

const { generatePreviewItem, getEntropyRange } = useGenerativePreview(
  props.drop,
)

const generativeImageUrl = ref('')

const isLoading = ref(false)

const displayUrl = computed(() => {
  return generativeImageUrl.value || props.drop.image
})

const generateNft = () => {
  isLoading.value = true
  const previewItem = generatePreviewItem(getEntropyRange(props.minted))
  generativeImageUrl.value = previewItem.image
  emit('generation:start', previewItem)
  imageDataPayload.value = undefined
}

watch(imageDataLoaded, () => {
  if (imageDataLoaded.value) {
    isLoading.value = false
    emit('generation:end')
  }
})

watch(
  accountId,
  () => {
    generateNft()
  },
  {
    immediate: true,
  },
)
</script>
