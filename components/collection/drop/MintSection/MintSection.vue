<template>
  <div>
    <div>
      <div class="flex justify-between items-center mb-5">
        <div class="has-text-weight-bold is-size-5">
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
        <div class="has-text-weight-bold">
          {{ mintedCount }} / {{ maxCount }}
          {{ $t('statsOverview.minted') }}
        </div>
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

      <HolderOfGenerativeMintRequirements
        v-else-if="showHolderOfCollection"
        class="my-5"
        :holder-of-collection="{
          isHolder: holderOfCollection.isHolderOfTargetCollection,
          collectionId: holderOfCollection.id,
        }"
        :minimum-funds="minimumFunds"
        :is-minted-out="isMintedOut"
        :user-max-available-to-mint="userMaxAvailableToMint"
        :user-minted-count="userMintedCount">
        <NeoButton
          ref="root"
          class="ml-5 my-2 mint-button"
          variant="k-accent"
          :loading="loading"
          :disabled="mintButtonDisabled"
          :loading-with-label="isWalletConnecting"
          :label="mintButtonLabel"
          @click="handleMint" />
      </HolderOfGenerativeMintRequirements>

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
  </div>
</template>

<script setup lang="ts">
import UnlockableSlider from '@/components/collection/unlockable/UnlockableSlider.vue'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import HolderOfGenerativeMintRequirements from './HolderOfGenerativeMintRequirements.vue'

const NuxtLink = resolveComponent('NuxtLink')

const props = withDefaults(
  defineProps<{
    mintedCount: number
    mintCountAvailable: boolean
    disabledByBackend: number
    maxCount: number
    minimumFunds: { amount: number; description: string }
    isImageFetching: boolean
    isWalletConnecting: boolean
    isLoading: boolean
    mintButton: { label: string; disabled: boolean }
    userMintedNftId?: string
    userMaxAvailableToMint: number
    userMintedCount: number
    holderOfCollection?: { id?: string; isHolderOfTargetCollection?: boolean }
    collectionId: string
    availableToMint?: number
  }>(),
  {
    userMintedNftId: undefined,
    holderOfCollection: () => ({ id: '', isHolderOfTargetCollection: false }),
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

const isMintedOut = computed(() => !props.mintCountAvailable)

const mintButtonLabel = computed(() =>
  isMintedOut.value
    ? $i18n.t('mint.unlockable.seeListings')
    : props.mintButton.label,
)

const mintButtonDisabled = computed(() =>
  isMintedOut.value ? false : props.mintButton.disabled,
)

const showHolderOfCollection = computed(() => !!props.holderOfCollection.id)

const handleMint = () => {
  if (isMintedOut.value) {
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

.holder-of-collection {
  @include mobile {
    .mint-button {
      width: 100%;
    }
  }
}
</style>
