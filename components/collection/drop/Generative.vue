<template>
  <CollectionDropGenerativeLayout v-if="drop" @mint="handleSubmitMint" />

  <DropConfirmModal
    v-model="isConfirmModalActive"
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
import useGenerativeDropMint from '@/composables/drop/useGenerativeDropMint'
import useGenerativeDropNewsletter from '@/composables/drop/useGenerativeDropNewsletter'
import useCursorDropEvents from '@/composables/party/useCursorDropEvents'
import { useDropStore } from '@/stores/drop'

const instance = getCurrentInstance()
const preferencesStore = usePreferencesStore()
const { openListingCartModal } = useListingCartModal({
  clearItemsOnBeforeUnmount: true,
  clearItemsOnModalClose: true,
})
const dropStore = useDropStore()
const { mintedNFTs } = storeToRefs(dropStore)

const { toast } = useToast()

const { isLogIn } = useAuth()
const { urlPrefix } = usePrefix()
const { drop } = useDrop()
const { doAfterLogin } = useDoAfterlogin(instance)
const { fetchMultipleBalance } = useMultipleBalance()
const { hasMinimumFunds } = useDropMinimumFunds()
const { subscribeDropStatus } = useDropStatus(drop)

const { emailConfirmed } = useGenerativeDropNewsletter()

const { subscribeToMintedNft, listMintedNft } = useGenerativeDropMint()

const isConfirmModalActive = ref(false)
const isAddFundModalActive = ref(false)

useCursorDropEvents([computed(() => dropStore.loading)], { massmint: false })

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

const submitMint = async () => {
  try {
    const id = drop.value?.collection

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

onBeforeMount(subscribeDropStatus)
onBeforeUnmount(clear)
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.order-1 {
  order: 1;
}
</style>
