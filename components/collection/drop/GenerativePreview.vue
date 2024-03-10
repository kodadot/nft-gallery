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
      v-if="dropStore.loading"
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
          {{ mintedCount }}/{{ maxCount }}
          {{ $t('statsOverview.minted') }}
        </div>
      </div>
    </div>

    <CollectionUnlockableSlider
      class="text-neutral-5 dark:text-neutral-9"
      :value="mintedCount / maxCount" />

    <CollectionDropMintButton
      class="mt-6"
      :holder-of-collection="holderOfCollection"
      @mint="emit('mint')" />

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
import { blake2AsHex, encodeAddress } from '@polkadot/util-crypto'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import type { HolderOfCollectionProp } from '@/components/collection/drop/types'
import { getRandomIntFromRange } from '../unlockable/utils'
import { isValidSs58Format } from '@/utils/ss58Format'
import useGenerativeIframeData from '@/composables/drop/useGenerativeIframeData'
import { useDrop } from '@/components/drops/useDrops'
import useGenerativeDropMint, {
  useCollectionEntity,
} from '@/composables/drop/useGenerativeDropMint'

defineProps<{
  holderOfCollection?: HolderOfCollectionProp
}>()

const { drop } = useDrop()
const dropStore = useDropStore()

const { maxCount, mintedCount, mintCountAvailable } = useGenerativeDropMint()
const { mintedAmountForCurrentUser } = useCollectionEntity()

watch(
  [mintedCount, maxCount, () => dropStore.mintedDropCount],
  () => {
    console.log('debug - watch mintedCount', mintedCount.value)
    console.log('debug - watch maxCount', maxCount.value)
    console.log('debug - watch mintedDropCount', dropStore.mintedDropCount)
  },
  { immediate: true },
)

const emit = defineEmits(['generation:start', 'generation:end', 'mint'])
const { imageDataPayload, imageDataLoaded } = useGenerativeIframeData()

const { start: startTimer } = useTimeoutFn(() => {
  // quick fix: ensure that even if the completed event is not received, the loading state of the drop can be cleared
  // only applicable if the drop is old one that missing`kodahash/render/completed` event

  if (!mintCountAvailable.value && !imageDataLoaded.value) {
    dropStore.setLoading(false)
    emit('generation:end')
  }
}, 5000)

const { accountId } = useAuth()
const { chainSymbol, decimals } = useChain()

const mintedPercent = computed(() => {
  const percent = (mintedCount.value / maxCount.value) * 100
  return Math.round(percent)
})

const { formatted: formattedPrice } = useAmount(
  computed(() => drop.value?.price),
  decimals,
  chainSymbol,
)

const STEP = 64
const entropyRange = computed<[number, number]>(() => [
  STEP * mintedAmountForCurrentUser.value,
  STEP * (mintedAmountForCurrentUser.value + 1),
])

const getHash = () => {
  const randomSs58Format = getRandomIntFromRange(
    entropyRange.value[0],
    entropyRange.value[1],
  )

  const ss58Format = isValidSs58Format(randomSs58Format) ? randomSs58Format : 0

  // https://github.com/paritytech/ss58-registry/blob/30889d6c9d332953a6e3333b30513eef89003f64/ss58-registry.json#L1292C17-L1292C22
  const initialValue = accountId.value
    ? encodeAddress(accountId.value, ss58Format)
    : String(Date.now() << ss58Format)
  return blake2AsHex(initialValue, 256, null, true)
}

const generativeImageUrl = ref('')

const displayUrl = computed(() => generativeImageUrl.value || drop.value?.image)
const generateNft = () => {
  dropStore.setLoading(true)
  startTimer()
  const metadata = `${drop.value?.content}/?hash=${getHash()}`
  console.log('metadata', metadata)
  generativeImageUrl.value = metadata
  emit('generation:start', { image: generativeImageUrl.value })
  imageDataPayload.value = undefined
}

watch(imageDataLoaded, () => {
  if (imageDataLoaded.value) {
    dropStore.setLoading(false)
    emit('generation:end')
  }
})

watch(
  [accountId, () => drop.value?.content],
  () => {
    if (drop.value?.content) {
      generateNft()
    }
  },
  { immediate: true },
)

watchDebounced(
  [imageDataPayload],
  () => {
    if (imageDataPayload.value?.image === 'data:,') {
      generateNft()
    }
  },
  { debounce: 1000 },
)
</script>
