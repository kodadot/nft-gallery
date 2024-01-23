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

const { defaultName, defaultImage, collectionId, chainName, token, price } =
  useGenerativeDropDetails(props.drop)

const isMintModalActive = ref(false)
const selectedImage = useVModel(props, 'selectedImage')

const action = computed<AutoTeleportAction>(() => ({
  interaction: ActionlessInteraction.PAID_DROP,
  handler: () => mintNft(),
  details: {
    isLoading: isTransactionLoading.value,
    status: status.value,
    isError: isError.value,
  },
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

const onSubmit = () => openMintModal()

const {
  status,
  isLoading,
  isTransactionLoading,
  isError,
  mintedNft,
  canListMintedNft,
  toMintNft,
  mintNft,
  listMintedNft,
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

defineExpose({ onSubmit })
</script>
