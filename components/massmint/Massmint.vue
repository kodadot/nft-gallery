<template>
  <div>
    <Loader v-model="isMinting" :status="mintStatus" :can-cancel="false" />
    <div class="pt-4">
      <div>
        <section class="is-flex pb-8 is-flex-wrap-wrap row-gap">
          <NeoButton class="mr-8" @click.native="toOnborading">
            <NeoIcon icon="arrow-left" size="small" class="mr-1" />
            {{ $t('massmint.backToOnbaording') }}
          </NeoButton>
          <div class="is-flex">
            <TabItem
              v-for="tab in tabs"
              :key="tab"
              :active="tab === 'Mass Mint'"
              :text="tab"
              :to="route.path"
              class="mobile-width" />
          </div>
        </section>
        <hr class="m-0" />
        <section
          class="pt-8 is-flex is-flex-direction-column is-align-items-center">
          <p class="mb-4">{{ $t('massmint.chooseCollection') }}</p>
          <ChooseCollectionDropdown
            @selectedCollection="onCollectionSelected" />
        </section>
        <section class="border k-shadow mt-7">
          <UploadMediaZip
            :disabled="!selectedCollection"
            @zipLoaded="onMediaZipLoaded" />
          <UploadDescription :disabled="!mediaLoaded" />
          <OverviewTable
            :disabled="!mediaLoaded"
            :nfts="NFTS"
            @openSideBarWith="openSideBarWith"
            @delete="openDeleteModalWith" />
        </section>
      </div>
      <EditPanel
        :nft="nftBeingEdited"
        :open="sideBarOpen"
        @close="sideBarOpen = false"
        @save="updateNFT" />
      <div class="mt-6 is-flex is-justify-content-center w-full">
        <NeoButton
          class="is-flex is-flex-grow-1 limit-width"
          variant="k-accent"
          size="large"
          :disabled="!mediaLoaded"
          @click.native="openReviewModal">
          <span class="is-size-5"
            >{{ $t('massmint.mintNFTs') }}
            <span v-if="numOfValidNFTs" class="has-text-weight-bold">
              ({{ numOfValidNFTs }})
            </span>
          </span>
        </NeoButton>
      </div>
      <DeleteModal
        v-if="nftInDeleteModal"
        v-model="deleteModalOpen"
        :nft="nftInDeleteModal"
        @close="closeDeleteModal"
        @delete="deleteNFT" />
      <MissingInfoModal
        v-model="missingInfoModalOpen"
        :num-missing-names="numberOfMissingNames"
        :num-missing-descriptions="numberOfMissingDescriptions"
        :num-missing-prices="numberOfMissingPrices"
        @close="missingInfoModalOpen = false" />
      <ReviewModal
        v-model="overViewModalOpen"
        :num-missing-descriptions="numberOfMissingDescriptions"
        :num-missing-prices="numberOfMissingPrices"
        :num-nfts="Object.keys(NFTS).length"
        @close="overViewModalOpen = false"
        @mint="startMint" />
      <MintingModal
        v-model="mintModalOpen"
        :loading="isMinting"
        @close="mintModalOpen = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'
import UploadMediaZip from './uploadCompressedMedia/UploadCompressedMedia.vue'
import UploadDescription from './uploadDescription/UploadDescription.vue'
import OverviewTable from './OverviewTable.vue'
import ChooseCollectionDropdown from './ChooseCollectionDropdown.vue'
import EditPanel from './EditPanel.vue'
import { NFT, NFTToMint } from './types'
import MissingInfoModal from './modals/MissingInfoModal.vue'
import ReviewModal from './modals/ReviewModal.vue'
import DeleteModal from './modals/DeleteModal.vue'
import MintingModal from './modals/MintingModal.vue'
import { FileObject } from './uploadCompressedMedia/useZipValidator'
import { mint } from './useMassMint'
import { MintedCollection } from '@/composables/transaction/types'
import { notificationTypes, showNotification } from '@/utils/notification'

