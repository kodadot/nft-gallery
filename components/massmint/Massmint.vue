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
          @openSideBarWith="openSideBarWith" />
      </section>
    </div>
    <EditPanel
      :nft="nftBeingEdited"
      :open="sideBarOpen"
      @close="closeSideBar"
      @save="updateNFT" />
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

const preferencesStore = usePreferencesStore()
const { $consola } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const { urlPrefix } = usePrefix()

const nftBeingEdited = ref<NFT>()
const sideBarOpen = ref(false)

const openSideBarWith = (nft: NFT) => {
  nftBeingEdited.value = nft
  sideBarOpen.value = true
}

const closeSideBar = () => {
  sideBarOpen.value = false
}
const updateNFT = (nft: NFT) => {
  NFTS.value[nft.id] = nft
}
const tabs = ['Collection', 'NFT', 'Mass Mint']

const selectedCollection = ref<MintedCollection>()
const NFTS = ref<{ [nftId: string]: NFT }>({})
const mediaLoaded = ref(false)

const onCollectionSelected = (collection) => {
  selectedCollection.value = collection
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
</style>
