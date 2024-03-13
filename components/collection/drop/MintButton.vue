<template>
  <NeoButton
    ref="root"
    variant="k-accent"
    expanded
    no-shadow
    size="large"
    :loading="loading"
    :disabled="!enabled || loading"
    :loading-with-label="
      isCheckingMintRequirements ||
      dropStore.walletConnecting ||
      dropStore.loading
    "
    :label="label"
    @click="handleMint" />
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import useGenerativeDropMint, {
  useCollectionEntity,
} from '@/composables/drop/useGenerativeDropMint'
import { useDropStore } from '@/stores/drop'
import { useDrop, useDropMinimumFunds } from '@/components/drops/useDrops'
import { formatAmountWithRound } from '@/utils/format/balance'
import useHolderOfCollection from '@/composables/drop/useHolderOfCollection'

const emit = defineEmits(['mint'])

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { isLogIn } = useAuth()
const { chainSymbol, decimals } = useChain()
const dropStore = useDropStore()
const { hasCurrentChainBalance } = useMultipleBalance()
const { drop } = useDrop()
const { mintCountAvailable, selectedImage, maxCount } = useGenerativeDropMint()
const { mintedAmountForCurrentUser } = useCollectionEntity()

const { hasMinimumFunds } = useDropMinimumFunds()
const { holderOfCollection } = useHolderOfCollection()

const isHolderAndEligible = computed(
  () =>
    holderOfCollection.value.isHolder &&
    maxCount.value > dropStore.mintsCount &&
    hasMinimumFunds.value &&
    holderOfCollection.value.hasAvailable,
)

const mintForLabel = computed(() =>
  $i18n.t('drops.mintForPaid', [
    `${formatAmountWithRound(drop.value.price ?? '', decimals.value)} ${
      chainSymbol.value
    }`,
  ]),
)

const label = computed(() => {
  if (!isLogIn.value) {
    return $i18n.t('general.connect_wallet')
  }
  if (dropStore.walletConnecting) {
    return $i18n.t('shoppingCart.wallet')
  }
  if (dropStore.loading) {
    // TODO: listen to transaction status and update label accordingly
    return $i18n.t('loader.ipfs')
  }
  if (isCheckingMintRequirements.value) {
    return $i18n.t('checking')
  }
  if (!mintCountAvailable.value) {
    return $i18n.t('mint.unlockable.seeListings')
  }
  if (drop.value.userAccess === false) {
    return $i18n.t('mint.unlockable.notEligibility')
  }

  switch (drop.value.type) {
    case 'free':
      return $i18n.t('drops.mintForFree')
    case 'holder':
      return isHolderAndEligible.value
        ? mintForLabel.value
        : $i18n.t('mint.unlockable.notEligibility')
    case 'paid':
      return mintForLabel.value
    default:
      return $i18n.t('general.connect_wallet')
  }
})

const enabled = computed(() => {
  if (!isLogIn.value) {
    return true
  }
  if (!mintCountAvailable.value) {
    return true
  }
  if (
    Boolean(drop.value.disabled) || // drop is disabled
    !selectedImage.value || // no image
    isCheckingMintRequirements.value || // still checking requirements
    loading.value || // still loading
    drop.value.userAccess === false // no access due to geofencing
  ) {
    return false
  }

  switch (drop.value.type) {
    case 'free':
      return true
    case 'holder':
      return isHolderAndEligible.value
    case 'paid':
      return maxCount.value > mintedAmountForCurrentUser.value
    default:
      return false
  }
})

const loading = computed(
  () =>
    dropStore.isCaptutingImage ||
    dropStore.walletConnecting ||
    dropStore.loading,
)

const showHolderOfCollection = computed(() =>
  Boolean(holderOfCollection.value.id),
)

const isCheckingMintRequirements = computed(
  () =>
    showHolderOfCollection.value &&
    isLogIn.value &&
    (holderOfCollection.value.isLoading || !hasCurrentChainBalance.value),
)

const handleMint = () => {
  if (!mintCountAvailable.value) {
    return navigateTo(
      `/${urlPrefix.value}/collection/${drop.value.collection}?listed=true`,
    )
  }

  emit('mint')
}
</script>
