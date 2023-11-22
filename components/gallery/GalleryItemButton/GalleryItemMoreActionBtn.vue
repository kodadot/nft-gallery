<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <NeoDropdown position="bottom-left" :mobile-modal="false">
      <template #trigger="{ active }">
        <NeoButton
          class="icon-action"
          icon="ellipsis-vertical"
          :active="active" />
      </template>
      <component
        :is="isMobileDevice ? 'a' : 'div'"
        v-if="mimeType?.includes('image') && ipfsImage"
        :href="toOriginalContentUrl(ipfsImage)"
        target="_blank">
        <NeoDropdownItem
          data-testid="gallery-item-more-dropdown-download"
          @click="downloadMedia">
          Download
        </NeoDropdownItem>
      </component>

      <template v-if="accountId === currentOwner">
        <NeoDropdownItem @click="burn">Burn</NeoDropdownItem>
        <NeoDropdownItem v-if="price !== '0'" @click="unlist">
          Delist
        </NeoDropdownItem>
      </template>
      <NeoDropdownItem disabled>Report</NeoDropdownItem>
    </NeoDropdown>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoDropdown, NeoDropdownItem } from '@kodadot1/brick'
import { Interaction } from '@kodadot1/minimark/v1'
import { downloadImage } from '@/utils/download'
import { toOriginalContentUrl } from '@/utils/ipfs'
import Loader from '@/components/shared/Loader.vue'
import { isMobileDevice } from '@/utils/extension'

const { $i18n, $consola } = useNuxtApp()
const { toast } = useToast()
const { accountId } = useAuth()
const { transaction, isLoading, status } = useTransaction()
const { urlPrefix } = usePrefix()
const route = useRoute()

const props = defineProps<{
  mimeType?: string
  name?: string
  ipfsImage?: string
  currentOwner?: string
  price?: string
}>()

const downloadMedia = () => {
  if (!isMobileDevice && props.ipfsImage) {
    try {
      downloadImage(toOriginalContentUrl(props.ipfsImage), props.name)
    } catch (error) {
      $consola.warn('[ERR] unable to fetch image')
      toast($i18n.t('toast.downloadError'))
      return
    }
  }
}

const burn = () => {
  transaction({
    interaction: Interaction.CONSUME,
    urlPrefix: urlPrefix.value,
    nftId: route.params.id as string,
    successMessage: $i18n.t('transaction.consume.success') as string,
    errorMessage: $i18n.t('transaction.consume.error') as string,
  })
}

const unlist = () => {
  transaction({
    interaction: Interaction.LIST,
    urlPrefix: urlPrefix.value,
    token: {
      nftId: route.params.id as string,
      price: '0',
    },
    successMessage: $i18n.t('transaction.unlist.success') as string,
    errorMessage: $i18n.t('transaction.unlist.error') as string,
  })
}
</script>
