<template>
  <div>
    <SigningModal
      :title="signingModalTitle"
      :is-loading="isLoading"
      :status="status"
      @try-again="tryAgain"
    />

    <UserCartModals v-if="canDoActions" />

    <NeoDropdown
      position="bottom-left"
      :mobile-modal="false"
    >
      <template #trigger="{ active }">
        <NeoButton
          class="w-10 h-10"
          icon="ellipsis-vertical"
          :active="active"
        />
      </template>

      <NeoDropdownItem
        v-if="isDownloadEnabled"
        data-testid="gallery-item-more-dropdown-download"
        @click="downloadMedia"
      >
        Download
      </NeoDropdownItem>

      <template
        v-if="isOwner && !hasOperationsDisabled(urlPrefix)"
      >
        <NeoDropdownItem
          v-if="canDoActions"
          @click="transfer"
        >
          Transfer NFT
        </NeoDropdownItem>
        <NeoDropdownItem @click="burn">
          Burn
        </NeoDropdownItem>
        <NeoDropdownItem
          v-if="nft?.price !== '0'"
          @click="unlist"
        >
          Delist
        </NeoDropdownItem>
      </template>
      <GalleryItemEditNftButton
        v-if="isCollectionOwner"
        :nft="nft"
      />
      <NeoDropdownItem disabled>
        Report
      </NeoDropdownItem>

      <NeoDropdownItem @click="refreshMetadata">
        Refresh Metadata
      </NeoDropdownItem>
    </NeoDropdown>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { Interaction } from '@kodadot1/minimark/v1'
import { useQuery } from '@tanstack/vue-query'
import GalleryItemEditNftButton from './GalleryItemEditNftButton.vue'
import { downloadImage } from '@/utils/download'
import { sanitizeIpfsUrl, toOriginalContentUrl } from '@/utils/ipfs'
import { isMobileDevice } from '@/utils/extension'
import { hasOperationsDisabled } from '@/utils/prefix'
import { refreshOdaTokenMetadata } from '@/services/oda'
import type { NFT } from '@/types'
import type { Abi } from '@/composables/transaction/types'

const { $i18n, $consola } = useNuxtApp()
const { toast } = useToastOruga()
const { accountId } = useAuth()
const { transaction, isLoading, status } = useTransaction()
const { listNftByNftWithMetadata } = useListingCartModal()
const preferencesStore = usePreferencesStore()
const { urlPrefix } = usePrefix()
const route = useRoute()

const props = defineProps<{
  nft?: NFT
  mimeType?: string
  imageUrl?: string
  imageData?: string
  abi?: Abi | null
}>()

const action = ref<'unlist' | ''>('')

const id = computed(() => route.params.id.toString())
const isOwner = computed(() => accountId.value === props.nft?.currentOwner)
const isCollectionOwner = computed(() => accountId.value === props.nft?.collection?.currentOwner)
const nftId = computed(() => props.nft?.id || '')

const { data } = useQuery({
  queryKey: ['nft-with-metadata', nftId],
  queryFn: async () =>
    nftId.value && canDoActions.value
      ? (await useAsyncGraphql({
          query: 'nftEntitiesByIDs',
          variables: { ids: [nftId.value] },
        })).data.value
      : null,
})

const nftWithMetadata = computed<NFTWithMetadata>(() => data.value?.nftEntities?.[0])
const canDoActions = computed(() => props.nft && isOwner.value)

const signingModalTitle = computed(() => {
  return (
    {
      unlist: $i18n.t('mint.nft.delisting'),
    }[action.value] || ''
  )
})

const isDownloadEnabled = computed(() => {
  const mimeType = props.mimeType
  return ((
    (mimeType?.includes('image') || mimeType?.includes('text/html'))
    && props.imageUrl) || props.imageData
  )
})

const downloadMedia = async () => {
  let imageUrl = sanitizeIpfsUrl(props.imageUrl)

  if (!imageUrl) {
    return
  }

  if (props.imageData) {
    const blob = await $fetch<Blob>(props.imageData)
    imageUrl = URL.createObjectURL(blob)
  }
  else if (props.mimeType?.includes('image')) {
    imageUrl = toOriginalContentUrl(imageUrl)
  }

  if (isMobileDevice) {
    toast($i18n.t('toast.downloadOnMobile'))
    setTimeout(() => {
      window.open(imageUrl, '_blank')
    }, 2000)
    return
  }

  try {
    toast($i18n.t('toast.downloadImage'))
    downloadImage(imageUrl, `${props.nft?.collection?.name}_${props.nft?.name}`)
  }
  catch (error) {
    $consola.warn('[ERR] unable to fetch image')
    toast($i18n.t('toast.downloadError'))
  }
}

const burn = () => {
  openUserCartModal('burn')
}

const tryAgain = () => {
  const map = { unlist }
  map[action.value]?.()
}

const unlist = () => {
  action.value = 'unlist'
  transaction({
    interaction: Interaction.LIST,
    urlPrefix: urlPrefix.value,
    token: {
      nftId: id.value,
      price: '0',
    },
    successMessage: $i18n.t('transaction.unlist.success') as string,
    errorMessage: $i18n.t('transaction.unlist.error') as string,
  })
}

const refreshMetadata = async () => {
  if (props.nft?.collection?.id && props.nft?.sn) {
    toast($i18n.t('toast.refreshMetdata'))
    await refreshOdaTokenMetadata(urlPrefix.value, props.nft.collection.id, props.nft.sn)
  }
}

const openUserCartModal = (mode: UserCartMode) => {
  if (nftWithMetadata.value) {
    listNftByNftWithMetadata(nftWithMetadata.value)
    preferencesStore.setOpenedUserCartModal(mode)
  }
}

const transfer = () => openUserCartModal('transfer')
</script>