const preferencesStore = usePreferencesStore()
const { $consola } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const { urlPrefix } = usePrefix()

const selectedCollection = ref<MintedCollection>()
const NFTS = ref<{ [nftId: string]: NFT }>({})
const mediaLoaded = ref(false)

const nftBeingEdited = ref<NFT>()
const nftInDeleteModal = ref<NFT>()
const sideBarOpen = ref(false)
const deleteModalOpen = ref(false)
const missingInfoModalOpen = ref(false)
const overViewModalOpen = ref(false)
const mintModalOpen = ref(false)

const isMinting = ref(false)
const mintStatus = ref('')

const numberOfMissingNames = computed(
  () => Object.values(NFTS.value).filter((nft) => !nft.name).length
)

const numOfValidNFTs = computed(
  () => Object.values(NFTS.value).length - numberOfMissingNames.value
)
const numberOfMissingDescriptions = computed(
  () => Object.values(NFTS.value).filter((nft) => !nft.description).length
)

const numberOfMissingPrices = computed(
  () => Object.values(NFTS.value).filter((nft) => !nft.price).length
)

const openSideBarWith = (nft: NFT) => {
  nftBeingEdited.value = nft
  sideBarOpen.value = true
}
const openDeleteModalWith = (nft: NFT) => {
  nftInDeleteModal.value = nft
  deleteModalOpen.value = true
}
const closeDeleteModal = () => {
  deleteModalOpen.value = false
  nftInDeleteModal.value = undefined
}

const openReviewModal = () => {
  if (numberOfMissingNames.value > 0) {
    missingInfoModalOpen.value = true
    return
  }
  overViewModalOpen.value = true
}

const startMint = () => {
  overViewModalOpen.value = false
  mintModalOpen.value = true
  isMinting.value = true

  const { isLoading, status, collectionUpdated } = mint(
    Object.values(NFTS.value) as NFTToMint[],
    selectedCollection.value as MintedCollection
  )

  watch(
    [isLoading, status, collectionUpdated],
    ([isLoadingV, statusV], [isLoadingOldV]) => {
      isMinting.value = isLoadingV
      mintStatus.value = statusV

      if (isLoadingOldV && !isLoadingV && statusV === 'loader.finalized') {
        mintModalOpen.value = false
        showNotification(
          'You will go to collection page in a moment....',
          notificationTypes.success
        )
      }

      //redirect to collection page when collection is updated
      if (collectionUpdated.value) {
        router.push({
          path: `/${urlPrefix.value}/collection/${selectedCollection.value?.id}`,
        })
      }
    }
  )
}

const tabs = ['Collection', 'NFT', 'Mass Mint']

const onCollectionSelected = (collection) => {
  selectedCollection.value = collection
}

const updateNFT = (nft: NFT) => {
  NFTS.value[nft.id] = nft
}

const deleteNFT = (nft?: NFT) => {
  if (!nft) {
    return
  }
  NFTS.value = Object.values(NFTS.value)
    .filter((n) => n.id !== nft.id)
    .map((nft, i) => ({ ...nft, id: i + 1 }))
    .reduce((acc, nft) => ({ ...acc, [nft.id]: nft }), {})

  closeDeleteModal()
}

const toOnborading = () => {
  preferencesStore.setVisitedOnboarding(false)
  router
    .replace({
      path: `/${urlPrefix.value}/massmint/onboarding`,
    })
    .catch($consola.warn)
}

const onMediaZipLoaded = ({ validFiles }: { validFiles: FileObject[] }) => {
  NFTS.value = validFiles
    .map((file, i) => ({ ...file, id: i + 1 }))
    .reduce((acc, nft) => ({ ...acc, [nft.id]: nft }), {})
  mediaLoaded.value = true
}
</script>
<style lang="scss" scoped>
.row-gap {
  row-gap: 2rem;
}

.limit-width {
  max-width: 45rem;
}
</style>
