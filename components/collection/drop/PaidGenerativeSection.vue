<template>
  <CollectionDropModalPaidMint
    v-model="isMintModalActive"
    :action="action"
    :to-mint-nft="toMintNft"
    :minted-nft="mintedNft"
    :minimum-funds="minimumFunds"
    :has-minimum-funds="hasMinimumFunds"
    :can-list-nft="canListMintedNft"
    :formatted-minimum-funds="formattedMinimumFunds"
    :formatted-existential-deposit="formattedExistentialDeposit"
    :token="token"
    :chain="chainName"
    @confirm="handleConfirmPaidMint"
    @close="closeMintModal"
    @list="handleList" />

  <ListingCartModal />
</template>

<script setup lang="ts">
import { DropItem } from '@/params/types'
import { type UnlockableCollectionById } from '@/composables/drop/useGenerativeDropMint'
import useGenerativeDropDetails from '@/composables/drop/useGenerativeDropDetails'
import usePaidDropMint from '@/composables/drop/usePaidDropMint'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { ActionlessInteraction } from '@/components/common/autoTeleport/utils'
import { type ImageDataPayload } from '@/composables/drop/useGenerativeDropMint'
import { DropMintedStatus } from '@/services/waifu'
import { formatAmountWithRound } from '@/utils/format/balance'

const props = withDefaults(
  defineProps<{
    drop: DropItem
    hasMinimumFunds: boolean
    formattedMinimumFunds: string
    minimumFunds: number
    formattedExistentialDeposit: string
    collectionData: UnlockableCollectionById | null
    currentAccountMintedToken: DropMintedStatus | null
    imageDataPayload: ImageDataPayload | undefined
    mintCountAvailable: boolean
    description: string | undefined
    collectionName: string | undefined
    selectedImage: string
    mintedAmountForCurrentUser: number
    maxCount: number
    nftCount: number | undefined
    fetchDropStatus: () => Promise<void>
  }>(),
  {
    drop: () => ({}) as DropItem,
  },
)

const { chainSymbol, decimals } = useChain()
const { $i18n } = useNuxtApp()
const { isLogIn } = useAuth()

const {
  defaultName,
  defaultImage,
  collectionId,
  chainName,
  token,
  price,
  disabledByBackend,
} = useGenerativeDropDetails(props.drop)

const isMintModalActive = ref(false)
const selectedImage = computed(() => props.selectedImage)
const mintedAmountForCurrentUser = computed(
  () => props.mintedAmountForCurrentUser,
)
const hasMinimumFunds = computed(() => props.hasMinimumFunds)
const mintCountAvailable = computed(() => props.mintCountAvailable)

const action = computed<AutoTeleportAction>(() => ({
  interaction: ActionlessInteraction.PAID_DROP,
  handler: () => mintNft(),
  details: {
    isLoading: isTransactionLoading.value,
    status: status.value,
    isError: isError.value,
  },
}))

const mintButtonLabel = computed(() => {
  return $i18n.t('mint.unlockable.claimPaidNft', [
    `${formatAmountWithRound(price.value || '', decimals.value)} ${
      chainSymbol.value
    }`,
  ])
})

const mintButtonDisabled = computed<boolean>(
  () =>
    !mintCountAvailable.value ||
    Boolean(disabledByBackend.value) ||
    (isLogIn.value &&
      Boolean(
        !selectedImage.value ||
          disabledByBackend.value ||
          maxMintLimitForCurrentUser.value <= mintedAmountForCurrentUser.value,
      )),
)

const mintButtonProps = computed(() => ({
  disabled: mintButtonDisabled.value,
  label: mintButtonLabel.value,
}))

const openMintModal = () => {
  isMintModalActive.value = true
}

const closeMintModal = () => {
  isMintModalActive.value = false
}

const handleList = () => {
  closeMintModal()
  listMintedNft()
}

const handleConfirmPaidMint = () => {
  mintNft()
}

const stopMint = () => {
  isMintModalActive.value = false
  isLoading.value = false
}

const onSubmit = () => {
  if (!preSubmitMint()) {
    return false
  }

  openMintModal()
}

const {
  status,
  isLoading,
  isTransactionLoading,
  isError,
  mintedNft,
  isImageFetching,
  isWalletConnecting,
  canListMintedNft,
  maxMintLimitForCurrentUser,
  toMintNft,
  userMintedNftId,
  mintNft,
  listMintedNft,
  preSubmitMint,
} = usePaidDropMint({
  dropAlias: props.drop.id,
  defaultImage,
  defaultName,
  collectionId,
  selectedImage,
  price,
  currentAccountMintedToken: computed(() => props.currentAccountMintedToken),
  description: computed(() => props.description),
  collectionName: computed(() => props.collectionName),
  imageDataPayload: computed(() => props.imageDataPayload),
  maxCount: computed(() => props.maxCount),
  nftCount: computed(() => props.nftCount),
  fetchDropStatus: props.fetchDropStatus,
  onStopMint: stopMint,
  onMintError: closeMintModal,
})

defineExpose({
  mintButtonProps,
  isLoading,
  isImageFetching,
  isWalletConnecting,
  userMintedNftId,
  onSubmit,
})
</script>
