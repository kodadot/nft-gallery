<template>
  <NeoDropdown>
    <NeoButton icon="ellipsis-v" />

    <template #items>
      <NeoDropdownItem
        v-if="
          currentOwner === accountId && mimeType.includes('image') && ipfsImage
        "
        item="Download"
        @click.native="downloadMedia" />
      <NeoDropdownItem
        v-if="currentOwner === accountId"
        item="Burn"
        @click.native="burn" />
      <NeoDropdownItem disabled item="Report" />
    </template>
  </NeoDropdown>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { Interaction } from '@kodadot1/minimark'
import { downloadImage } from '@/utils/download'
import { ipfsToCf } from '@/utils/ipfs'

const { $route, $i18n } = useNuxtApp()
const { accountId } = useAuth()
const { transaction } = useTransaction()
const { urlPrefix } = usePrefix()

const props = defineProps<{
  mimeType: string
  name?: string
  ipfsImage?: string
  currentOwner?: string
}>()

const downloadMedia = () => {
  props.ipfsImage && downloadImage(ipfsToCf(props.ipfsImage), props.name)
}

const burn = () => {
  transaction({
    interaction: Interaction.CONSUME,
    urlPrefix: urlPrefix.value,
    nftId: $route.params.id,
    successMessage: $i18n.t('transaction.consume.success') as string,
    errorMessage: $i18n.t('transaction.consume.error') as string,
  })
}
</script>
