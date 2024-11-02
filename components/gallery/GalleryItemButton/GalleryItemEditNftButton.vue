<template>
  <NeoDropdownItem
    :disabled="!metadata"
    @click="isModalActive = true"
  >
    Edit
  </NeoDropdownItem>

  <SigningModal
    :title="$t('edit.collection.modal')"
    :is-loading="isLoading"
    :status="status"
    @try-again="submit"
  />

  <EditNftModal
    v-model="isModalActive"
    :metadata="metadata"
    @submit="submit"
  />
</template>

<script setup lang="ts">
import { NeoDropdownItem } from '@kodadot1/brick'
import type { Metadata } from '@kodadot1/minimark/common'
import { refreshOdaTokenMetadata } from '@/services/oda'
import { type ActionMetadataSetMetadata, NFTs } from '@/composables/transaction/types'
import type { NFT } from '@/types'

const props = defineProps<{
  nft?: NFT
}>()

const { $i18n } = useNuxtApp()
const { transaction, status, isLoading } = useTransaction()
const { urlPrefix } = usePrefix()

const isModalActive = ref(false)

const metadata = ref<Metadata>()

const submit = async (metadata: ActionMetadataSetMetadata) => {
  isModalActive.value = false

  await transaction({
    interaction: NFTs.SET_METADATA,
    nftSn: props.nft?.sn as string,
    collectionId: props.nft?.collection.id as string,
    metadata,
    urlPrefix: urlPrefix.value,
    successMessage: $i18n.t('edit.collection.success'),
  })

  await refreshOdaTokenMetadata(urlPrefix.value, props.nft?.collection.id as string, props.nft?.sn as string)
}

watchEffect(async () => {
  metadata.value = await $fetch<Metadata>(sanitizeIpfsUrl(props.nft?.metadata))
})
</script>
