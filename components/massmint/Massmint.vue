<template>
  <div>
    <div>
      <section class="flex justify-center items-end relative">
        <NeoButton
          class="absolute left-10 max-lg:static max-lg:mb-8"
          @click="toOnborading"
        >
          <NeoIcon
            icon="arrow-left"
            class="mr-1"
          />
          {{ $t('massmint.backToOnbaording') }}
        </NeoButton>
        <div class="max-lg:self-center">
          <div>
            <p class="mb-4">
              {{ $t('massmint.chooseCollection') }}
            </p>
            <ChooseCollectionDropdown
              :preselected="preselectedCollectionId"
              @selected-collection="onCollectionSelected"
            />
          </div>
        </div>
      </section>

      <section class="border k-shadow mt-7">
        <UploadMediaZip
          :disabled="!selectedCollection"
          @zip-loaded="onMediaZipLoaded"
        />
        <UploadDescription
          :disabled="!mediaLoaded"
          @file-loaded="onDescriptionLoaded"
        />
        <OverviewTable
          :disabled="!mediaLoaded"
          :nfts="NFTS"
          :collection-id="selectedCollection?.id"
          @open-side-bar-with="openSideBarWith"
          @delete="openDeleteModalWith"
        />
      </section>
    </div>
    <EditPanel
      :nft="nftBeingEdited"
      :open="sideBarOpen"
      @close="sideBarOpen = false"
      @save="updateNFT"
    />
    <div class="mt-6 flex justify-center w-full">
      <NeoButton
        class="flex grow max-w-[45rem]"
        variant="primary"
        size="large"
        :disabled="!mediaLoaded || !hasEnoughBalance"
        @click="openReviewModal"
      >
        <span class="text-xl">{{ hasEnoughBalance ? $t('massmint.mintNFTs') : $t('confirmPurchase.notEnoughFunds') }}
          <span
            v-if="numOfValidNFTs && !hasEnoughBalance"
            class="font-bold"
          >
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
      @delete="deleteNFT"
    />
    <MissingInfoModal
      v-model="missingInfoModalOpen"
      :missing-names="missingNames"
      :num-missing-descriptions="numberOfMissingDescriptions"
      :num-missing-prices="numberOfMissingPrices"
      @close="missingInfoModalOpen = false"
    />
    <ReviewModal
      v-model="overViewModalOpen"
      :num-missing-descriptions="numberOfMissingDescriptions"
      :num-missing-prices="numberOfMissingPrices"
      :num-nfts="Object.keys(NFTS).length"
      @close="overViewModalOpen = false"
      @mint="startMint"
    />
    <MintingModal
      v-model="mintModalOpen"
      :loading="isMinting"
      @close="mintModalOpen = false"
    />
    <MobileDisclaimerModal
      v-model="MobileDisclaimerModalOpen"
      @continue="MobileDisclaimerModalOpen = false"
      @leave="back"
    />
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import UploadMediaZip from './uploadCompressedMedia/UploadCompressedMedia.vue'
import UploadDescription from './uploadDescription/UploadDescription.vue'
import OverviewTable from './OverviewTable.vue'
import EditPanel from './EditPanel.vue'
import type { NFT, NFTToMint } from './types'

import {
  DeleteModal,
  MintingModal,
  MissingInfoModal,
  MobileDisclaimerModal,
  ReviewModal,
} from './modals'
import ChooseCollectionDropdown from '@/components/common/ChooseCollectionDropdown.vue'
import { usePreferencesStore } from '@/stores/preferences'
import type { MintedCollection } from '@/composables/transaction/types'
import { useMassMint } from '@/composables/massmint/useMassMint'
import type { Entry } from '@/composables/massmint/parsers/common'
import type { FileObject } from '@/composables/massmint/useZipValidator'

const { width } = useWindowSize()
const { back } = useRouter()

const preferencesStore = usePreferencesStore()
const { $consola, $i18n } = useNuxtApp()
const router = useRouter()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const { selectedCollection, preselectedCollectionId, onCollectionSelected } = useCollectionDropdown()
const { itemDeposit, metadataDeposit } = useDeposit(urlPrefix)
const { decimals } = useChain()
const { transferableCurrentChainBalance } = useMultipleBalance(true)

const NFTS = ref<{ [nftId: string]: NFT }>({})
const mediaLoaded = ref(false)

