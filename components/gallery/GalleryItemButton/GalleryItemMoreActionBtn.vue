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
import { useQuery } from '@tanstack/vue-query'
import GalleryItemEditNftButton from './GalleryItemEditNftButton.vue'
import { Interaction } from '@/utils/shoppingActions'
import { hasOperationsDisabled } from '@/utils/prefix'
import { refreshOdaTokenMetadata } from '@/services/oda'
import type { NFT } from '@/types'
import type { Abi } from '@/composables/transaction/types'

const { $i18n } = useNuxtApp()
const { toast } = useToast()
const { isCurrentAccount } = useAuth()
const { transaction, isLoading, status } = useTransaction()
const { listNftByNftWithMetadata } = useListingCartModal()
const preferencesStore = usePreferencesStore()
const { urlPrefix } = usePrefix()
const route = useRoute()

const props = defineProps<{
  nft?: NFT
  abi?: Abi | null
}>()

const action = ref<'unlist' | ''>('')

const id = computed(() => route.params.id.toString())
const isOwner = computed(() => isCurrentAccount(props.nft?.currentOwner))
const isCollectionOwner = computed(() => isCurrentAccount(props.nft?.collection?.currentOwner))
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
