<template>
  <CollectionDropGenerativeLayout v-if="drop" @mint="handleSubmitMint" />

  <DropConfirmModal
    v-model="isConfirmModalActive"
    @subscribe="subscribe"
    @check-subscription="handleCheckSubscription"
    @resend-confirmation-email="handleResendConfirmationEmail"
    @close="isConfirmModalActive = false"
    @list="handleList" />

  <CollectionDropAddFundsModal
    v-model="isAddFundModalActive"
    free
    @close="isAddFundModalActive = false"
    @confirm="handleDropAddModalConfirm" />

  <ListingCartModal />
</template>

<script setup lang="ts">
import {
  useDrop,
  useDropMinimumFunds,
  useDropStatus,
} from '@/components/drops/useDrops'
import DropConfirmModal from './modal/DropConfirmModal.vue'
import ListingCartModal from '@/components/common/listingCart/ListingCartModal.vue'
import useGenerativeDropMint from '@/composables/drop/useGenerativeDropMint'
import useGenerativeDropNewsletter from '@/composables/drop/useGenerativeDropNewsletter'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'
import { allocateClaim, allocateCollection } from '@/services/fxart'
import { getFakeEmail } from './utils'
import { createUnlockableMetadata } from '../unlockable/utils'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'
import { useDropStore } from '@/stores/drop'

const instance = getCurrentInstance()
const listingCartStore = useListingCartStore()
const preferencesStore = usePreferencesStore()
const dropStore = useDropStore()

const { toast } = useToast()

const { isLogIn, accountId } = useAuth()
const { urlPrefix } = usePrefix()
const { drop } = useDrop()
const { doAfterLogin } = useDoAfterlogin(instance)
const { fetchMultipleBalance } = useMultipleBalance()
const { hasMinimumFunds } = useDropMinimumFunds()
const { fetchDropStatus } = useDropStatus()

const {
  checkSubscription,
  subscribe,
  resendConfirmationEmail,
  subscriptionId,
  emailConfirmed,
} = useGenerativeDropNewsletter()

const {
  mintedNftWithMetadata,
  tryCapture,
  collectionName,
  mintedNft,
  subscribeToMintedNft,
  selectedImage,
  description,
  listMintedNft,
} = useGenerativeDropMint()

const imageMetadata = ref('')
const imageHash = ref('')

const isConfirmModalActive = ref(false)
const isAddFundModalActive = ref(false)

useCursorDropEvents([computed(() => dropStore.loading)])

const clearWalletConnecting = () => {
  dropStore.setWalletConnecting(false)
}

const handleSubmitMint = () => {
  if (!isLogIn.value) {
    dropStore.setWalletConnecting(true)
    doAfterLogin({
      onLoginSuccess: clearWalletConnecting,
      onCancel: clearWalletConnecting,
    })

    return
  }

  if (dropStore.loading || dropStore.isCaptutingImage) {
    return false
  }

  if (hasMinimumFunds.value) {
    isConfirmModalActive.value = true
  } else {
    isAddFundModalActive.value = true
  }
}

const getImageInfo = async (
  image: string,
): Promise<{ metadata: string; hash: string }> => {
  dropStore.setIsCaptutingImage(true)
  const imageUrl = new URL(image)
  const hash = imageUrl.searchParams.get('hash') || ''
  const imageCid = await tryCapture()
  const metadata = await createUnlockableMetadata(
    imageCid,
    description.value ?? '',
    collectionName.value ?? defaultName.value,
    'text/html',
    selectedImage.value,
  )
  imageMetadata.value = metadata
  imageHash.value = hash
  dropStore.setIsCaptutingImage(false)
  return { metadata, hash }
}

const allocateRaffle = async (): Promise<{ raffleId: number }> => {
  const { metadata, hash } = await getImageInfo(selectedImage.value)
  const body = {
    email: getFakeEmail(),
    hash,
    address: accountId.value,
    image: selectedImage.value,
    metadata: metadata,
  }

  const response = await allocateCollection(body, drop.value.id)
  return { raffleId: parseInt(response.result.id) }
}

const submitMint = async () => {
  try {
    const { raffleId } = await allocateRaffle()
    const { result } = await allocateClaim(
      {
        sn: raffleId,
        txHash: imageHash.value,
        address: accountId.value,
      },
      drop.value?.id,
    )
    await fetchDropStatus()

    const id = `${drop.value?.collection}-${result.sn}`

    mintedNft.value = {
      ...result,
      id,
      name: result.name,
      collectionName: collectionName.value,
    }

    dropStore.setLoading(false)

    subscribeToMintedNft(id, async (): Promise<void> => {
      const mintedNft = await fetchNft(id)
      if (mintedNft) {
        mintedNftWithMetadata.value = mintedNft
      }
    })
  } catch (error) {
    toast((error as Error).message)
    dropStore.setIsCaptutingImage(false)
    throw error
  }
}

const handleCheckSubscription = () =>
  checkSubscription(subscriptionId.value as string)

const handleResendConfirmationEmail = () =>
  resendConfirmationEmail(subscriptionId.value as string)

const startMinting = async () => {
  try {
    dropStore.setLoading(true)
    await submitMint()
  } catch (error) {
    dropStore.setLoading(false)
    isConfirmModalActive.value = false
  }
}

const handleList = async () => {
  isConfirmModalActive.value = false
  listMintedNft()
}

const clear = () => {
  isConfirmModalActive.value = false
  preferencesStore.listingCartModalOpen = false
  if (mintedNftWithMetadata.value?.id) {
    listingCartStore.removeItem(mintedNftWithMetadata.value?.id)
  }
}

const handleDropAddModalConfirm = () => {
  isAddFundModalActive.value = false

  isConfirmModalActive.value = true
  fetchMultipleBalance([urlPrefix.value])
}

watch([isConfirmModalActive, emailConfirmed], ([modalActive, confirmed]) => {
  if (modalActive && confirmed) {
    startMinting()
  }
})

onBeforeUnmount(clear)
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.order-1 {
  order: 1;
}
</style>