const nftBeingEdited = ref<NFT>()
const nftInDeleteModal = ref<NFT>()
const sideBarOpen = ref(false)
const deleteModalOpen = ref(false)
const missingInfoModalOpen = ref(false)
const overViewModalOpen = ref(false)
const mintModalOpen = ref(false)
const MobileDisclaimerModalOpen = ref(false)
const smallerThenDesktop = computed(() => width.value < 1024)

const transactionFee = ref(0)
const isMinting = ref(false)
const mintStatus = ref('')

const neededAmount = computed(() => ((itemDeposit.value + metadataDeposit.value) * Object.keys(NFTS.value).length) + transactionFee.value)
const hasEnoughBalance = computed(() => (transferableCurrentChainBalance.value ?? 0) >= neededAmount.value)

const missingNames = computed(() => Object.values(NFTS.value).filter(nft => !nft.name))

const numOfValidNFTs = computed(
  () => Object.values(NFTS.value).length - missingNames.value.length,
)
const numberOfMissingDescriptions = computed(
  () => Object.values(NFTS.value).filter(nft => !nft.description).length,
)

const numberOfMissingPrices = computed(
  () => Object.values(NFTS.value).filter(nft => !nft.price).length,
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
  if (missingNames.value && missingNames.value.length) {
    missingInfoModalOpen.value = true
    return
  }
  overViewModalOpen.value = true
}

const startMint = () => {
  overViewModalOpen.value = false
  mintModalOpen.value = true
  isMinting.value = true

  const { isLoading, status, collectionUpdated, isError } = useMassMint(
    Object.values(NFTS.value) as NFTToMint[],
    selectedCollection.value as MintedCollection,
  )

  watch(
    [isLoading, status, collectionUpdated, isError],
    ([isLoadingV, statusV], [isLoadingOldV]) => {
      isMinting.value = isLoadingV
      mintStatus.value = statusV

      if (isLoadingOldV && !isLoadingV) {
        mintModalOpen.value = false
        if (!isError.value && statusV === TransactionStatus.Block) {
          successMessage($i18n.t('massmint.continueToCollectionPage'))
        }
      }

      // redirect to collection page when collection is updated
      if (collectionUpdated.value) {
        navigateTo(
          `/${urlPrefix.value}/collection/${selectedCollection.value?.id}`,
        )
      }
    },
  )
}

const updateNFT = (nft: NFT) => {
  NFTS.value[nft.id] = nft
}

const deleteNFT = (nft?: NFT) => {
  if (!nft) {
    return
  }
  NFTS.value = Object.values(NFTS.value)
    .filter(n => n.id !== nft.id)
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

const convertNftsToMap = (nfts: FileObject[]) => nfts.map((file, i) => ({ ...file, id: i + 1 }))
  .reduce((acc, nft) => ({ ...acc, [nft.id]: nft }), {})

const onMediaZipLoaded = ({ validFiles }: { validFiles: FileObject[] }) => {
  NFTS.value = convertNftsToMap(validFiles)
  mediaLoaded.value = true
}
const onDescriptionLoaded = (entries: Record<string, Entry>) => {
  // create a map of nft filename to id
  const nftFileNameToId = Object.values(NFTS.value).reduce(
    (acc, nft) => ({ ...acc, [nft.file.name]: nft.id }),
    {},
  )

  Object.values(entries).forEach((entry, idx) => {
    if (!entry.valid) {
      return
    }
    const nftId = nftFileNameToId[entry.file]
    if (!nftId) {
      return
    }

    const { file: _, ...restOfEntry } = entry
    NFTS.value[nftId] = {
      ...NFTS.value[nftId],
      ...restOfEntry,
      sortedIndex: idx,
    }
  })

  // sort the NFTS by sortedIndex
  const sortedNfts = Object.values(NFTS.value).sort((a, b) => (a.sortedIndex || 0) - (b.sortedIndex || 0))

  NFTS.value = convertNftsToMap(sortedNfts)
}

onMounted(() => {
  MobileDisclaimerModalOpen.value = smallerThenDesktop.value
})

watch(urlPrefix, async () => {
  transactionFee.value = Number(await estimateTransactionFee(accountId.value, decimals.value))
}, { immediate: true })
</script>

<style lang="scss">
.tab-nft {
  .explore-tabs-button {
    border-left: 0 !important;
    border-right: 0 !important;
  }
}
</style>
