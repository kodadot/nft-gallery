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
      v-if="dropStore.isCapturingImage"
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
        <span v-if="!!Number(drop?.price)">{{ formattedPrice }}</span>
        <span v-else>{{ $t('free') }}</span>
      </div>
      <div class="flex justify-end items-center">
        <div class="mr-4 text-neutral-7">{{ mintedPercent }}% ~</div>
        <div class="font-bold">
          {{ dropStore.mintsCount }}/{{ maxCount }}
          {{ $t('statsOverview.minted') }}
        </div>
      </div>
    </div>

    <CollectionUnlockableSlider
      class="text-neutral-5 dark:text-neutral-9"
      :value="dropStore.mintsCount / maxCount" />

    <div class="flex mt-6 gap-4 max-md:flex-col">
      <CollectionDropMintStepper />
      <CollectionDropMintButton @mint="emit('mint')" />
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
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import useGenerativeIframeData from '@/composables/drop/useGenerativeIframeData'
import { useDrop } from '@/components/drops/useDrops'
import useGenerativeDropMint, {
  useCollectionEntity,
} from '@/composables/drop/useGenerativeDropMint'

const { accountId } = useAuth()
const { chainSymbol, decimals } = useChain()
const { drop } = useDrop()
const dropStore = useDropStore()
const { maxCount } = useGenerativeDropMint()
const { mintedAmountForCurrentUser } = useCollectionEntity()
const { imageDataPayload, imageDataLoaded } = useGenerativeIframeData()
const { formatted: formattedPrice } = useAmount(
  computed(() => drop.value.price),
  decimals,
  chainSymbol,
)

const emit = defineEmits(['generation:start', 'generation:end', 'mint'])

const { start: startTimer } = useTimeoutFn(() => {
  // quick fix: ensure that even if the completed event is not received, the loading state of the drop can be cleared
  // only applicable if the drop is missing`kodahash/render/completed` event
  if (!imageDataLoaded.value) {
    dropStore.setIsCapturingImage(false)
    emit('generation:end')
  }
}, 5000)

const generativeImageUrl = ref('')

const mintedPercent = computed(() => {
  if (!maxCount.value) {
    return 0
  }
  return Math.round((dropStore.mintsCount / maxCount.value) * 100)
})

const displayUrl = computed(() => generativeImageUrl.value || drop.value?.image)

const generateNft = () => {
  if (!drop.value?.content) {
    return
  }
  dropStore.setIsCapturingImage(true)
  startTimer()

  const previewItem = generatePreviewItem({
    entropyRange: getEntropyRange(mintedAmountForCurrentUser.value),
    accountId: accountId.value,
    content: drop.value.content,
  })

  generativeImageUrl.value = previewItem.image

  emit('generation:start', previewItem)
  imageDataPayload.value = undefined
}

watch(imageDataLoaded, () => {
  if (imageDataLoaded.value) {
    dropStore.setIsCapturingImage(false)
    emit('generation:end')
  }
})

watch(
  [accountId, () => drop.value.content, mintedAmountForCurrentUser],
  generateNft,
)

onMounted(() => {
  setTimeout(generateNft, 500)
})
</script>
