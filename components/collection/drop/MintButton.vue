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
import type { HolderOfCollectionProp } from '@/components/collection/drop/types'
import useGenerativeDropMint, {
  useCollectionEntity,
} from '@/composables/drop/useGenerativeDropMint'
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
const { mintCountAvailable, maxCount } = useGenerativeDropMint()
const { mintedAmountForCurrentUser } = useCollectionEntity()
const { amountToMint, previewItem } = storeToRefs(dropStore)

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
  const maxMintLimit =
    holderOfCollectionData.value?.nftEntitiesConnection?.totalCount || 0

  const isHolder = maxMintLimit > 0

  const hasNFTsAvailable = inject('hasNFTsAvailable', true) // true if not provided

  return (
    isHolder &&
    maxMintLimit > mintedAmountForCurrentUser.value &&
    hasMinimumFunds.value &&
    hasNFTsAvailable
  )
})

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
        ? $i18n.t('drops.mintForHolder')
        : $i18n.t('mint.unlockable.notEligibility')
    case 'paid':
      return $i18n.t('drops.mintForPaid', [
        `${formatAmountWithRound(Number(drop.value?.price) * amountToMint.value, decimals.value)} ${
          chainSymbol.value
        }`,
      ])
    default:
      return $i18n.t('general.connect_wallet')
  }
})

const enabled = computed(() => {
  if (!mintCountAvailable.value) {
    return true
  }
  if (
    Boolean(drop.value?.disabled) ||
    !previewItem.value ||
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

const showHolderOfCollection = computed(() => !!props.holderOfCollection?.id)

const isCheckingMintRequirements = computed(
  () =>
    showHolderOfCollection.value &&
    isLogIn.value &&
    (props.holderOfCollection?.isLoading || !hasCurrentChainBalance.value),
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
