<template>
  <div>
    <div>
      <div class="flex justify-between items-center mb-5">
        <div class="font-bold is-size-5">
          {{ $t('mint.unlockable.phase') }}
        </div>
        <div
          v-if="mintCountAvailable && !disabledByBackend"
          class="flex items-center">
          <img src="/unlockable-pulse.svg" alt="open" />
          {{ $t('mint.unlockable.open') }}
        </div>
      </div>
      <div class="flex justify-between items-center">
        <div>{{ mintedPercent }} %</div>
        <div class="font-bold">
          {{ mintedCount }} / {{ maxCount }}
          {{ $t('statsOverview.minted') }}
        </div>
      </div>
    </div>

    <div class="my-5">
      <CollectionUnlockableSlider :value="mintedCount / maxCount" />
    </div>

    <div>
      <div v-if="userMintedNftId" class="flex justify-end items-center">
        <div class="mr-2">
          {{ $t('mint.unlockable.nftAlreadyMinted') }}
        </div>
        <NeoIcon
          icon="circle-check has-text-success"
          pack="fass"
          class="mr-4" />
        <NeoButton
          class="my-2 mint-button"
          :tag="NuxtLink"
          :label="$t('mint.unlockable.seeYourNft')"
          :to="`/${urlPrefix}/gallery/${userMintedNftId}`" />
      </div>

      <CollectionDropMintSectionHolderOfCollectionMintRequirements
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
          :disabled="buttonMint.disabled"
          :loading-with-label="buttonMint.withLabel || isWalletConnecting"
          :label="buttonMint.label"
          @click="handleMint" />
      </CollectionDropMintSectionHolderOfCollectionMintRequirements>

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
          :disabled="buttonMint.disabled"
          :loading-with-label="buttonMint.withLabel || isWalletConnecting"
          :label="buttonMint.label"
          @click="handleMint" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import type {
  HolderOfCollectionProp,
  MinimumFundsProp,
  MintButtonProp,
} from '../types'

const NuxtLink = resolveComponent('NuxtLink')

const props = withDefaults(
  defineProps<{
    mintedCount: number
    mintCountAvailable: boolean
    disabledByBackend: number
    maxCount: number
    minimumFunds: MinimumFundsProp
    isImageFetching: boolean
    isWalletConnecting: boolean
    isLoading: boolean
    mintButton: MintButtonProp
    userMintedNftId?: string
    holderOfCollection?: HolderOfCollectionProp
    collectionId: string
    availableToMint?: number
  }>(),
  {
    userMintedNftId: undefined,
  },
)

const emit = defineEmits(['mint'])

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()

const loading = computed(
  () =>
    props.isImageFetching ||
    props.isWalletConnecting ||
    props.isLoading ||
    (!isMintedOut.value && isCheckingMintRequirements.value),
)

const mintedPercent = computed(() => {
  const percent = (props.mintedCount / props.maxCount) * 100
  return Math.round(percent)
})

const isMintedOut = computed(() => !props.mintCountAvailable)
const showHolderOfCollection = computed(() => !!props.holderOfCollection?.id)
const isCheckingMintRequirements = computed(
  () =>
    showHolderOfCollection.value &&
    (props.holderOfCollection?.isLoading || props.minimumFunds.isLoading),
)

const buttonMint = computed<{
  label: string
  disabled: boolean
  withLabel?: boolean
}>(() => {
  if (isMintedOut.value) {
    return {
      label: $i18n.t('mint.unlockable.seeListings'),
      disabled: false,
    }
  }

  if (isCheckingMintRequirements.value) {
    return {
      label: $i18n.t('checking'),
      disabled: true,
      withLabel: true,
    }
  }

  return {
    label: props.mintButton.label,
    disabled: props.mintButton.disabled,
  }
})

const handleMint = () => {
  if (isMintedOut.value) {
    return navigateTo(
      `/${urlPrefix.value}/collection/${props.collectionId}?listed=true`,
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

.holder-of-collection {
  @include mobile {
    .mint-button {
      width: 100%;
    }
  }
}
</style>
