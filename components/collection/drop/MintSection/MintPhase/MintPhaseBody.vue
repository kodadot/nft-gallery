<template>
  <div class="flex justify-between items-center mt-5">
    <div>{{ mintedPercent }} %</div>
    <div class="has-text-weight-bold">
      {{ mintedCount }} / {{ maxCount }}
      {{ $t('statsOverview.minted') }}
    </div>
  </div>

  <div class="my-5">
    <UnlockableSlider :value="mintedCount / maxCount" />
  </div>

  <div>
    <div v-if="userMintedNftId" class="flex justify-end items-center">
      <div class="mr-2">
        {{ $t('mint.unlockable.nftAlreadyMinted') }}
      </div>
      <NeoIcon icon="circle-check has-text-success" pack="fass" class="mr-4" />
      <NeoButton
        class="my-2 mint-button"
        :tag="NuxtLink"
        :label="$t('mint.unlockable.seeYourNft')"
        :to="`/${urlPrefix}/gallery/${userMintedNftId}`" />
    </div>

    <HolderOfCollectionMintRequirements
      v-else-if="showHolderOfCollection && holderOfCollection"
      class="my-5"
      :holder-of-collection="holderOfCollection"
      :minimum-funds="minimumFunds"
      :is-minted-out="isMintedOut">
      <NeoButton
        ref="root"
        class="mint-button"
        variant="k-accent"
        :loading="loading"
        :disabled="mintButtonDisabled"
        :loading-with-label="isWalletConnecting"
        :label="mintButtonLabel"
        @click="handleMint" />
    </HolderOfCollectionMintRequirements>

    <div v-else class="flex justify-end flex-wrap">
      <div v-if="minimumFunds.amount" class="flex items-center">
        <NeoIcon icon="circle-info" class="mr-3" />
        <div
          v-dompurify-html="minimumFunds.description"
          class="minimum-funds-description" />
      </div>

      <NeoButton
        ref="root"
        class="ml-5 my-2 mint-button"
        variant="k-accent"
        :loading="loading"
        :disabled="mintButtonDisabled"
        :loading-with-label="isWalletConnecting"
        :label="mintButtonLabel"
        @click="handleMint" />
    </div>
  </div>
</template>

<script setup lang="ts">
import UnlockableSlider from '@/components/collection/unlockable/UnlockableSlider.vue'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import HolderOfCollectionMintRequirements from '../HolderOfCollectionMintRequirements.vue'
import {
  HolderOfCollectionProp,
  MinimumFundsProp,
  MintPhaseState,
  PhaseType,
} from '../../types'

const NuxtLink = resolveComponent('NuxtLink')

const props = withDefaults(
  defineProps<{
    mintedCount: number
    isMintedOut: boolean
    maxCount: number
    state: MintPhaseState
    type: PhaseType
    hasPhaseOpen: boolean
    minimumFunds: MinimumFundsProp
    isImageFetching: boolean
    isWalletConnecting: boolean
    isLoading: boolean
    mintButton: { label: string; disabled: boolean }
    userMintedNftId?: string
    holderOfCollection?: HolderOfCollectionProp
    collectionId: string
    availableToMint?: number
    isLastPhase: boolean
  }>(),
  {
    userMintedNftId: undefined,
  },
)

const emit = defineEmits(['mint'])

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()

const loading = computed(
  () => props.isImageFetching || props.isWalletConnecting || props.isLoading,
)

const mintedPercent = computed(() => {
  const percent = (props.mintedCount / props.maxCount) * 100
  return Math.round(percent)
})

const showMintedOut = computed(() => props.isMintedOut && props.isLastPhase)

const mintButtonLabel = computed(() => {
  if (showMintedOut.value) {
    return $i18n.t('mint.unlockable.seeListings')
  }

  if (props.state !== MintPhaseState.OPEN) {
    return $i18n.t('mint.unlockable.phaseNotOpen')
  }

  return props.mintButton.label
})

const mintButtonDisabled = computed(() => {
  if (showMintedOut.value) {
    return false
  }

  if (props.state !== MintPhaseState.OPEN) {
    return true
  }

  return props.mintButton.disabled
})

const showHolderOfCollection = computed(
  () => !!props.holderOfCollection?.id && props.type === PhaseType.HOLDER_OF,
)

const handleMint = () => {
  if (props.isMintedOut) {
    return navigateTo(
      `/${urlPrefix.value}/explore/items?listed=true&collections=${props.collectionId}`,
    )
  }

  emit('mint')
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.minimum-funds-description {
  max-width: 314px;
}

.mint-button {
  width: 14rem;
  height: 3.5rem;
}
</style>
