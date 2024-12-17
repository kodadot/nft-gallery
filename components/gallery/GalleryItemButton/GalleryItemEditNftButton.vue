<template>
  <NeoDropdownItem
    :disabled="!metadata"
    @click="isModalActive = true"
  >
    {{ $t('massmint.edit') }}
  </NeoDropdownItem>

  <SigningModal
    :title="$t('edit.nft.transaction')"
    :is-loading="isLoading"
    :status="status"
    @try-again="submit"
  />

  <EditNftModal
    v-if="metadata"
    v-model="isModalActive"
    :metadata="metadata"
    @submit="submit"
  />
</template>

<script setup lang="ts">
import { NeoDropdownItem } from '@kodadot1/brick'
import { useQuery } from '@tanstack/vue-query'
import { refreshOdaTokenMetadata } from '@/services/oda'
import { type ActionMetadataSetMetadata, NFTs } from '@/composables/transaction/types'
import type { NFT } from '@/types'
import type { Metadata } from '@/services/nftStorage'

const props = defineProps<{
  nft?: NFT
}>()

const { $i18n } = useNuxtApp()
const { transaction, status, isLoading } = useTransaction()
const { urlPrefix } = usePrefix()

const { data: metadata } = useQuery({
  queryKey: ['nft-metadata', computed(() => props.nft?.metadata)],
  queryFn: () => props.nft ? $fetch<Metadata>(sanitizeIpfsUrl(props.nft.metadata)) : undefined,
})

const isModalActive = ref(false)

const submit = async (metadata: ActionMetadataSetMetadata) => {
  if (!props.nft) {
    return
  }

  isModalActive.value = false

  const nftSn = props.nft.sn
  const collectionId = props.nft.collection.id

  await transaction({
    interaction: NFTs.SET_METADATA,
    nftSn,
    collectionId,
    metadata,
    urlPrefix: urlPrefix.value,
    successMessage: $i18n.t('edit.collection.success'),
  })

  await refreshOdaTokenMetadata(urlPrefix.value, collectionId, nftSn)
}
</script>
