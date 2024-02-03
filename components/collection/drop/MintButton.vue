<template>
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

    <div class="flex justify-end flex-wrap">
      <NeoButton
        ref="root"
        variant="k-accent"
        expanded
        no-shadow
        size="large"
        :loading="loading"
        :disabled="buttonMint.disabled"
        :loading-with-label="buttonMint.withLabel || isWalletConnecting"
        :label="buttonMint.label"
        @click="handleMint" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import type {
  HolderOfCollectionProp,
  MinimumFundsProp,
  MintButtonProp,
} from '@/components/collection/drop/types'

const NuxtLink = resolveComponent('NuxtLink')

const props = defineProps<{
  mintCountAvailable: boolean
  maxCount: number
  minimumFunds: MinimumFundsProp
  isImageFetching: boolean
  isWalletConnecting: boolean
  isLoading: boolean
  mintButton: MintButtonProp
  userMintedNftId?: string
  holderOfCollection?: HolderOfCollectionProp
  collectionId: string
}>()

const emit = defineEmits(['mint'])

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()

const loading = computed(
  () => props.isImageFetching || props.isWalletConnecting || props.isLoading,
)

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
