<template>
  <NeoButton
    ref="root"
    variant="k-accent"
    expanded
    no-shadow
    size="large"
    :loading="loading"
    :disabled="buttonMint.disabled && !isWalletConnecting"
    :loading-with-label="buttonMint.withLabel || isWalletConnecting"
    :label="buttonMint.label"
    @click="handleMint" />
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import type {
  HolderOfCollectionProp,
  MinimumFundsProp,
  MintButtonProp,
} from '@/components/collection/drop/types'

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
    disabled: props.mintButton.disabled || loading.value,
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
