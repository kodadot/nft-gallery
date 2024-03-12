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
      isCheckingMintRequirements || dropStore.walletConnecting
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
    `${formatAmountWithRound(drop.value?.price ?? '', decimals.value)} ${
      chainSymbol.value
    }`,
  ]),
)

const label = computed(() => {
  if (!mintCountAvailable.value) {
    return $i18n.t('mint.unlockable.seeListings')
  }
  if (isCheckingMintRequirements.value) {
    return $i18n.t('checking')
  }

  if (dropStore.walletConnecting) {
    return $i18n.t('shoppingCart.wallet')
  }
  if (!isLogIn.value) {
    return $i18n.t('general.connect_wallet')
  }

  switch (drop.value?.type) {
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
  if (!mintCountAvailable.value) {
    return true
  }
  if (!isLogIn.value) {
    return true
  }
  if (
    Boolean(drop.value?.disabled) ||
    !selectedImage.value ||
    isCheckingMintRequirements.value ||
    loading.value
  ) {
    return false
  }

  switch (drop.value?.type) {
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
  Boolean(holderOfCollection.value?.id),
)

const isCheckingMintRequirements = computed(
  () =>
    showHolderOfCollection.value &&
    isLogIn.value &&
    (holderOfCollection.value?.isLoading || !hasCurrentChainBalance.value),
)

const handleMint = () => {
  if (!mintCountAvailable.value) {
    return navigateTo(
      `/${urlPrefix.value}/collection/${drop.value?.collection}?listed=true`,
    )
  }

  emit('mint')
}
</script>
