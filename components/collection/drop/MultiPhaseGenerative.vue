<template>
  <CollectionDropGenerativeLayout
    :collection-id="collectionId"
    :description="description"
    :drop="drop"
    :holder-of-collection="holderOfCollection"
    :user-minted-nft-id="userMintedNftId"
    :is-wallet-connecting="isWalletConnecting"
    :is-image-fetching="isImageFetching"
    :is-loading="isLoading"
    :minimum-funds="minimumFundsProps"
    :mint-count-available="mintCountAvailable"
    :mint-button="mintButtonProps"
    :handle-select-image="handleSelectImage"
    :handle-submit-mint="handleSubmitMint"
    :mint-phases="mintPhases" />

  <CollectionDropHolderOfGenerativeSection
    ref="holderOfDrop"
    :selected-image="selectedImage"
    :collection-data="collectionData"
    :drop="drop"
    :minimum-funds="minimumFunds"
    :has-minimum-funds="hasMinimumFunds"
    :formatted-minimum-funds="formattedMinimumFunds"
    :formatted-existential-deposit="formattedExistentialDeposit"
    :current-account-minted-token="currentAccountMintedToken"
    :image-data-payload="imageDataPayload"
    :description="description"
    :collection-name="collectionName"
    :minted-amount-for-current-user="mintedAmountForCurrentUser"
    :mint-count-available="mintCountAvailable"
    :fetch-multiple-balance="fetchMultipleBalance"
    :fetch-drop-status="fetchDropStatus" />

  <CollectionDropPaidGenerativeSection
    ref="paidDrop"
    :collection-data="collectionData"
    :selected-image="selectedImage"
    :drop="drop"
    :current-account-minted-token="currentAccountMintedToken"
    :max-count="maxCount"
    :nft-count="nftCount"
    :collection-name="collectionName"
    :description="description"
    :image-data-payload="imageDataPayload"
    :mint-count-available="mintCountAvailable"
    :minted-amount-for-current-user="mintedAmountForCurrentUser"
    :minimum-funds="minimumFunds"
    :has-minimum-funds="hasMinimumFunds"
    :formatted-minimum-funds="formattedMinimumFunds"
    :formatted-existential-deposit="formattedExistentialDeposit"
    :fetch-drop-status="fetchDropStatus" />
</template>

<script setup lang="ts">
import { DropItem } from '@/params/types'
import { useDropMinimumFunds, useDropStatus } from '@/components/drops/useDrops'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'
import useGenerativeDropMint, {
  type UnlockableCollectionById,
} from '@/composables/drop/useGenerativeDropMint'
import useGenerativeDropDetails from '@/composables/drop/useGenerativeDropDetails'
import useDropPhases from '@/composables/drop/useDropPhases'
import { MintButtonProp, PhaseType } from './types'

const props = withDefaults(
  defineProps<{
    drop: DropItem
  }>(),
  {
    drop: () => ({}) as DropItem,
  },
)

const { $i18n } = useNuxtApp()
const { accountId } = useAuth()
const { client } = usePrefix()

const { fetchMultipleBalance } = useMultipleBalance()

const {
  hasMinimumFunds,
  formattedMinimumFunds,
  minimumFunds,
  formattedExistentialDeposit,
} = useDropMinimumFunds(props.drop)

const minimumFundsDescription = computed(() =>
  $i18n.t('mint.unlockable.holderOfCollectionMinimumFundsDescription', [
    formattedMinimumFunds.value,
    chainName.value,
  ]),
)

const minimumFundsProps = computed(() => ({
  amount: minimumFunds.value,
  description: minimumFundsDescription.value,
  hasAmount: hasMinimumFunds.value,
}))

const { collectionId, defaultMax, chainName } = useGenerativeDropDetails(
  props.drop,
)

const { currentAccountMintedToken, mintedDropCount, fetchDropStatus } =
  useDropStatus(props.drop.alias)

const paidDrop = ref()
const holderOfDrop = ref()

const activeMintPhase = computed<Ref | null>(
  () => phaseRefs[activePhase.value?.type] || null,
)

const mintButtonLabel = computed(() => {
  if (isWalletConnecting.value) {
    return $i18n.t('shoppingCart.wallet')
  }

  return activeMintPhase.value?.value?.mintButtonProps?.label
})

const mintButtonDisabled = computed(
  () => activeMintPhase.value?.value?.mintButtonProps?.disabled,
)

const mintButtonProps = computed<MintButtonProp>(() => ({
  disabled: mintButtonDisabled.value,
  label: mintButtonLabel.value,
}))

const isWalletConnecting = computed(
  () => activeMintPhase.value?.value?.isWalletConnecting,
)
const isImageFetching = computed(
  () => activeMintPhase.value?.value?.isImageFetching,
)
const userMintedNftId = computed(
  () => activeMintPhase.value?.value?.userMintedNftId,
)
const isLoading = computed(() => activeMintPhase.value?.value?.isLoading)

const phaseRefs: Partial<Record<PhaseType, Ref>> = {
  holder_of: holderOfDrop,
  paid: paidDrop,
}

const holderOfCollection = computed(
  () => holderOfDrop.value?.holderOfCollection,
)

const { data: collectionData } = await useAsyncData(
  'unlockableCollectionData',
  async () =>
    await useAsyncQuery<UnlockableCollectionById>({
      clientId: client.value,
      query: unlockableCollectionById,
      variables: {
        id: collectionId.value,
        search: { currentOwner_eq: accountId.value },
      },
    }).then((res) => res.data.value),
  {
    watch: [accountId],
  },
)

const {
  maxCount,
  mintedCount,
  mintCountAvailable,
  mintedAmountForCurrentUser,
  collectionName,
  description,
  imageDataPayload,
  selectedImage,
  nftCount,
} = useGenerativeDropMint({
  collectionData,
  defaultMax,
  mintedDropCount,
})

const dropType = computed(() => {
  if (props.drop.holds) {
    return PhaseType.HOLDER_OF
  }

  if (Number(props.drop.price)) {
    return PhaseType.PAID
  }
})

const { mintPhases, activePhase } = useDropPhases({
  phases: DROP_PHASES[props.drop.alias] || dropType.value || [],
  maxCount,
  mintedCount,
})

const handleSelectImage = (image: string) => {
  selectedImage.value = image
}

const handleSubmitMint = async (type: PhaseType) => {
  phaseRefs[type]?.value.onSubmit()
}
</script>
