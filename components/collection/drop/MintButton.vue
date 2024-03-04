<template>
  <NeoButton
    ref="root"
    variant="k-accent"
    expanded
    no-shadow
    size="large"
    :loading="loading"
    :disabled="buttonMint.disabled"
    :loading-with-label="buttonMint.withLabel || dropStore.walletConnecting"
    :label="buttonMint.label"
    @click="handleMint" />
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import type { HolderOfCollectionProp } from '@/components/collection/drop/types'
import useGenerativeDropMint from '@/composables/drop/useGenerativeDropMint'
import { useDropStore } from '@/stores/drop'
import { useDrop, useDropMinimumFunds } from '@/components/drops/useDrops'
import holderOfCollectionById from '@/queries/subsquid/general/holderOfCollectionById.graphql'
import { formatAmountWithRound } from '@/utils/format/balance'

const props = defineProps<{
  holderOfCollection?: HolderOfCollectionProp
}>()

const emit = defineEmits(['mint'])

const { $i18n } = useNuxtApp()
const { urlPrefix, client } = usePrefix()
const { isLogIn, accountId } = useAuth()
const { chainSymbol, decimals } = useChain()
const dropStore = useDropStore()
const { hasCurrentChainBalance } = useMultipleBalance()
const { drop } = useDrop()
const {
  mintCountAvailable,
  selectedImage,
  mintedAmountForCurrentUser,
  maxCount,
} = useGenerativeDropMint()
const { hasMinimumFunds } = useDropMinimumFunds()
const { data: holderOfCollectionData } = await useAsyncData(
  'holderOfCollectionData',
  async () =>
    await useAsyncQuery({
      clientId: client.value,
      query: holderOfCollectionById,
      variables: {
        id: drop.value?.holder_of,
        account: accountId.value,
      },
    }).then((res) => res.data.value),
  {
    watch: [accountId, () => dropStore.runtimeMintCount],
  },
)

const isHolderAndEligible = computed(() => {
  // Determine the max mint limit for the current user based on the holderOfCollectionData
  const maxMintLimit =
    holderOfCollectionData.value?.nftEntitiesConnection?.totalCount || 0

  // Check if the user is considered a holder of the target collection
  const isHolder = maxMintLimit > 0

  // Determine if there are available NFTs for minting
  const hasNFTsAvailable = availableNfts.amount !== 0

  // Combine the conditions to evaluate if the user is eligible for minting
  return (
    isHolder &&
    maxMintLimit > mintedAmountForCurrentUser.value &&
    hasMinimumFunds.value &&
    hasNFTsAvailable
  )
})

const mintButtonLabel = computed(() => {
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
        ? $i18n.t('drops.mintForHolder')
        : $i18n.t('mint.unlockable.notEligibility')
    case 'paid':
      return $i18n.t('drops.mintForPaid', [
        `${formatAmountWithRound(drop.value?.price || '', decimals.value)} ${
          chainSymbol.value
        }`,
      ])
    default:
      return $i18n.t('general.connect_wallet')
  }
})

const isButtonEnabled = computed(() => {
  if (
    !mintCountAvailable.value ||
    drop.value?.disabled ||
    !isLogIn.value ||
    !selectedImage.value
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

const showHolderOfCollection = computed(() => !!props.holderOfCollection?.id)

const isCheckingMintRequirements = computed(
  () =>
    showHolderOfCollection.value &&
    isLogIn.value &&
    (props.holderOfCollection?.isLoading || !hasCurrentChainBalance.value),
)

const buttonMint = computed<{
  label: string
  disabled: boolean
  withLabel?: boolean
}>(() => {
  if (!mintCountAvailable.value) {
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

  if (isLogIn.value && !drop.value?.userAccess) {
    return {
      label: mintButtonLabel.value,
      disabled: true,
    }
  }

  return {
    label: mintButtonLabel.value,
    disabled: !isButtonEnabled.value || loading.value,
  }
})

const handleMint = () => {
  if (!mintCountAvailable.value) {
    return navigateTo(
      `/${urlPrefix.value}/collection/${drop.value?.collection}?listed=true`,
    )
  }

  emit('mint')
}
</script>
