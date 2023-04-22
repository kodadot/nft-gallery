<template>
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
        <ChooseCollectionDropdown @selectedCollection="onCollectionSelected" />
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
        :label="mintButtonLabel"
        variant="k-accent"
        :disabled="!mediaLoaded"
        @click.native="openReviewModal" />
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
      @close="missingInfoModalOpen = false" />
    <ReviewModal
      v-model="overViewModalOpen"
      :num-missing-descriptions="numberOfMissingDescriptions"
      :num-nfts="Object.keys(NFTS).length"
      @close="overViewModalOpen = false"
      @mint="startMint" />
    <MintingModal
      v-model="mintModalOpen"
      :loading="isMinting"
      @close="mintModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'
import { MintedCollection } from './useMassMint'
import UploadMediaZip from './uploadCompressedMedia/UploadCompressedMedia.vue'
import UploadDescription from './uploadDescription/UploadDescription.vue'
import OverviewTable from './OverviewTable.vue'
import ChooseCollectionDropdown from './ChooseCollectionDropdown.vue'
import EditPanel from './EditPanel.vue'
import { NFT } from './types'
import MissingInfoModal from './modals/MissingInfoModal.vue'
import ReviewModal from './modals/ReviewModal.vue'
import DeleteModal from './modals/DeleteModal.vue'
import MintingModal from './modals/MintingModal.vue'

const preferencesStore = usePreferencesStore()
const { $consola, $i18n } = useNuxtApp()
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
const numberOfMissingNames = computed(
  () => Object.values(NFTS.value).filter((nft) => !nft.name).length
)
const numberOfMissingDescriptions = computed(
  () => Object.values(NFTS.value).filter((nft) => !nft.description).length
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

  // fake mint
  setTimeout(() => {
    isMinting.value = false
  }, 5000)
}

const tabs = ['Collection', 'NFT', 'Mass Mint']

const onCollectionSelected = (collection) => {
  selectedCollection.value = collection
}

const mintButtonLabel = computed(() => {
  if (!mediaLoaded.value) {
    return $i18n.t('massmint.mintNFTs')
  }
  return $i18n.t('massmint.mintNumOfNFTs', {
    count: Object.keys(NFTS.value).length,
  })
})

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

const onMediaZipLoaded = ({
  validFiles,
}: {
  validFiles: { name: string; imageUrl: string }[]
}) => {
  NFTS.value = validFiles
    .map(({ imageUrl }, i) => ({ imageUrl, id: i + 1 }))
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
