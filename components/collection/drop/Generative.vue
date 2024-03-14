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
</template>

<script setup lang="ts">
import {
  useDrop,
  useDropMinimumFunds,
  useDropStatus,
} from '@/components/drops/useDrops'
import DropConfirmModal from './modal/DropConfirmModal.vue'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'
import useGenerativeDropMint, {
  useCollectionEntity,
} from '@/composables/drop/useGenerativeDropMint'
import useGenerativeDropNewsletter from '@/composables/drop/useGenerativeDropNewsletter'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'
import { allocateClaim, allocateCollection } from '@/services/fxart'
import { getFakeEmail } from './utils'
import { createUnlockableMetadata } from '../unlockable/utils'
import { useDropStore } from '@/stores/drop'
import useGenerativeIframeData, {
  ImageDataPayload,
} from '@/composables/drop/useGenerativeIframeData'

const instance = getCurrentInstance()
const preferencesStore = usePreferencesStore()
const { openListingCartModal } = useListingCartModal({
  clearItemsOnBeforeUnmount: true,
  clearItemsOnModalClose: true,
})
const dropStore = useDropStore()
const { previewItem, mintedNFTs } = storeToRefs(dropStore)

const { toast } = useToast()

const { $i18n } = useNuxtApp()
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

const { claimedNft, subscribeToMintedNft, listMintedNft } =
  useGenerativeDropMint()

const { collectionName, description } = useCollectionEntity()
const { imageDataPayload } = useGenerativeIframeData()

const imageMetadata = ref('')
const imageHash = computed(() => previewItem.value?.hash ?? '')
const selectedImage = computed(() => previewItem.value?.image ?? '')

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

  if (dropStore.loading || dropStore.isCapturingImage) {
    return false
  }

  if (hasMinimumFunds.value) {
    isConfirmModalActive.value = true
  } else {
    isAddFundModalActive.value = true
  }
}

const generateMetadata = async ({
  data,
  image,
}: {
  image: string
  data: ImageDataPayload
}): Promise<string> => {
  try {
    dropStore.setIsCapturingImage(true)
    const imageCid = await tryCapture({
      data,
      image,
    })
    const metadata = await createUnlockableMetadata(
      imageCid,
      description.value ?? '',
      collectionName.value ?? drop.value?.name ?? '',
      'text/html',
      selectedImage.value,
    )
    imageMetadata.value = metadata
    dropStore.setIsCapturingImage(false)
    return metadata
  } catch (error) {
    toast($i18n.t('drops.capture'))
    throw error
  }
}

const allocateRaffle = async (): Promise<{ raffleId: number }> => {
  const metadata = await generateMetadata({
    image: selectedImage.value,
    data: imageDataPayload.value as ImageDataPayload,
  })

  const body = {
    email: getFakeEmail(),
    hash: imageHash.value,
    address: accountId.value,
    image: selectedImage.value,
    metadata: metadata,
  }

  const response = await allocateCollection(body, drop.value.id)

  return { raffleId: response.result.id }
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

    claimedNft.value = {
      ...result,
      id,
      name: result.name,
      max: defaultMax.value,
      collectionName: collectionName.value,
    }

    dropStore.setLoading(false)

    subscribeToMintedNft(id, async (): Promise<void> => {
      const mintedNft = await fetchNft(id)
      if (mintedNft) {
        mintedNFTs.value = [mintedNft]
      }
    })
  } catch (error) {
    toast((error as Error).message)
    dropStore.setIsCapturingImage(false)
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
  openListingCartModal()
}

const clear = () => {
  isConfirmModalActive.value = false
  preferencesStore.listingCartModalOpen = false
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
