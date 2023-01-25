<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <NeoDropdown>
      <NeoButton icon="ellipsis-v" />

      <template #items>
        <NeoDropdownItem
          v-if="mimeType.includes('image') && ipfsImage"
          item="Download"
          @click.native="downloadMedia" />
        <NeoDropdownItem
          v-if="accountId === currentOwner && price !== '0'"
          item="Delist"
          @click.native="unlist" />
        <NeoDropdownItem disabled item="Report" />
      </template>
    </NeoDropdown>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { Interaction } from '@kodadot1/minimark'
import { downloadImage } from '@/utils/download'
import { ipfsToCf } from '@/utils/ipfs'

const { $route, $i18n } = useNuxtApp()
const { accountId } = useAuth()
const { transaction, isLoading, status } = useTransaction()
const { urlPrefix } = usePrefix()

const props = defineProps<{
  mimeType: string
  name?: string
  ipfsImage?: string
  currentOwner?: string
  price?: string
}>()

const downloadMedia = () => {
  props.ipfsImage && downloadImage(ipfsToCf(props.ipfsImage), props.name)
}

const unlist = () => {
  transaction({
    interaction: Interaction.UNLIST,
    urlPrefix: urlPrefix.value,
    nftId: $route.params.id,
    successMessage: $i18n.t('transaction.unlist.success') as string,
    errorMessage: $i18n.t('transaction.unlist.error') as string,
  })
}
</script>
