<template>
  <NeoDropdown>
    <NeoButton label="⋮" />

    <template #items>
      <NeoDropdownItem
        v-if="currentGalleryItem.mimeType.includes('image')"
        item="Download"
        @click.native="downloadMedia" />
      <NeoDropdownItem
        :disabled="currentGalleryItem.currentOwner !== accountId"
        item="Burn"
        @click.native="burn" />
      <NeoDropdownItem disabled item="Report" />
    </template>
  </NeoDropdown>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { downloadImage } from '~/utils/download'
import { Interaction } from '@kodadot1/minimark'

const { $store, $route, $i18n } = useNuxtApp()
const { accountId } = useAuth()
const { transaction } = useTransaction()
const { urlPrefix } = usePrefix()
const currentGalleryItem = $store.getters['history/getCurrentlyViewedItem']

const downloadMedia = () => {
  const { image, name } = currentGalleryItem
  image && downloadImage(image, name)
}

const burn = () => {
  const { id } = currentGalleryItem
  transaction({
    interaction: Interaction.CONSUME,
    urlPrefix: urlPrefix.value,
    nftId: $route.params.id || id,
    successMessage: $i18n.t('transaction.item.success') as string,
    errorMessage: $i18n.t('transaction.item.error') as string,
  })
}
</script>
